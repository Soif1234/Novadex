import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, mainnet, bsc, base } from 'wagmi/chains';
import {
  metaMaskWallet,
  coinbaseWallet,
  injectedWallet,
} from '@rainbow-me/rainbowkit/wallets';

const projectId = (import.meta as any).env?.VITE_WALLETCONNECT_PROJECT_ID || 'c06db1f32a76f23cde0c564c7ccfa893';

export const config = getDefaultConfig({
  appName: 'NovaDEX',
  projectId,
  chains: [arbitrum, mainnet, bsc, base],
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet, coinbaseWallet, injectedWallet],
    },
  ],
  ssr: false,
});
