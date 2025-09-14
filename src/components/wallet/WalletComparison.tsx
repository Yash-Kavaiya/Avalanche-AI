import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowLeftRight,
  Activity,
  Shield,
  Target,
  BarChart3,
  Zap
} from 'lucide-react';

interface WalletMetrics {
  address: string;
  balance: number;
  totalValue: number;
  transactionCount: number;
  riskScore: number;
  diversificationScore: number;
  activityScore: number;
  profitLoss: number;
  age: number;
  avgTransactionSize: number;
}

export function WalletComparison() {
  const [wallet1Address, setWallet1Address] = useState('');
  const [wallet2Address, setWallet2Address] = useState('');
  const [isComparing, setIsComparing] = useState(false);
  const [wallet1Metrics, setWallet1Metrics] = useState<WalletMetrics | null>(null);
  const [wallet2Metrics, setWallet2Metrics] = useState<WalletMetrics | null>(null);

  const { toast } = useToast();

  const generateMockMetrics = (address: string): WalletMetrics => {
    const seedValue = address.length + address.charCodeAt(0);
    const random = (seed: number) => (seed * 9301 + 49297) % 233280 / 233280;
    
    const balance = random(seedValue) * 10000 + 1000;
    const txCount = Math.floor(random(seedValue + 1) * 1000) + 50;
    
    return {
      address,
      balance,
      totalValue: balance * 35,
      transactionCount: txCount,
      riskScore: random(seedValue + 2) * 100,
      diversificationScore: random(seedValue + 3) * 100,
      activityScore: random(seedValue + 4) * 100,
      profitLoss: (random(seedValue + 5) - 0.5) * 50000,
      age: Math.floor(random(seedValue + 6) * 365) + 30,
      avgTransactionSize: (balance * 2) / txCount
    };
  };

  const compareWallets = async () => {
    if (!wallet1Address.trim() || !wallet2Address.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter both wallet addresses to compare",
        variant: "destructive"
      });
      return;
    }

    if (wallet1Address === wallet2Address) {
      toast({
        title: "Same Address",
        description: "Please enter different wallet addresses to compare",
        variant: "destructive"
      });
      return;
    }

    setIsComparing(true);
    
    try {
      // Simulate comparison analysis
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const metrics1 = generateMockMetrics(wallet1Address);
      const metrics2 = generateMockMetrics(wallet2Address);
      
      setWallet1Metrics(metrics1);
      setWallet2Metrics(metrics2);

      toast({
        title: "Comparison Complete",
        description: "Wallet comparison analysis generated successfully"
      });

    } catch (error) {
      toast({
        title: "Comparison Failed",
        description: "Failed to compare wallets. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsComparing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const getComparisonColor = (value1: number, value2: number, higherIsBetter: boolean = true) => {
    if (value1 === value2) return 'text-slate-600';
    const isFirstBetter = higherIsBetter ? value1 > value2 : value1 < value2;
    return isFirstBetter ? 'text-green-600' : 'text-red-600';
  };

  const getComparisonIcon = (value1: number, value2: number, higherIsBetter: boolean = true) => {
    if (value1 === value2) return null;
    const isFirstBetter = higherIsBetter ? value1 > value2 : value1 < value2;
    return isFirstBetter ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  const ComparisonMetric = ({ 
    label, 
    value1, 
    value2, 
    formatter, 
    higherIsBetter = true 
  }: {
    label: string;
    value1: number;
    value2: number;
    formatter?: (val: number) => string;
    higherIsBetter?: boolean;
  }) => {
    const format = formatter || ((val) => val.toFixed(2));
    
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="font-medium">{label}</div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 ${getComparisonColor(value1, value2, higherIsBetter)}`}>
            {getComparisonIcon(value1, value2, higherIsBetter)}
            <span className="font-semibold">{format(value1)}</span>
          </div>
          <ArrowLeftRight className="h-4 w-4 text-slate-400" />
          <div className={`flex items-center gap-2 ${getComparisonColor(value2, value1, higherIsBetter)}`}>
            {getComparisonIcon(value2, value1, higherIsBetter)}
            <span className="font-semibold">{format(value2)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-slate-900">Wallet Comparison</h3>
        <p className="text-slate-600 mt-2">
          Compare performance metrics between two Avalanche wallets
        </p>
      </div>

      {/* Comparison Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Compare Wallets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Wallet 1 Address</label>
              <Input
                placeholder="Enter first wallet address..."
                value={wallet1Address}
                onChange={(e) => setWallet1Address(e.target.value)}
                className="font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Wallet 2 Address</label>
              <Input
                placeholder="Enter second wallet address..."
                value={wallet2Address}
                onChange={(e) => setWallet2Address(e.target.value)}
                className="font-mono"
              />
            </div>
          </div>
          
          <Button 
            onClick={compareWallets}
            disabled={isComparing}
            className="w-full"
            size="lg"
          >
            {isComparing ? (
              <>
                <Activity className="h-4 w-4 mr-2 animate-spin" />
                Analyzing & Comparing...
              </>
            ) : (
              <>
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                Compare Wallets
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {wallet1Metrics && wallet2Metrics && (
        <div className="space-y-6">
          {/* Wallet Headers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Wallet 1</CardTitle>
                <p className="text-sm text-slate-600 font-mono">{formatAddress(wallet1Metrics.address)}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    Primary Analysis
                  </Badge>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(wallet1Metrics.totalValue)}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Wallet 2</CardTitle>
                <p className="text-sm text-slate-600 font-mono">{formatAddress(wallet2Metrics.address)}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-purple-600 border-purple-200">
                    Comparison Target
                  </Badge>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(wallet2Metrics.totalValue)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Comparison Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Performance Comparison
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ComparisonMetric
                label="Portfolio Value"
                value1={wallet1Metrics.totalValue}
                value2={wallet2Metrics.totalValue}
                formatter={formatCurrency}
              />
              
              <ComparisonMetric
                label="AVAX Balance"
                value1={wallet1Metrics.balance}
                value2={wallet2Metrics.balance}
                formatter={(val) => `${val.toFixed(4)} AVAX`}
              />
              
              <ComparisonMetric
                label="Transaction Count"
                value1={wallet1Metrics.transactionCount}
                value2={wallet2Metrics.transactionCount}
                formatter={(val) => val.toLocaleString()}
              />
              
              <ComparisonMetric
                label="Profit/Loss"
                value1={wallet1Metrics.profitLoss}
                value2={wallet2Metrics.profitLoss}
                formatter={formatCurrency}
              />
              
              <ComparisonMetric
                label="Avg Transaction Size"
                value1={wallet1Metrics.avgTransactionSize}
                value2={wallet2Metrics.avgTransactionSize}
                formatter={formatCurrency}
              />
              
              <ComparisonMetric
                label="Wallet Age (Days)"
                value1={wallet1Metrics.age}
                value2={wallet2Metrics.age}
                formatter={(val) => `${val} days`}
              />
            </CardContent>
          </Card>

          {/* Score Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Score Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Risk Management</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Wallet 1</span>
                      <span className="font-medium">{wallet1Metrics.riskScore.toFixed(0)}/100</span>
                    </div>
                    <Progress value={wallet1Metrics.riskScore} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Wallet 2</span>
                      <span className="font-medium">{wallet2Metrics.riskScore.toFixed(0)}/100</span>
                    </div>
                    <Progress value={wallet2Metrics.riskScore} className="h-2" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Diversification</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Wallet 1</span>
                      <span className="font-medium">{wallet1Metrics.diversificationScore.toFixed(0)}/100</span>
                    </div>
                    <Progress value={wallet1Metrics.diversificationScore} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Wallet 2</span>
                      <span className="font-medium">{wallet2Metrics.diversificationScore.toFixed(0)}/100</span>
                    </div>
                    <Progress value={wallet2Metrics.diversificationScore} className="h-2" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Activity Level</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Wallet 1</span>
                      <span className="font-medium">{wallet1Metrics.activityScore.toFixed(0)}/100</span>
                    </div>
                    <Progress value={wallet1Metrics.activityScore} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Wallet 2</span>
                      <span className="font-medium">{wallet2Metrics.activityScore.toFixed(0)}/100</span>
                    </div>
                    <Progress value={wallet2Metrics.activityScore} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comparison Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Comparison Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {wallet1Metrics.totalValue > wallet2Metrics.totalValue ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-900">Higher Portfolio Value</h4>
                  <p className="text-sm text-green-800">
                    Wallet 1 has a {((wallet1Metrics.totalValue / wallet2Metrics.totalValue - 1) * 100).toFixed(1)}% 
                    higher portfolio value than Wallet 2.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900">Higher Portfolio Value</h4>
                  <p className="text-sm text-blue-800">
                    Wallet 2 has a {((wallet2Metrics.totalValue / wallet1Metrics.totalValue - 1) * 100).toFixed(1)}% 
                    higher portfolio value than Wallet 1.
                  </p>
                </div>
              )}

              {wallet1Metrics.riskScore < wallet2Metrics.riskScore ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-900">Better Risk Management</h4>
                  <p className="text-sm text-green-800">
                    Wallet 1 demonstrates better risk management with a lower risk score 
                    ({wallet1Metrics.riskScore.toFixed(0)} vs {wallet2Metrics.riskScore.toFixed(0)}).
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900">Better Risk Management</h4>
                  <p className="text-sm text-blue-800">
                    Wallet 2 demonstrates better risk management with a lower risk score 
                    ({wallet2Metrics.riskScore.toFixed(0)} vs {wallet1Metrics.riskScore.toFixed(0)}).
                  </p>
                </div>
              )}

              {wallet1Metrics.activityScore > wallet2Metrics.activityScore ? (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-900">Higher Activity</h4>
                  <p className="text-sm text-purple-800">
                    Wallet 1 shows {wallet1Metrics.activityScore.toFixed(0)}% activity score compared to 
                    Wallet 2's {wallet2Metrics.activityScore.toFixed(0)}%, indicating more frequent usage.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-900">Higher Activity</h4>
                  <p className="text-sm text-purple-800">
                    Wallet 2 shows {wallet2Metrics.activityScore.toFixed(0)}% activity score compared to 
                    Wallet 1's {wallet1Metrics.activityScore.toFixed(0)}%, indicating more frequent usage.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}