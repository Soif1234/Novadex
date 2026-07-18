import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ethers } from 'ethers';

interface UserProfile {
  username?: string;
  usernameId?: string;
  email?: string;
  address?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserProfile | null;
  wallet: ethers.Wallet | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [wallet, setWallet] = useState<ethers.Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          
          if (!data.address || !data.privateKey) {
            const generatedWallet = ethers.Wallet.createRandom();
            data.address = generatedWallet.address;
            data.privateKey = generatedWallet.privateKey;
            await setDoc(userDocRef, { address: data.address, privateKey: data.privateKey }, { merge: true });
          }
          
          setUserData(data);
          if (data.privateKey) {
            setWallet(new ethers.Wallet(data.privateKey));
          }
        }
      } else {
        setWallet(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const generatedWallet = ethers.Wallet.createRandom();
    
    // Generate username from email
    const baseUsername = email.split('@')[0];
    const usernameId = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digit id
    const username = `${baseUsername}#${usernameId}`;
    
    const newUserData = {
      email,
      username,
      usernameId,
      address: generatedWallet.address,
      privateKey: generatedWallet.privateKey, // Insecure for production!
      createdAt: new Date().toISOString()
    };
    
    await setDoc(doc(db, 'users', userCredential.user.uid), newUserData);
    
    setWallet(generatedWallet);
    setUserData(newUserData);
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, userData, wallet, loading, signup, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
