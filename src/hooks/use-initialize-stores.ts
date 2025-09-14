import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useChatStore } from '@/store/chat-store';
import { useWalletStore } from '@/store/wallet-store';

export function useInitializeStores() {
  const checkSession = useAuthStore(state => state.checkSession);
  const createConversation = useChatStore(state => state.createConversation);
  const refreshNetworkData = useWalletStore(state => state.refreshNetworkData);

  useEffect(() => {
    // Check for existing auth session
    checkSession();
    
    // Initialize first conversation if none exists
    const conversations = useChatStore.getState().conversations;
    if (conversations.length === 0) {
      createConversation();
    }

    // Initialize blockchain data
    refreshNetworkData();
  }, [checkSession, createConversation, refreshNetworkData]);
}