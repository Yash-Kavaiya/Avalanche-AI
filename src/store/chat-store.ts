import { create } from 'zustand';
import { DevvAI, OpenRouterAI } from '@devvai/devv-code-backend';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
  model_used: string;
}

interface ChatState {
  conversations: ChatConversation[];
  currentConversation: ChatConversation | null;
  isStreaming: boolean;
  streamingMessage: string;
  selectedModel: 'devv-default' | 'kimi-k2-0711-preview' | string;
  
  // Actions
  createConversation: () => void;
  selectConversation: (id: string) => void;
  sendMessage: (content: string) => Promise<void>;
  setModel: (model: string) => void;
  loadConversations: () => void;
  deleteConversation: (id: string) => void;
  updateConversationTitle: (id: string, title: string) => void;
}

const devvAI = new DevvAI();
const openRouterAI = new OpenRouterAI();

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  isStreaming: false,
  streamingMessage: '',
  selectedModel: 'devv-default',

  createConversation: () => {
    const newConversation: ChatConversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: 'New Conversation',
      messages: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      model_used: get().selectedModel,
    };

    set(state => ({
      conversations: [newConversation, ...state.conversations],
      currentConversation: newConversation,
    }));
  },

  selectConversation: (id: string) => {
    const conversation = get().conversations.find(c => c.id === id);
    if (conversation) {
      set({ currentConversation: conversation });
    }
  },

  sendMessage: async (content: string) => {
    const { currentConversation, selectedModel } = get();
    
    if (!currentConversation) {
      get().createConversation();
    }

    const conversation = get().currentConversation!;
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    // Add user message immediately
    const updatedMessages = [...conversation.messages, userMessage];
    const updatedConversation = {
      ...conversation,
      messages: updatedMessages,
      updated_at: new Date().toISOString(),
    };

    set(state => ({
      currentConversation: updatedConversation,
      conversations: state.conversations.map(c => 
        c.id === conversation.id ? updatedConversation : c
      ),
      isStreaming: true,
      streamingMessage: '',
    }));

    try {
      // Auto-generate title for first message
      if (updatedMessages.length === 1) {
        const title = content.length > 50 ? content.slice(0, 47) + '...' : content;
        get().updateConversationTitle(conversation.id, title);
      }

      // Choose AI service based on model
      const ai = selectedModel.startsWith('devv-') || selectedModel === 'kimi-k2-0711-preview' 
        ? devvAI 
        : openRouterAI;

      const modelName = selectedModel === 'devv-default' ? 'default' : selectedModel;

      const messages = updatedMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const stream = await ai.chat.completions.create({
        model: modelName,
        messages,
        stream: true,
        max_tokens: 2000,
        temperature: 0.7,
      });

      let fullResponse = '';
      
      for await (const chunk of stream) {
        const deltaContent = chunk.choices[0]?.delta?.content || '';
        if (deltaContent) {
          fullResponse += deltaContent;
          set({ streamingMessage: fullResponse });
        }
      }

      // Create assistant message
      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}_assistant`,
        role: 'assistant',
        content: fullResponse,
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      const finalConversation = {
        ...updatedConversation,
        messages: finalMessages,
        updated_at: new Date().toISOString(),
      };

      set(state => ({
        currentConversation: finalConversation,
        conversations: state.conversations.map(c => 
          c.id === conversation.id ? finalConversation : c
        ),
        isStreaming: false,
        streamingMessage: '',
      }));

    } catch (error) {
      console.error('Chat error:', error);
      set({ 
        isStreaming: false, 
        streamingMessage: '',
      });
      throw error;
    }
  },

  setModel: (model: string) => {
    set({ selectedModel: model });
  },

  loadConversations: () => {
    // This will be implemented when we integrate with the database
    // For now, conversations are stored in component state
  },

  deleteConversation: (id: string) => {
    set(state => {
      const newConversations = state.conversations.filter(c => c.id !== id);
      const newCurrent = state.currentConversation?.id === id 
        ? (newConversations[0] || null)
        : state.currentConversation;
      
      return {
        conversations: newConversations,
        currentConversation: newCurrent,
      };
    });
  },

  updateConversationTitle: (id: string, title: string) => {
    set(state => ({
      conversations: state.conversations.map(c => 
        c.id === id ? { ...c, title, updated_at: new Date().toISOString() } : c
      ),
      currentConversation: state.currentConversation?.id === id
        ? { ...state.currentConversation, title, updated_at: new Date().toISOString() }
        : state.currentConversation,
    }));
  },
}));