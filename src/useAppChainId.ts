import { useChainId, useAccount } from 'wagmi';
import { useAuth } from './AuthContext';

export function useAppChainId() {
  const wagmiChainId = useChainId();
  const { isConnected } = useAccount();
  const { user, wallet, emailChainId } = useAuth();
  
  if (!isConnected && user && wallet) {
    return emailChainId || 1;
  }
  return wagmiChainId;
}
