import React, { useEffect, useState } from 'react';
import { useWalletStore } from '@/store/wallet-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import AvalancheService from '@/lib/avalanche';
import {
  Activity,
  Wallet,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  Zap,
  BarChart3,
  DollarSign,
  Users,
  Clock
} from 'lucide-react';

const BlockchainDashboard: React.FC = () => {
  const {
    wallets,
    selectedWallet,
    portfolioStats,
    networkStats,
    isLoadingWallets,
    isLoadingNetwork,
    addWallet,
    removeWallet,
    setSelectedWallet,
    refreshAllData,
    refreshWalletData,
    setAutoRefresh,
    isAutoRefreshEnabled
  } = useWalletStore();

  const { toast } = useToast();
  const [newWalletAddress, setNewWalletAddress] = useState('');
  const [walletLabel, setWalletLabel] = useState('');
  const [isAddingWallet, setIsAddingWallet] = useState(false);

  // Auto refresh network data on component mount
  useEffect(() => {
    refreshAllData();
  }, []);

  // Handle add wallet
  const handleAddWallet = async () => {
    if (!newWalletAddress.trim()) {
      toast({
        title: "Error",
        description: "Please enter a wallet address",
        variant: "destructive"
      });
      return;
    }

    if (!AvalancheService.isValidAddress(newWalletAddress)) {
      toast({
        title: "Error", 
        description: "Please enter a valid Avalanche address",
        variant: "destructive"
      });
      return;
    }

    setIsAddingWallet(true);

    try {
      await addWallet(newWalletAddress, walletLabel || undefined);
      setNewWalletAddress('');
      setWalletLabel('');
      toast({
        title: "Success",
        description: "Wallet added successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add wallet",
        variant: "destructive"
      });
    } finally {
      setIsAddingWallet(false);
    }
  };

  // Handle remove wallet
  const handleRemoveWallet = async (address: string) => {
    try {
      await removeWallet(address);
      toast({
        title: "Success",
        description: "Wallet removed successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove wallet",
        variant: "destructive"
      });
    }
  };

  // Copy address to clipboard
  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      toast({
        title: "Copied",
        description: "Address copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy address",
        variant: "destructive"
      });
    }
  };

  // Format number for display
  const formatNumber = (num: number, decimals = 2): string => {
    return new Intl.NumberFormat('en-US', { 
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals 
    }).format(num);
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const selectedWalletData = wallets.find(w => w.address === selectedWallet);

  return (
    <div className="space-y-6">
      {/* Network Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AVAX Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${formatNumber(networkStats.avaxPrice)}
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {networkStats.avaxChange24h >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={networkStats.avaxChange24h >= 0 ? "text-green-500" : "text-red-500"}>
                {networkStats.avaxChange24h >= 0 ? "+" : ""}{formatNumber(networkStats.avaxChange24h)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Block Number</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {networkStats.blockNumber.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Latest block
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gas Price</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(parseFloat(networkStats.gasPrice))} gwei
            </div>
            <p className="text-xs text-muted-foreground">
              Current gas price
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {AvalancheService.formatNumber(networkStats.marketCap)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total market cap
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Wallet Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Connected Wallets
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAutoRefresh(!isAutoRefreshEnabled)}
                  className={isAutoRefreshEnabled ? "bg-green-50 border-green-200" : ""}
                >
                  <RefreshCw className={`h-4 w-4 ${isAutoRefreshEnabled ? 'animate-spin' : ''}`} />
                  Auto
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshAllData}
                  disabled={isLoadingWallets || isLoadingNetwork}
                >
                  <RefreshCw className={`h-4 w-4 ${(isLoadingWallets || isLoadingNetwork) ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Wallet Form */}
            <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="wallet-address">Wallet Address</Label>
                <Input
                  id="wallet-address"
                  placeholder="0x..."
                  value={newWalletAddress}
                  onChange={(e) => setNewWalletAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wallet-label">Label (Optional)</Label>
                <Input
                  id="wallet-label"
                  placeholder="My Wallet"
                  value={walletLabel}
                  onChange={(e) => setWalletLabel(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleAddWallet}
                disabled={isAddingWallet}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                {isAddingWallet ? 'Adding...' : 'Add Wallet'}
              </Button>
            </div>

            {/* Wallet List */}
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {wallets.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No wallets connected</p>
                    <p className="text-sm">Add a wallet address to get started</p>
                  </div>
                ) : (
                  wallets.map((wallet) => (
                    <Card 
                      key={wallet.address}
                      className={`cursor-pointer transition-all hover:bg-muted/50 ${
                        selectedWallet === wallet.address ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedWallet(wallet.address)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{wallet.label}</span>
                              {wallet.isLoading && (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground font-mono">
                              {AvalancheService.formatAddress(wallet.address)}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span>{formatNumber(parseFloat(wallet.balance), 4)} AVAX</span>
                              <span className="text-muted-foreground">
                                {formatCurrency(parseFloat(wallet.balanceUsd))}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyAddress(wallet.address);
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`https://snowtrace.io/address/${wallet.address}`, '_blank');
                              }}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveWallet(wallet.address);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Portfolio Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Portfolio Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(portfolioStats.totalValueUsd)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">AVAX Holdings</p>
                  <p className="text-lg font-semibold">
                    {formatNumber(portfolioStats.avaxValue, 4)} AVAX
                  </p>
                </div>
              </div>

              {selectedWalletData && (
                <div>
                  <h4 className="font-semibold mb-3">
                    Selected Wallet: {selectedWalletData.label}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-background rounded border">
                      <div>
                        <p className="font-medium">AVAX Balance</p>
                        <p className="text-sm text-muted-foreground">Native token</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono">{formatNumber(parseFloat(selectedWalletData.balance), 4)}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(parseFloat(selectedWalletData.balanceUsd))}
                        </p>
                      </div>
                    </div>

                    {selectedWalletData.tokens.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Token Balances</p>
                        <div className="space-y-2">
                          {selectedWalletData.tokens.map((token) => (
                            <div key={token.address} className="flex justify-between p-2 bg-muted/20 rounded text-sm">
                              <span>{token.symbol}</span>
                              <span className="font-mono">{formatNumber(parseFloat(token.balance), 4)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!selectedWalletData && wallets.length > 0 && (
                <div className="text-center text-muted-foreground py-4">
                  <p>Select a wallet to view detailed information</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlockchainDashboard;