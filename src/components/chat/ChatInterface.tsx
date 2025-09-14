import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Bot,
  User,
  Sparkles,
  Mountain,
  Settings
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useChatStore } from '@/store/chat-store';
import { useVoiceStore } from '@/store/voice-store';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function ChatInterface() {
  const [input, setInput] = useState('');
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    currentConversation,
    isStreaming,
    streamingMessage,
    selectedModel,
    sendMessage,
    setModel,
    createConversation,
  } = useChatStore();
  
  const {
    isRecording,
    isProcessing,
    transcription,
    startRecording,
    stopRecording,
    textToSpeech,
    isSynthesizing,
  } = useVoiceStore();
  
  const { toast } = useToast();

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentConversation?.messages, streamingMessage]);

  // Focus input when not streaming
  useEffect(() => {
    if (!isStreaming && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isStreaming]);

  // Use transcription when available
  useEffect(() => {
    if (transcription) {
      setInput(transcription);
    }
  }, [transcription]);

  const handleSendMessage = async () => {
    if (!input.trim() || isStreaming) return;
    
    const messageText = input.trim();
    setInput('');
    
    try {
      await sendMessage(messageText);
      
      // Auto-generate TTS for assistant response if audio is enabled
      if (isAudioEnabled && currentConversation?.messages.length > 0) {
        const lastMessage = currentConversation.messages[currentConversation.messages.length - 1];
        if (lastMessage.role === 'assistant') {
          try {
            const audioUrl = await textToSpeech(lastMessage.content);
            // Auto-play audio
            const audio = new Audio(audioUrl);
            audio.play().catch(console.error);
          } catch (error) {
            console.error('TTS error:', error);
          }
        }
      }
    } catch (error) {
      toast({
        title: 'Failed to send message',
        description: 'Please try again or check your connection.',
        variant: 'destructive',
      });
    }
  };

  const handleVoiceToggle = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      try {
        await startRecording();
      } catch (error) {
        toast({
          title: 'Microphone access denied',
          description: 'Please allow microphone access to use voice features.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!currentConversation) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Welcome to Avalanche AI</h3>
          <p className="text-muted-foreground mb-6">
            Your intelligent blockchain analytics assistant. Ask questions about Avalanche, 
            analyze wallets, or explore DeFi protocols.
          </p>
          <Button onClick={createConversation} className="w-full">
            Start New Conversation
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Mountain className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{currentConversation.title}</h3>
            <p className="text-xs text-muted-foreground">
              {currentConversation.messages.length} messages
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedModel} onValueChange={setModel}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="devv-default">DevvAI (Default)</SelectItem>
              <SelectItem value="kimi-k2-0711-preview">Kimi-K2</SelectItem>
              <SelectItem value="anthropic/claude-3-sonnet">Claude 3 Sonnet</SelectItem>
              <SelectItem value="openai/gpt-4">GPT-4</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className={cn(isAudioEnabled && "bg-primary/10 text-primary")}
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4 max-w-4xl mx-auto">
          {currentConversation.messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 animate-fade-in",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-3",
                  message.role === 'user'
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-muted"
                )}
              >
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                <div className="text-xs opacity-70 mt-2">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
              
              {message.role === 'user' && (
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Streaming Message */}
          {isStreaming && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="whitespace-pre-wrap">
                    {streamingMessage}
                    <span className="animate-pulse ml-1">▋</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-border">
        <div className="max-w-4xl mx-auto">
          {/* Voice Status */}
          {(isRecording || isProcessing) && (
            <div className="mb-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              {isRecording && (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Recording...
                </>
              )}
              {isProcessing && (
                <>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  Processing audio...
                </>
              )}
            </div>
          )}
          
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Avalanche, analyze wallets, or explore DeFi..."
                className="pr-24"
                disabled={isStreaming || isRecording}
              />
              
              {/* Voice Button */}
              <Button
                type="button"
                size="sm"
                variant={isRecording ? "destructive" : "ghost"}
                className="absolute right-12 top-1/2 transform -translate-y-1/2"
                onClick={handleVoiceToggle}
                disabled={isStreaming}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>
            
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isStreaming}
              className="px-6"
            >
              {isStreaming ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          {/* Model Badge */}
          <div className="mt-2 flex items-center justify-center">
            <Badge variant="secondary" className="text-xs">
              {selectedModel === 'devv-default' ? 'DevvAI' : 
               selectedModel === 'kimi-k2-0711-preview' ? 'Kimi-K2' : 
               selectedModel.split('/')[1] || selectedModel}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}