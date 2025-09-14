import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { ChatInterface } from '@/components/chat/ChatInterface';
import BlockchainDashboard from '@/components/dashboard/BlockchainDashboard';
import TransactionAnalyzer from '@/components/dashboard/TransactionAnalyzer';
import DeFiAnalytics from '@/components/dashboard/DeFiAnalytics';
import { ContractAnalyzer } from '@/components/contracts/ContractAnalyzer';
import MarketIntelligence from '@/components/market/MarketIntelligence';
import { SubnetExplorer } from '@/components/subnets/SubnetExplorer';
import { NFTAnalytics } from '@/components/nft/NFTAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeProvider } from 'next-themes';
import { useInitializeStores } from '@/hooks/use-initialize-stores';

function HomePage() {
  useInitializeStores();
  
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ProtectedRoute>
        <DashboardLayout>
          <Tabs defaultValue="dashboard" className="w-full h-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
              <TabsTrigger value="contracts">Contracts</TabsTrigger>
              <TabsTrigger value="market">Market</TabsTrigger>
              <TabsTrigger value="subnets">Subnets</TabsTrigger>
              <TabsTrigger value="nfts">NFTs</TabsTrigger>
              <TabsTrigger value="chat">AI Chat</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="mt-6 h-full">
              <DashboardOverview />
            </TabsContent>
            
            <TabsContent value="chat" className="mt-6 h-[calc(100vh-12rem)]">
              <div className="h-full rounded-lg border bg-card">
                <ChatInterface />
              </div>
            </TabsContent>
            
            <TabsContent value="blockchain" className="mt-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="defi">DeFi</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-4">
                  <BlockchainDashboard />
                </TabsContent>
                <TabsContent value="transactions" className="mt-4">
                  <TransactionAnalyzer />
                </TabsContent>
                <TabsContent value="defi" className="mt-4">
                  <DeFiAnalytics />
                </TabsContent>
              </Tabs>
            </TabsContent>
            
            <TabsContent value="contracts" className="mt-6">
              <ContractAnalyzer />
            </TabsContent>
            
            <TabsContent value="market" className="mt-6">
              <MarketIntelligence />
            </TabsContent>
            
            <TabsContent value="subnets" className="mt-6">
              <SubnetExplorer />
            </TabsContent>
            
            <TabsContent value="nfts" className="mt-6">
              <NFTAnalytics />
            </TabsContent>
          </Tabs>
        </DashboardLayout>
      </ProtectedRoute>
    </ThemeProvider>
  );
}

export default HomePage;