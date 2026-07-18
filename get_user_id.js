// Just a snippet logic
const { address } = useAccount();
const { userData } = useAuth();
const userId = userData?.username || (address ? `user#${address.slice(2, 6)}` : '');
