import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ChatInterface } from '@/components/chat/ChatInterface';

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6 h-full">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">AI Assistant</h1>
            <p className="text-muted-foreground mt-2">
              Chat with our AI to analyze Avalanche blockchain data, get insights, and explore DeFi opportunities.
            </p>
          </div>
          <div className="h-[calc(100vh-200px)]">
            <ChatInterface />
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}