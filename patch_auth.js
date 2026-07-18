const fs = require('fs');
let code = fs.readFileSync('src/AuthContext.tsx', 'utf-8');

code = code.replace(
`        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          if (data.privateKey) {
            setWallet(new ethers.Wallet(data.privateKey));
          }
        }`,
`        if (userDoc.exists()) {
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
        }`
);

fs.writeFileSync('src/AuthContext.tsx', code);
