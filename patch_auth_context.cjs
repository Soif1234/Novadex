const fs = require('fs');
let code = fs.readFileSync('src/AuthContext.tsx', 'utf-8');

code = code.replace(
`  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}`,
`  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  emailChainId: number;
  setEmailChainId: (id: number) => void;
}`
);

code = code.replace(
`  const [wallet, setWallet] = useState<ethers.Wallet | null>(null);`,
`  const [wallet, setWallet] = useState<ethers.Wallet | null>(null);
  const [emailChainId, setEmailChainId] = useState<number>(1);`
);

code = code.replace(
`    <AuthContext.Provider value={{ user, userData, wallet, loading, signup, login, logout }}>`,
`    <AuthContext.Provider value={{ user, userData, wallet, loading, signup, login, logout, emailChainId, setEmailChainId }}>`
);

fs.writeFileSync('src/AuthContext.tsx', code);
