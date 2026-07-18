import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add imports
content = content.replace(
  "import { WagmiProvider } from 'wagmi';",
  "import { WagmiProvider } from 'wagmi';\nimport { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';\nimport '@rainbow-me/rainbowkit/styles.css';"
);

// Wrap with RainbowKitProvider
content = content.replace(
  "<QueryClientProvider client={queryClient}>",
  "<QueryClientProvider client={queryClient}>\n          <RainbowKitProvider theme={darkTheme({ accentColor: '#3b82f6', accentColorForeground: 'white' })}>"
);

content = content.replace(
  "</QueryClientProvider>",
  "</RainbowKitProvider>\n        </QueryClientProvider>"
);

fs.writeFileSync('src/App.tsx', content);

