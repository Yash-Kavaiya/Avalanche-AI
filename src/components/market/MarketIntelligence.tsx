import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Activity,
  Zap,
  AlertTriangle,
  Target,
  Brain,
  Newspaper,
  Search,
  Filter,
  RefreshCw,
  Star,
  ArrowUp,
  ArrowDown,
  Eye,
  Users,
  Clock,
  Globe,
  ChartLine,
  Gauge,
  Calendar,
  BookOpen
} from 'lucide-react';
import PriceAlerts from './PriceAlerts';
import MarketScreener from './MarketScreener';

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  rank: number;
  sparkline: number[];
}

interface TradingOpportunity {
  id: string;
  type: 'buy' | 'sell' | 'hold';
  asset: string;
  confidence: number;
  expectedReturn: number;
  timeframe: string;
  reason: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface NewsItem {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  category: string;
}

interface SentimentData {
  overall: number;
  social: number;
  news: number;
  technical: number;
  fear_greed: number;
}

interface DeFiMetric {
  protocol: string;
  tvl: number;
  apr: number;
  change24h: number;
  category: string;
  risk: string;
}

const MarketIntelligence: React.FC = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('24h');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in real implementation, this would come from APIs
  const [marketData] = useState<MarketData[]>([
    {
      symbol: 'AVAX',
      name: 'Avalanche',
      price: 42.35,
      change24h: 5.2,
      volume24h: 245000000,
      marketCap: 16800000000,
      rank: 9,
      sparkline: [38, 39, 41, 40, 42, 43, 42]
    },
    {
      symbol: 'JOE',
      name: 'TraderJoe',
      price: 0.385,
      change24h: -2.1,
      volume24h: 12500000,
      marketCap: 85000000,
      rank: 145,
      sparkline: [0.42, 0.40, 0.39, 0.38, 0.39, 0.38, 0.385]
    },
    {
      symbol: 'PNG',
      name: 'Pangolin',
      price: 0.025,
      change24h: 8.7,
      volume24h: 3200000,
      marketCap: 12000000,
      rank: 890,
      sparkline: [0.021, 0.022, 0.023, 0.024, 0.025, 0.026, 0.025]
    }
  ]);

  const [tradingOpportunities] = useState<TradingOpportunity[]>([
    {
      id: '1',
      type: 'buy',
      asset: 'AVAX',
      confidence: 85,
      expectedReturn: 15.5,
      timeframe: '7-14 days',
      reason: 'Strong support at $40, bullish divergence on RSI',
      riskLevel: 'medium'
    },
    {
      id: '2',
      type: 'hold',
      asset: 'JOE',
      confidence: 72,
      expectedReturn: 8.2,
      timeframe: '30 days',
      reason: 'Consolidation phase, wait for breakout confirmation',
      riskLevel: 'low'
    },
    {
      id: '3',
      type: 'buy',
      asset: 'PNG',
      confidence: 78,
      expectedReturn: 22.3,
      timeframe: '3-5 days',
      reason: 'High volume breakout, ecosystem growth',
      riskLevel: 'high'
    }
  ]);

  const [sentimentData] = useState<SentimentData>({
    overall: 68,
    social: 72,
    news: 65,
    technical: 71,
    fear_greed: 58
  });

