import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  BarChart3, 
  PieChart, 
  Activity,
  Wallet,
  Plus,
  Search,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useWalletStore } from '@/store/wallet-store';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';

const PortfolioPage = () => {
  const { 
    wallets, 
    portfolioStats, 
    networkStats, 
    isLoadingWallets, 
    addWallet, 
    refreshAllData 
  } = useWalletStore();
  const { user } = useAuthStore();
  const [newWalletAddress, setNewWalletAddress] = React.useState('');

  const handleAddWallet = async () => {
    if (newWalletAddress.trim()) {
      await addWallet(newWalletAddress.trim());
      setNewWalletAddress('');
    }
  };

  const handleRefresh = () => {
    refreshAllData();
  };

  // Mock portfolio allocation data
  const portfolioAllocation = [
    { asset: 'AVAX', value: 15420.50, percentage: 65.2, change24h: 3.45 },
    { asset: 'USDC', value: 4200.00, percentage: 17.8, change24h: 0.02 },
    { asset: 'USDT', value: 2800.00, percentage: 11.9, change24h: -0.01 },
    { asset: 'JOE', value: 850.30, percentage: 3.6, change24h: -2.15 },
    { asset: 'PNG', value: 350.20, percentage: 1.5, change24h: 1.85 }
  ];

  // Mock DeFi positions
  const defiPositions = [
    { 
      protocol: 'Trader Joe', 
      position: 'AVAX-USDC LP', 
      value: 8500.00, 
      apy: 24.5, 
      status: 'active' 
    },
    { 
      protocol: 'Benqi', 
      position: 'AVAX Lending', 
      value: 5200.00, 
      apy: 12.3, 
      status: 'active' 
    },
    { 
      protocol: 'Pangolin', 
      position: 'PNG-AVAX LP', 
      value: 2100.00, 
      apy: 18.7, 
      status: 'active' 
    },
    { 
      protocol: 'Aave', 
      position: 'USDC Supply', 
      value: 3200.00, 
      apy: 8.9, 
      status: 'warning' 
    }
  ];

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-8 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Portfolio Analytics</h1>
            <p className="text-muted-foreground">
              Track your Avalanche portfolio performance and asset allocation
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isLoadingWallets}>
              <RefreshCw className={cn("w-4 h-4 mr-2", isLoadingWallets && "animate-spin")} />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${portfolioStats.totalValueUsd.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {portfolioStats.change24hPercent >= 0 ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <span className={portfolioStats.change24hPercent >= 0 ? "text-green-500" : "text-red-500"}>
                  {portfolioStats.change24hPercent >= 0 ? "+" : ""}{portfolioStats.change24hPercent.toFixed(2)}% from yesterday
                </span>
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connected Wallets</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{wallets.length}</div>
              <p className="text-xs text-muted-foreground">
                Tracking {wallets.length} wallet{wallets.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active DeFi Positions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{defiPositions.filter(p => p.status === 'active').length}</div>
              <p className="text-xs text-muted-foreground">
                Across {new Set(defiPositions.map(p => p.protocol)).size} protocols
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average APY</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(defiPositions.reduce((sum, p) => sum + p.apy, 0) / defiPositions.length).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Weighted average yield
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="wallets">Wallets</TabsTrigger>
            <TabsTrigger value="defi">DeFi Positions</TabsTrigger>
            <TabsTrigger value="allocation">Asset Allocation</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Portfolio Allocation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Asset Allocation
                  </CardTitle>
                  <CardDescription>Your portfolio breakdown by asset</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {portfolioAllocation.map((asset, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-primary" style={{
                          backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                        }} />
                        <span className="font-medium">{asset.asset}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span>${asset.value.toLocaleString()}</span>
                        <Badge variant="outline">{asset.percentage}%</Badge>
                        <span className={cn(
                          "text-xs",
                          asset.change24h >= 0 ? "text-green-500" : "text-red-500"
                        )}>
                          {asset.change24h >= 0 ? "+" : ""}{asset.change24h}%
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* DeFi Positions Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    DeFi Positions
                  </CardTitle>
                  <CardDescription>Your active DeFi positions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {defiPositions.slice(0, 4).map((position, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{position.protocol}</div>
                        <div className="text-sm text-muted-foreground">{position.position}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${position.value.toLocaleString()}</div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {position.apy}% APY
                          </Badge>
                          {position.status === 'active' ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <AlertTriangle className="w-3 h-3 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Wallets Tab */}
          <TabsContent value="wallets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Wallet Management</CardTitle>
                <CardDescription>Add and manage your Avalanche wallets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add New Wallet */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="wallet-address" className="sr-only">Wallet Address</Label>
                    <Input
                      id="wallet-address"
                      placeholder="Enter wallet address (0x...)"
                      value={newWalletAddress}
                      onChange={(e) => setNewWalletAddress(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddWallet} disabled={!newWalletAddress.trim()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Wallet
                  </Button>
                </div>

                {/* Wallet List */}
                <div className="space-y-3">
                  {wallets.map((wallet, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-mono text-sm">{wallet.address}</div>
                            <div className="text-sm text-muted-foreground">
                              {wallet.label || `Wallet ${index + 1}`}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{parseFloat(wallet.balance).toFixed(4)} AVAX</div>
                            <div className="text-sm text-muted-foreground">${wallet.balanceUsd}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {wallets.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No wallets connected. Add a wallet address above to start tracking.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* DeFi Tab */}
          <TabsContent value="defi" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>DeFi Positions</CardTitle>
                <CardDescription>Monitor your positions across Avalanche DeFi protocols</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {defiPositions.map((position, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Activity className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{position.protocol}</div>
                              <div className="text-sm text-muted-foreground">{position.position}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${position.value.toLocaleString()}</div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{position.apy}% APY</Badge>
                              {position.status === 'active' ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Asset Allocation Tab */}
          <TabsContent value="allocation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation Analysis</CardTitle>
                <CardDescription>Detailed breakdown of your portfolio composition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioAllocation.map((asset, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-primary" style={{
                            backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                          }} />
                          <span className="font-medium text-lg">{asset.asset}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">${asset.value.toLocaleString()}</div>
                          <div className={cn(
                            "text-sm",
                            asset.change24h >= 0 ? "text-green-500" : "text-red-500"
                          )}>
                            {asset.change24h >= 0 ? "+" : ""}{asset.change24h}% 24h
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${asset.percentage}%`,
                            backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                          }}
                        />
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        {asset.percentage}% of total portfolio
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PortfolioPage;