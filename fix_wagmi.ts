import fs from 'fs';
let content = fs.readFileSync('src/wagmiConfig.ts', 'utf8');
content = content.replace(
  "const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'c06db1f32a76f23cde0c564c7ccfa893';",
  "const projectId = (import.meta as any).env?.VITE_WALLETCONNECT_PROJECT_ID || 'c06db1f32a76f23cde0c564c7ccfa893';"
);
fs.writeFileSync('src/wagmiConfig.ts', content);
