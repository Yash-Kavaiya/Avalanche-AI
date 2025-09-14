import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useWalletStore } from '@/store/wallet-store';
import { WalletComparison } from './WalletComparison';
import { WalletScoring } from './WalletScoring';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Activity,
  PieChart,
  BarChart3,
  Calendar,
  Search,
  AlertTriangle,
  Shield,
  Target,
  Zap,
  ArrowLeftRight
} from 'lucide-react';

interface WalletStats {
  address: string;
  balance: number;
  transactionCount: number;
  firstSeen: Date;
  lastActivity: Date;
  riskScore: number;
  diversificationScore: number;
  activityScore: number;
  profitLoss: number;
}

interface TokenHolding {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  percentage: number;
  change24h: number;
}

interface TransactionPattern {
  type: 'incoming' | 'outgoing' | 'swap' | 'defi';
  count: number;
  volume: number;
  avgAmount: number;
  frequency: string;
}

interface RiskFactor {
  factor: string;
  score: number;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export function WalletAnalysis() {
  const [walletAddress, setWalletAddress] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [walletStats, setWalletStats] = useState<WalletStats | null>(null);
  const [tokenHoldings, setTokenHoldings] = useState<TokenHolding[]>([]);
  const [txPatterns, setTxPatterns] = useState<TransactionPattern[]>([]);
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  const { toast } = useToast();
  const { wallets } = useWalletStore();

  const analyzeWallet = async () => {
    if (!walletAddress.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a valid Avalanche wallet address",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simulate comprehensive wallet analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock comprehensive wallet data
      const mockStats: WalletStats = {
        address: walletAddress,
        balance: Math.random() * 10000 + 1000,
        transactionCount: Math.floor(Math.random() * 1000) + 50,
        firstSeen: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        riskScore: Math.random() * 100,
        diversificationScore: Math.random() * 100,
        activityScore: Math.random() * 100,
        profitLoss: (Math.random() - 0.5) * 50000
      };

      const mockTokens: TokenHolding[] = [
        {
          symbol: 'AVAX',
          name: 'Avalanche',
          balance: mockStats.balance * 0.6,
          value: mockStats.balance * 0.6 * 35,
          percentage: 60,
          change24h: (Math.random() - 0.5) * 20
        },
        {
          symbol: 'USDC',
          name: 'USD Coin',
          balance: mockStats.balance * 0.3,
          value: mockStats.balance * 0.3,
          percentage: 30,
          change24h: (Math.random() - 0.5) * 2
        },
        {
          symbol: 'JOE',
          name: 'JoeToken',
          balance: mockStats.balance * 0.1,
          value: mockStats.balance * 0.1 * 0.5,
          percentage: 10,
          change24h: (Math.random() - 0.5) * 15
        }
      ];

      const mockPatterns: TransactionPattern[] = [
        {
          type: 'incoming',
          count: Math.floor(mockStats.transactionCount * 0.4),
          volume: mockStats.balance * 2,
          avgAmount: mockStats.balance * 2 / (mockStats.transactionCount * 0.4),
          frequency: 'Daily'
        },
        {
          type: 'outgoing',
          count: Math.floor(mockStats.transactionCount * 0.3),
          volume: mockStats.balance * 1.5,
          avgAmount: mockStats.balance * 1.5 / (mockStats.transactionCount * 0.3),
          frequency: 'Weekly'
        },
        {
          type: 'defi',
          count: Math.floor(mockStats.transactionCount * 0.2),
          volume: mockStats.balance * 3,
          avgAmount: mockStats.balance * 3 / (mockStats.transactionCount * 0.2),
          frequency: 'Monthly'
        },
        {
          type: 'swap',
          count: Math.floor(mockStats.transactionCount * 0.1),
          volume: mockStats.balance * 0.5,
          avgAmount: mockStats.balance * 0.5 / (mockStats.transactionCount * 0.1),
          frequency: 'Bi-weekly'
        }
      ];

      const mockRiskFactors: RiskFactor[] = [
        {
          factor: 'Concentration Risk',
          score: 100 - mockStats.diversificationScore,
          description: 'Portfolio heavily concentrated in few assets',
          severity: mockStats.diversificationScore < 30 ? 'high' : mockStats.diversificationScore < 60 ? 'medium' : 'low'
        },
        {
          factor: 'Activity Pattern',
          score: mockStats.activityScore < 50 ? 80 : 20,
          description: mockStats.activityScore < 50 ? 'Irregular transaction patterns detected' : 'Normal activity patterns',
          severity: mockStats.activityScore < 30 ? 'high' : mockStats.activityScore < 60 ? 'medium' : 'low'
        },
        {
          factor: 'Smart Contract Exposure',
          score: Math.random() * 60,
          description: 'Interactions with unverified smart contracts',
          severity: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
        }
      ];

      setWalletStats(mockStats);
      setTokenHoldings(mockTokens);
      setTxPatterns(mockPatterns);
      setRiskFactors(mockRiskFactors);

      toast({
        title: "Analysis Complete",
        description: "Comprehensive wallet analysis generated successfully"
      });

    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze wallet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-600';
    if (score < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Wallet Analysis</h2>
        <p className="text-slate-600 mt-2">
          Comprehensive analysis of Avalanche wallet performance, risk assessment, and portfolio insights
        </p>
      </div>

      {/* Analysis Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Analyze Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter Avalanche wallet address (0x...)"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="font-mono"
              />
            </div>
            <Button 
              onClick={analyzeWallet}
              disabled={isAnalyzing}
              className="px-8"
            >
              {isAnalyzing ? (
                <>
                  <Activity className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </div>
          
          {/* Quick Actions for Connected Wallets */}
          {wallets.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-slate-600 mb-2">Quick analyze your connected wallets:</p>
              <div className="flex gap-2 flex-wrap">
                {wallets.map((wallet, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setWalletAddress(wallet.address)}
                    className="font-mono text-xs"
                  >
                    <Wallet className="h-3 w-3 mr-1" />
                    {formatAddress(wallet.address)}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {walletStats && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Total Balance</p>
                    <p className="text-2xl font-bold">{formatCurrency(walletStats.balance * 35)}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {walletStats.balance.toFixed(4)} AVAX
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Risk Score</p>
                    <p className={`text-2xl font-bold ${getRiskColor(walletStats.riskScore)}`}>
                      {walletStats.riskScore.toFixed(0)}%
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {walletStats.riskScore < 30 ? 'Low Risk' : walletStats.riskScore < 70 ? 'Medium Risk' : 'High Risk'}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Transactions</p>
                    <p className="text-2xl font-bold">{walletStats.transactionCount.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Since {walletStats.firstSeen.toLocaleDateString()}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">P&L</p>
                    <p className={`text-2xl font-bold ${walletStats.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {walletStats.profitLoss >= 0 ? '+' : ''}{formatCurrency(walletStats.profitLoss)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Estimated unrealized
                    </p>
                  </div>
                  {walletStats.profitLoss >= 0 ? (
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  ) : (
                    <TrendingDown className="h-8 w-8 text-red-600" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analysis Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Portfolio</TabsTrigger>
              <TabsTrigger value="patterns">Patterns</TabsTrigger>
              <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
              <TabsTrigger value="scoring">Score Report</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="compare">Compare</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Token Holdings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Token Holdings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {tokenHoldings.map((token, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{token.symbol}</span>
                            <span className="text-sm text-slate-600">{token.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(token.value)}</p>
                            <p className={`text-sm ${token.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                        <Progress value={token.percentage} className="h-2" />
                        <p className="text-xs text-slate-500">
                          {token.balance.toFixed(4)} {token.symbol} ({token.percentage}%)
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Portfolio Scores */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Portfolio Scores
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Diversification</span>
                        <span className="font-semibold">{walletStats.diversificationScore.toFixed(0)}/100</span>
                      </div>
                      <Progress value={walletStats.diversificationScore} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Activity Score</span>
                        <span className="font-semibold">{walletStats.activityScore.toFixed(0)}/100</span>
                      </div>
                      <Progress value={walletStats.activityScore} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Risk Management</span>
                        <span className="font-semibold">{(100 - walletStats.riskScore).toFixed(0)}/100</span>
                      </div>
                      <Progress value={100 - walletStats.riskScore} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="patterns" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Transaction Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {txPatterns.map((pattern, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold capitalize">{pattern.type} Transactions</h3>
                          <Badge variant="outline">{pattern.frequency}</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Count:</span>
                            <span>{pattern.count.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Volume:</span>
                            <span>{formatCurrency(pattern.volume)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Avg Amount:</span>
                            <span>{formatCurrency(pattern.avgAmount)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risk" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {riskFactors.map((factor, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{factor.factor}</h3>
                        <Badge className={getSeverityColor(factor.severity)}>
                          {factor.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{factor.description}</p>
                      <div className="flex items-center gap-2">
                        <Progress value={factor.score} className="flex-1 h-2" />
                        <span className="text-sm font-medium">{factor.score.toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Key Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-900">Portfolio Concentration</h4>
                      <p className="text-sm text-blue-800">
                        Your portfolio is {walletStats.diversificationScore < 50 ? 'highly concentrated' : 'well diversified'} 
                        with {tokenHoldings.length} different assets.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-900">Activity Level</h4>
                      <p className="text-sm text-green-800">
                        {walletStats.activityScore > 70 ? 'High activity' : walletStats.activityScore > 40 ? 'Moderate activity' : 'Low activity'} 
                        with {walletStats.transactionCount} transactions to date.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <h4 className="font-semibold text-purple-900">DeFi Engagement</h4>
                      <p className="text-sm text-purple-800">
                        {txPatterns.find(p => p.type === 'defi')?.count || 0} DeFi interactions detected, 
                        showing {(txPatterns.find(p => p.type === 'defi')?.count || 0) > 50 ? 'active' : 'limited'} 
                        participation in decentralized finance.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Wallet Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-semibold">First Activity</p>
                          <p className="text-sm text-slate-600">
                            {walletStats.firstSeen.toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-semibold">Latest Activity</p>
                          <p className="text-sm text-slate-600">
                            {walletStats.lastActivity.toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div>
                          <p className="font-semibold">Wallet Age</p>
                          <p className="text-sm text-slate-600">
                            {Math.floor((Date.now() - walletStats.firstSeen.getTime()) / (1000 * 60 * 60 * 24))} days
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="scoring" className="space-y-4">
              <WalletScoring
                walletAddress={walletStats.address}
                balance={walletStats.balance}
                transactionCount={walletStats.transactionCount}
                riskScore={walletStats.riskScore}
                diversificationScore={walletStats.diversificationScore}
                activityScore={walletStats.activityScore}
                profitLoss={walletStats.profitLoss}
                age={Math.floor((Date.now() - walletStats.firstSeen.getTime()) / (1000 * 60 * 60 * 24))}
              />
            </TabsContent>

            <TabsContent value="compare" className="space-y-4">
              <WalletComparison />
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Comparison Section for Non-analyzed State */}
      {!walletStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5" />
              Wallet Comparison Tool
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Compare two wallets side-by-side to analyze performance differences, 
              risk profiles, and activity patterns.
            </p>
            <WalletComparison />
          </CardContent>
        </Card>
      )}
    </div>
  );
}