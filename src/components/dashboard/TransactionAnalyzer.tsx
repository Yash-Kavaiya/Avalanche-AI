import React, { useState, useEffect } from 'react';
import { useWalletStore } from '@/store/wallet-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import AvalancheService from '@/lib/avalanche';
import {
  Search,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Zap,
  Hash,
  Copy,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface Transaction {
  hash: string;
  blockNumber: number;
  from: string;
  to: string | null;
  value: string;
  gasUsed: string;
  gasPrice: string;
  status: 'success' | 'failed';
  timestamp: number;
  type: 'send' | 'receive' | 'contract';
  method?: string;
}

const TransactionAnalyzer: React.FC = () => {
  const { selectedWallet, wallets } = useWalletStore();
  const { toast } = useToast();

  const [searchHash, setSearchHash] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchedTransaction, setSearchedTransaction] = useState<Transaction | null>(null);
  const [gasAnalysis, setGasAnalysis] = useState({
    averageGasPrice: 0,
    totalGasUsed: 0,
    totalFees: 0,
    successRate: 0
  });

  const avalancheService = new AvalancheService('mainnet');

  // Load transaction history for selected wallet
  useEffect(() => {
    if (selectedWallet) {
      loadWalletTransactions(selectedWallet);
    }
  }, [selectedWallet]);

  // Load wallet transactions (mock implementation - would use real API)
  const loadWalletTransactions = async (address: string) => {
    setIsLoading(true);
    
    try {
      // Mock transaction data - in real implementation, would fetch from blockchain API
      const mockTransactions: Transaction[] = [
        {
          hash: '0x1234...5678',
          blockNumber: 12345678,
          from: '0xabc...def',
          to: address,
          value: '1.5',
          gasUsed: '21000',
          gasPrice: '25',
          status: 'success',
          timestamp: Date.now() - 3600000,
          type: 'receive'
        },
        {
          hash: '0x2345...6789',
          blockNumber: 12345677,
          from: address,
          to: '0xdef...abc',
          value: '0.8',
          gasUsed: '21000',
          gasPrice: '30',
          status: 'success',
          timestamp: Date.now() - 7200000,
          type: 'send'
        },
        {
          hash: '0x3456...789a',
          blockNumber: 12345676,
          from: address,
          to: '0x123...456',
          value: '0',
          gasUsed: '150000',
          gasPrice: '28',
          status: 'failed',
          timestamp: Date.now() - 10800000,
          type: 'contract',
          method: 'swapExactTokensForTokens'
        }
      ];

      setTransactions(mockTransactions);
      calculateGasAnalysis(mockTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transaction history",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Search for specific transaction
  const searchTransaction = async () => {
    if (!searchHash.trim()) {
      toast({
        title: "Error",
        description: "Please enter a transaction hash",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Mock transaction lookup - would use real blockchain API
      const mockTransaction: Transaction = {
        hash: searchHash,
        blockNumber: 12345679,
        from: '0xabc...def',
        to: '0xdef...ghi',
        value: '2.5',
        gasUsed: '21000',
        gasPrice: '25',
        status: 'success',
        timestamp: Date.now() - 1800000,
        type: 'send'
      };

      setSearchedTransaction(mockTransaction);
    } catch (error) {
      console.error('Error searching transaction:', error);
      toast({
        title: "Error",
        description: "Transaction not found",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate gas analysis
  const calculateGasAnalysis = (txs: Transaction[]) => {
    if (txs.length === 0) return;

    const totalGasUsed = txs.reduce((sum, tx) => sum + parseInt(tx.gasUsed), 0);
    const averageGasPrice = txs.reduce((sum, tx) => sum + parseFloat(tx.gasPrice), 0) / txs.length;
    const successfulTxs = txs.filter(tx => tx.status === 'success').length;
    const totalFees = txs.reduce((sum, tx) => {
      return sum + (parseInt(tx.gasUsed) * parseFloat(tx.gasPrice)) / 1e9; // Convert to AVAX
    }, 0);

    setGasAnalysis({
      averageGasPrice,
      totalGasUsed,
      totalFees,
      successRate: (successfulTxs / txs.length) * 100
    });
  };

  // Copy hash to clipboard
  const copyHash = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      toast({
        title: "Copied",
        description: "Transaction hash copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy hash",
        variant: "destructive"
      });
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // Format hash
  const formatHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  // Get transaction type icon
  const getTransactionIcon = (type: string, from: string, to: string | null) => {
    if (selectedWallet && from.toLowerCase() === selectedWallet.toLowerCase()) {
      return <ArrowUpRight className="h-4 w-4 text-red-500" />;
    }
    return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
  };

  const selectedWalletData = wallets.find(w => w.address === selectedWallet);

  return (
    <div className="space-y-6">
      {/* Transaction Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Transaction Lookup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter transaction hash (0x...)"
              value={searchHash}
              onChange={(e) => setSearchHash(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={searchTransaction}
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {searchedTransaction && (
            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Transaction Details</h4>
                <Badge variant={searchedTransaction.status === 'success' ? 'default' : 'destructive'}>
                  {searchedTransaction.status === 'success' ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <XCircle className="h-3 w-3 mr-1" />
                  )}
                  {searchedTransaction.status}
                </Badge>
              </div>
              
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hash:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{formatHash(searchedTransaction.hash)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyHash(searchedTransaction.hash)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Block:</span>
                  <span>{searchedTransaction.blockNumber.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Value:</span>
                  <span>{searchedTransaction.value} AVAX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gas Used:</span>
                  <span>{parseInt(searchedTransaction.gasUsed).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span>{formatTimestamp(searchedTransaction.timestamp)}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Wallet Analysis */}
      {selectedWalletData && (
        <Tabs defaultValue="history" className="space-y-4">
          <TabsList>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
            <TabsTrigger value="analytics">Gas Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Transactions</span>
                  <Badge variant="secondary">
                    {selectedWalletData.label}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {transactions.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No transactions found</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {transactions.map((tx) => (
                        <Card key={tx.hash} className="hover:bg-muted/50 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {getTransactionIcon(tx.type, tx.from, tx.to)}
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-sm">
                                      {formatHash(tx.hash)}
                                    </span>
                                    <Badge 
                                      variant={tx.status === 'success' ? 'default' : 'destructive'}
                                      className="text-xs"
                                    >
                                      {tx.status}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {formatTimestamp(tx.timestamp)}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <p className="font-semibold">
                                  {tx.value} AVAX
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Gas: {parseInt(tx.gasUsed).toLocaleString()}
                                </p>
                              </div>

                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyHash(tx.hash)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(`https://snowtrace.io/tx/${tx.hash}`, '_blank')}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            
                            {tx.method && (
                              <div className="mt-2 text-xs text-muted-foreground">
                                Method: {tx.method}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Gas Price</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {gasAnalysis.averageGasPrice.toFixed(1)} gwei
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Based on recent transactions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Gas Used</CardTitle>
                  <Hash className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {gasAnalysis.totalGasUsed.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Cumulative gas consumption
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {gasAnalysis.totalFees.toFixed(4)} AVAX
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Transaction fees paid
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {gasAnalysis.successRate.toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Transaction success rate
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Gas Optimization Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Gas Optimization Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-1">Optimal Gas Price</h4>
                  <p className="text-sm text-blue-700">
                    Current network average: {gasAnalysis.averageGasPrice.toFixed(1)} gwei. 
                    Consider using 20-25 gwei for standard transactions.
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-1">Transaction Timing</h4>
                  <p className="text-sm text-green-700">
                    Gas prices are typically lower during off-peak hours (UTC 6-10 AM).
                  </p>
                </div>

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-1">Batch Transactions</h4>
                  <p className="text-sm text-yellow-700">
                    Group multiple operations into single transactions to save on gas costs.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {!selectedWallet && (
        <Card>
          <CardContent className="text-center py-8">
            <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              Connect a wallet to view transaction analysis
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TransactionAnalyzer;