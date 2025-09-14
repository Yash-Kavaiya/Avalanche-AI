import React, { useState, useEffect } from 'react';
import { useWalletStore } from '@/store/wallet-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  TrendingUp,
  TrendingDown,
  Coins,
  Percent,
  PiggyBank,
  ArrowUpRight,
  ArrowDownLeft,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

// Types for DeFi positions
interface DeFiPosition {
  protocol: string;
  type: 'lending' | 'borrowing' | 'liquidity' | 'staking';
  asset: string;
  amount: string;
  valueUsd: number;
  apy: number;
  healthFactor?: number;
  rewards?: string;
  status: 'active' | 'at_risk' | 'liquidation_risk';
}

interface ProtocolData {
  name: string;
  tvl: number;
  apy: number;
  category: string;
  risk: 'low' | 'medium' | 'high';
  logo?: string;
}

const DeFiAnalytics: React.FC = () => {
  const { selectedWallet, wallets } = useWalletStore();
  const { toast } = useToast();

  const [positions, setPositions] = useState<DeFiPosition[]>([]);
  const [protocols, setProtocols] = useState<ProtocolData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPortfolioValue, setTotalPortfolioValue] = useState(0);
  const [totalRewards, setTotalRewards] = useState(0);

  // Load DeFi positions for selected wallet
  useEffect(() => {
    if (selectedWallet) {
      loadDeFiPositions(selectedWallet);
    }
  }, [selectedWallet]);

  // Load protocol data on component mount
  useEffect(() => {
    loadProtocolData();
  }, []);

  // Mock DeFi position loading
  const loadDeFiPositions = async (address: string) => {
    setIsLoading(true);
    
    try {
      // Mock data - in real implementation, would fetch from DeFi protocols
      const mockPositions: DeFiPosition[] = [
        {
          protocol: 'Benqi',
          type: 'lending',
          asset: 'AVAX',
          amount: '100.5',
          valueUsd: 2512.5,
          apy: 4.2,
          rewards: '0.85 QI',
          status: 'active'
        },
        {
          protocol: 'Aave V3',
          type: 'borrowing',
          asset: 'USDC',
          amount: '1500',
          valueUsd: 1500,
          apy: 3.8,
          healthFactor: 2.45,
          status: 'active'
        },
        {
          protocol: 'Pangolin',
          type: 'liquidity',
          asset: 'AVAX-USDC LP',
          amount: '50.25',
          valueUsd: 3250,
          apy: 15.7,
          rewards: '2.34 PNG',
          status: 'active'
        },
        {
          protocol: 'Trader Joe',
          type: 'staking',
          asset: 'JOE',
          amount: '500',
          valueUsd: 850,
          apy: 12.3,
          rewards: '1.2 JOE',
          status: 'active'
        }
      ];

      setPositions(mockPositions);
      
      // Calculate totals
      const totalValue = mockPositions.reduce((sum, pos) => sum + pos.valueUsd, 0);
      setTotalPortfolioValue(totalValue);
      setTotalRewards(145.50); // Mock rewards value
      
    } catch (error) {
      console.error('Error loading DeFi positions:', error);
      toast({
        title: "Error",
        description: "Failed to load DeFi positions",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load protocol data
  const loadProtocolData = async () => {
    try {
      const mockProtocols: ProtocolData[] = [
        {
          name: 'Benqi',
          tvl: 125000000,
          apy: 4.2,
          category: 'Lending',
          risk: 'low'
        },
        {
          name: 'Aave V3',
          tvl: 85000000,
          apy: 3.8,
          category: 'Lending',
          risk: 'low'
        },
        {
          name: 'Pangolin',
          tvl: 45000000,
          apy: 15.7,
          category: 'DEX',
          risk: 'medium'
        },
        {
          name: 'Trader Joe',
          tvl: 180000000,
          apy: 12.3,
          category: 'DEX',
          risk: 'medium'
        },
        {
          name: 'Wonderland',
          tvl: 25000000,
          apy: 25.5,
          category: 'Yield Farming',
          risk: 'high'
        }
      ];
      
      setProtocols(mockProtocols);
    } catch (error) {
      console.error('Error loading protocol data:', error);
    }
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num.toFixed(0)}`;
  };

  // Get status icon
  const getStatusIcon = (status: DeFiPosition['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'at_risk':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'liquidation_risk':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  // Get type icon
  const getTypeIcon = (type: DeFiPosition['type']) => {
    switch (type) {
      case 'lending':
        return <PiggyBank className="h-4 w-4 text-blue-500" />;
      case 'borrowing':
        return <ArrowDownLeft className="h-4 w-4 text-red-500" />;
      case 'liquidity':
        return <Coins className="h-4 w-4 text-purple-500" />;
      case 'staking':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
    }
  };

  // Get risk badge color
  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const selectedWalletData = wallets.find(w => w.address === selectedWallet);

  return (
    <div className="space-y-6">
      {/* DeFi Portfolio Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total DeFi Value</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalPortfolioValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {positions.length} positions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Rewards</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalRewards)}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready to claim
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg APY</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {positions.length > 0 
                ? (positions.reduce((sum, pos) => sum + pos.apy, 0) / positions.length).toFixed(1)
                : '0.0'
              }%
            </div>
            <p className="text-xs text-muted-foreground">
              Weighted average
            </p>
          </CardContent>
        </Card>
      </div>

      {selectedWalletData ? (
        <Tabs defaultValue="positions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="positions">My Positions</TabsTrigger>
            <TabsTrigger value="protocols">Available Protocols</TabsTrigger>
            <TabsTrigger value="opportunities">Yield Opportunities</TabsTrigger>
          </TabsList>

          {/* My Positions Tab */}
          <TabsContent value="positions" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Active DeFi Positions</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => selectedWallet && loadDeFiPositions(selectedWallet)}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {positions.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <Coins className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No DeFi positions found</p>
                      <p className="text-sm">Start by depositing assets into protocols</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {positions.map((position, index) => (
                        <Card key={index} className="hover:bg-muted/50 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {getTypeIcon(position.type)}
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{position.protocol}</span>
                                    {getStatusIcon(position.status)}
                                  </div>
                                  <p className="text-sm text-muted-foreground capitalize">
                                    {position.type} • {position.asset}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <p className="font-semibold">
                                  {formatCurrency(position.valueUsd)}
                                </p>
                                <p className="text-sm text-green-600">
                                  {position.apy.toFixed(1)}% APY
                                </p>
                              </div>
                            </div>

                            <div className="mt-3 grid gap-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Amount:</span>
                                <span>{position.amount}</span>
                              </div>
                              
                              {position.rewards && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Rewards:</span>
                                  <span className="text-green-600">{position.rewards}</span>
                                </div>
                              )}
                              
                              {position.healthFactor && (
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">Health Factor:</span>
                                  <div className="flex items-center gap-2">
                                    <span className={
                                      position.healthFactor > 2 ? 'text-green-600' :
                                      position.healthFactor > 1.5 ? 'text-yellow-600' :
                                      'text-red-600'
                                    }>
                                      {position.healthFactor.toFixed(2)}
                                    </span>
                                    <Progress 
                                      value={Math.min(position.healthFactor * 20, 100)} 
                                      className="w-16 h-2"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Available Protocols Tab */}
          <TabsContent value="protocols" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Avalanche DeFi Protocols</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {protocols.map((protocol, index) => (
                    <Card key={index} className="hover:bg-muted/50 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{protocol.name}</h3>
                            <Badge className={getRiskColor(protocol.risk)}>
                              {protocol.risk}
                            </Badge>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Category:</span>
                            <span>{protocol.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">TVL:</span>
                            <span>{formatNumber(protocol.tvl)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">APY:</span>
                            <span className="text-green-600">{protocol.apy.toFixed(1)}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Yield Opportunities Tab */}
          <TabsContent value="opportunities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Best Yield Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-green-900">Wonderland TIME Staking</h4>
                      <span className="text-2xl font-bold text-green-700">25.5% APY</span>
                    </div>
                    <p className="text-sm text-green-700 mb-3">
                      High-yield staking with TIME token. Risk: Impermanent loss and smart contract risk.
                    </p>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Learn More
                    </Button>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-blue-900">Pangolin AVAX-USDC LP</h4>
                      <span className="text-2xl font-bold text-blue-700">15.7% APY</span>
                    </div>
                    <p className="text-sm text-blue-700 mb-3">
                      Provide liquidity for the most traded pair on Avalanche with PNG rewards.
                    </p>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Add Liquidity
                    </Button>
                  </div>

                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-purple-900">Trader Joe JOE Staking</h4>
                      <span className="text-2xl font-bold text-purple-700">12.3% APY</span>
                    </div>
                    <p className="text-sm text-purple-700 mb-3">
                      Stake JOE tokens to earn protocol fees and additional JOE rewards.
                    </p>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      Stake JOE
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <PiggyBank className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              Connect a wallet to view DeFi positions
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DeFiAnalytics;