  const [newsData] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'Avalanche Introduces New Subnet Functionality for Enterprise',
      source: 'CoinDesk',
      timestamp: '2 hours ago',
      sentiment: 'bullish',
      impact: 'high',
      category: 'Development'
    },
    {
      id: '2',
      title: 'Major DeFi Protocol Launches on Avalanche C-Chain',
      source: 'Decrypt',
      timestamp: '4 hours ago',
      sentiment: 'bullish',
      impact: 'medium',
      category: 'DeFi'
    },
    {
      id: '3',
      title: 'Market Analysis: AVAX Shows Strong Technical Indicators',
      source: 'The Block',
      timestamp: '6 hours ago',
      sentiment: 'neutral',
      impact: 'medium',
      category: 'Analysis'
    }
  ]);

  const [defiMetrics] = useState<DeFiMetric[]>([
    { protocol: 'TraderJoe', tvl: 125000000, apr: 12.5, change24h: 3.2, category: 'DEX', risk: 'Low' },
    { protocol: 'Benqi', tvl: 89000000, apr: 8.7, change24h: -1.1, category: 'Lending', risk: 'Low' },
    { protocol: 'Pangolin', tvl: 45000000, apr: 18.3, change24h: 5.8, category: 'DEX', risk: 'Medium' },
    { protocol: 'Yield Yak', tvl: 32000000, apr: 15.2, change24h: 2.4, category: 'Yield', risk: 'Medium' }
  ]);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-600';
      case 'bearish': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getOpportunityIcon = (type: string) => {
    switch (type) {
      case 'buy': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'sell': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Target className="w-4 h-4 text-blue-600" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Market Intelligence</h2>
          <p className="text-gray-600">Advanced analytics and trading insights for Avalanche ecosystem</p>
        </div>
        <Button onClick={handleRefresh} disabled={isLoading} className="flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Market Cap</p>
                <p className="text-2xl font-bold">$16.8B</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <ArrowUp className="w-3 h-3" />
                  +5.2% 24h
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">24h Volume</p>
                <p className="text-2xl font-bold">$245M</p>
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <ArrowDown className="w-3 h-3" />
                  -2.1% 24h
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Addresses</p>
                <p className="text-2xl font-bold">148K</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <ArrowUp className="w-3 h-3" />
                  +8.7% 24h
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Network TPS</p>
                <p className="text-2xl font-bold">4,500</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Real-time
                </p>
              </div>
              <Activity className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="defi">DeFi Analytics</TabsTrigger>
          <TabsTrigger value="news">News & Events</TabsTrigger>
          <TabsTrigger value="technical">Technical Analysis</TabsTrigger>
          <TabsTrigger value="screener">Screener</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* Market Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Assets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartLine className="w-5 h-5" />
                  Top Avalanche Assets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketData.map((asset, index) => (
                    <div key={asset.symbol} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {asset.symbol.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{asset.name}</p>
                          <p className="text-sm text-gray-600">#{asset.rank}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${asset.price.toFixed(3)}</p>
                        <p className={`text-sm ${asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="w-5 h-5" />
                  Market Health Indicators
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Network Utilization</span>
                      <span>67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Validator Participation</span>
                      <span>94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>DeFi TVL Growth</span>
                      <span>82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Developer Activity</span>
                      <span>91%</span>
                    </div>
                    <Progress value={91} className="h-2" />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-green-600">A+</p>
                      <p className="text-xs text-gray-600">Overall Health</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">8.7</p>
                      <p className="text-xs text-gray-600">Growth Score</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sentiment Analysis Tab */}
        <TabsContent value="sentiment" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Market Sentiment Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">{sentimentData.overall}/100</div>
                    <p className="text-lg font-medium">Overall Bullish</p>
                    <p className="text-sm text-gray-600">Market sentiment is positive with strong fundamentals</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Social Media Sentiment
                        </span>
                        <span>{sentimentData.social}/100</span>
                      </div>
                      <Progress value={sentimentData.social} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="flex items-center gap-2">
                          <Newspaper className="w-4 h-4" />
                          News Sentiment
                        </span>
                        <span>{sentimentData.news}/100</span>
                      </div>
                      <Progress value={sentimentData.news} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" />
                          Technical Analysis
                        </span>
                        <span>{sentimentData.technical}/100</span>
                      </div>
                      <Progress value={sentimentData.technical} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Fear & Greed Index
                        </span>
                        <span>{sentimentData.fear_greed}/100</span>
                      </div>
                      <Progress value={sentimentData.fear_greed} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sentiment Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bullish Signals</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">67%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Neutral Signals</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">21%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bearish Signals</span>
                    <Badge variant="secondary" className="bg-red-100 text-red-800">12%</Badge>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Key Factors</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Strong network growth</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Increasing DeFi adoption</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Institutional interest</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>Market volatility concerns</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trading Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                AI-Powered Trading Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tradingOpportunities.map((opportunity) => (
                  <div key={opportunity.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getOpportunityIcon(opportunity.type)}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{opportunity.asset}</span>
                            <Badge variant={opportunity.type === 'buy' ? 'default' : opportunity.type === 'sell' ? 'destructive' : 'secondary'}>
                              {opportunity.type.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{opportunity.timeframe}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">+{opportunity.expectedReturn}%</p>
                        <p className="text-sm text-gray-600">{opportunity.confidence}% confidence</p>
                      </div>
                    </div>
                    
                    <p className="text-sm mb-3">{opportunity.reason}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">Risk Level:</span>
                        <Badge className={getRiskColor(opportunity.riskLevel)}>
                          {opportunity.riskLevel}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">Confidence:</span>
                        <Progress value={opportunity.confidence} className="w-20 h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DeFi Analytics Tab */}
        <TabsContent value="defi" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                DeFi Protocol Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">$291M</p>
                    <p className="text-sm text-gray-600">Total TVL</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">13.7%</p>
                    <p className="text-sm text-gray-600">Avg APR</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">45</p>
                    <p className="text-sm text-gray-600">Active Protocols</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">+12.3%</p>
                    <p className="text-sm text-gray-600">Weekly Growth</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {defiMetrics.map((protocol, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                          {protocol.protocol.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{protocol.protocol}</p>
                          <Badge variant="outline" className="text-xs">{protocol.category}</Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-6 text-center">
                        <div>
                          <p className="text-sm text-gray-600">TVL</p>
                          <p className="font-medium">{formatNumber(protocol.tvl)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">APR</p>
                          <p className="font-medium text-green-600">{protocol.apr}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">24h Change</p>
                          <p className={`font-medium ${protocol.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {protocol.change24h >= 0 ? '+' : ''}{protocol.change24h}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Risk</p>
                          <Badge className={getRiskColor(protocol.risk.toLowerCase())}>
                            {protocol.risk}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* News & Events Tab */}
        <TabsContent value="news" className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search news and events..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="defi">DeFi</SelectItem>
                <SelectItem value="analysis">Analysis</SelectItem>
                <SelectItem value="partnerships">Partnerships</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="w-5 h-5" />
                Latest News & Market Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {newsData.map((news) => (
                  <div key={news.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{news.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {news.source}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {news.timestamp}
                          </span>
                          <Badge variant="outline">{news.category}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge className={getSentimentColor(news.sentiment)}>
                          {news.sentiment}
                        </Badge>
                        <Badge variant={news.impact === 'high' ? 'destructive' : news.impact === 'medium' ? 'default' : 'secondary'}>
                          {news.impact} impact
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Technical Analysis Tab */}
        <TabsContent value="technical" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Technical Indicators
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">RSI (14)</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">67.5</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Neutral</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">MACD</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">0.85</span>
                      <Badge className="bg-green-100 text-green-800">Bullish</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bollinger Bands</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Mid</span>
                      <Badge className="bg-blue-100 text-blue-800">Neutral</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Moving Avg (50)</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Above</span>
                      <Badge className="bg-green-100 text-green-800">Bullish</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Volume Profile</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Strong</span>
                      <Badge className="bg-green-100 text-green-800">Bullish</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Support & Resistance Levels
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-green-600 mb-2">Resistance Levels</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Strong Resistance</span>
                      <span className="font-medium">$45.20</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Medium Resistance</span>
                      <span className="font-medium">$43.80</span>
                    </div>
                  </div>
                </div>
                
                <div className="py-2 border-y">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Current Price</span>
                    <span className="text-lg font-bold">$42.35</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-red-600 mb-2">Support Levels</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Medium Support</span>
                      <span className="font-medium">$40.50</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Strong Support</span>
                      <span className="font-medium">$38.75</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Overall Signal</p>
                    <Badge className="bg-green-100 text-green-800">BULLISH</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Market Screener Tab */}
        <TabsContent value="screener">
          <MarketScreener />
        </TabsContent>

        {/* Price Alerts Tab */}
        <TabsContent value="alerts">
          <PriceAlerts />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketIntelligence;