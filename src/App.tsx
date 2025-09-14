import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import ChatPage from "@/pages/ChatPage";
import PortfolioPage from "@/pages/PortfolioPage";
import { WalletAnalysisPage } from "@/pages/WalletAnalysisPage";
import MarketIntelligencePage from "@/pages/MarketIntelligencePage";
import NotFoundPage from "@/pages/NotFoundPage";
import { PlaceholderPage } from "@/pages/PlaceholderPage";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { 
  BarChart3, 
  Wallet, 
  Search, 
  Coins, 
  Network, 
  Image, 
  Globe, 
  Shield, 
  Zap 
} from "lucide-react";

function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/wallet" element={<WalletAnalysisPage />} />
          <Route 
            path="/transactions" 
            element={
              <PlaceholderPage 
                title="Transaction Explorer" 
                description="Explore and analyze Avalanche blockchain transactions."
                icon={Search}
              />
            } 
          />
          <Route 
            path="/defi" 
            element={
              <PlaceholderPage 
                title="DeFi Positions" 
                description="Monitor your DeFi positions across Avalanche protocols."
                icon={Coins}
              />
            } 
          />
          <Route 
            path="/subnets" 
            element={
              <PlaceholderPage 
                title="Subnet Explorer" 
                description="Explore Avalanche subnets and validator networks."
                icon={Network}
              />
            } 
          />
          <Route 
            path="/nft" 
            element={
              <PlaceholderPage 
                title="NFT Analytics" 
                description="Analyze NFT collections and track your NFT portfolio."
                icon={Image}
              />
            } 
          />
          <Route path="/market" element={<MarketIntelligencePage />} />
          <Route 
            path="/security" 
            element={
              <PlaceholderPage 
                title="Security Scanner" 
                description="Scan smart contracts for security vulnerabilities."
                icon={Shield}
              />
            } 
          />
          <Route 
            path="/dev-tools" 
            element={
              <PlaceholderPage 
                title="Developer Tools" 
                description="Advanced development tools for Avalanche blockchain."
                icon={Zap}
              />
            } 
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
