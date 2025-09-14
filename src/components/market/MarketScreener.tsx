import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Filter, Search, Star, TrendingUp, TrendingDown, Volume2, DollarSign } from 'lucide-react';

interface ScreenerCriteria {
  priceMin: number;
  priceMax: number;
  volumeMin: number;
  changeMin: number;
  changeMax: number;
  marketCapMin: number;
  marketCapMax: number;
  category: string;
  exchange: string;
}

interface ScreenerResult {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  category: string;
  exchange: string;
  score: number;
}

const MarketScreener: React.FC = () => {
  const [criteria, setCriteria] = useState<ScreenerCriteria>({
    priceMin: 0,
    priceMax: 1000,
    volumeMin: 0,
    changeMin: -50,
    changeMax: 50,
    marketCapMin: 0,
    marketCapMax: 100000000000,
    category: 'all',
    exchange: 'all'
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sortBy, setSortBy] = useState('score');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock screener results
  const [results] = useState<ScreenerResult[]>([
    {
      symbol: 'AVAX',
      name: 'Avalanche',
      price: 42.35,
      change24h: 5.2,
      volume24h: 245000000,
      marketCap: 16800000000,
      category: 'Layer 1',
      exchange: 'Multiple',
      score: 92
    },
    {
      symbol: 'JOE',
      name: 'TraderJoe',
      price: 0.385,
      change24h: -2.1,
      volume24h: 12500000,
      marketCap: 85000000,
      category: 'DEX',
      exchange: 'TraderJoe',
      score: 78
    },
    {
      symbol: 'PNG',
      name: 'Pangolin',
      price: 0.025,
      change24h: 8.7,
      volume24h: 3200000,
      marketCap: 12000000,
      category: 'DEX',
      exchange: 'Pangolin',
      score: 74
    },
    {
      symbol: 'QI',
      name: 'Benqi',
      price: 0.012,
      change24h: 12.5,
      volume24h: 8900000,
      marketCap: 45000000,
      category: 'Lending',
      exchange: 'Benqi',
      score: 82
    },
    {
      symbol: 'YAK',
      name: 'Yield Yak',
      price: 0.156,
      change24h: -5.3,
      volume24h: 2100000,
      marketCap: 18000000,
      category: 'Yield',
      exchange: 'Yield Yak',
      score: 69
    }
  ]);

  const handleCriteriaChange = (key: keyof ScreenerCriteria, value: any) => {
    setCriteria(prev => ({ ...prev, [key]: value }));
  };

  const filteredResults = results.filter(result => {
    const matchesSearch = result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         result.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = result.price >= criteria.priceMin && result.price <= criteria.priceMax;
    const matchesVolume = result.volume24h >= criteria.volumeMin;
    const matchesChange = result.change24h >= criteria.changeMin && result.change24h <= criteria.changeMax;
    const matchesMarketCap = result.marketCap >= criteria.marketCapMin && result.marketCap <= criteria.marketCapMax;
    const matchesCategory = criteria.category === 'all' || result.category === criteria.category;
    const matchesExchange = criteria.exchange === 'all' || result.exchange === criteria.exchange;

    return matchesSearch && matchesPrice && matchesVolume && matchesChange && 
           matchesMarketCap && matchesCategory && matchesExchange;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case 'score': return b.score - a.score;
      case 'price': return b.price - a.price;
      case 'change': return b.change24h - a.change24h;
      case 'volume': return b.volume24h - a.volume24h;
      case 'marketCap': return b.marketCap - a.marketCap;
      default: return 0;
    }
  });

  const formatNumber = (num: number): string => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const resetCriteria = () => {
    setCriteria({
      priceMin: 0,
      priceMax: 1000,
      volumeMin: 0,
      changeMin: -50,
      changeMax: 50,
      marketCapMin: 0,
      marketCapMax: 100000000000,
      category: 'all',
      exchange: 'all'
    });
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Market Screener
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name or symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Basic Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <Label>Category</Label>
              <Select value={criteria.category} onValueChange={(value) => handleCriteriaChange('category', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Layer 1">Layer 1</SelectItem>
                  <SelectItem value="DEX">DEX</SelectItem>
                  <SelectItem value="Lending">Lending</SelectItem>
                  <SelectItem value="Yield">Yield Farming</SelectItem>
                  <SelectItem value="Gaming">Gaming</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Exchange</Label>
              <Select value={criteria.exchange} onValueChange={(value) => handleCriteriaChange('exchange', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Exchanges</SelectItem>
                  <SelectItem value="TraderJoe">TraderJoe</SelectItem>
                  <SelectItem value="Pangolin">Pangolin</SelectItem>
                  <SelectItem value="Benqi">Benqi</SelectItem>
                  <SelectItem value="Yield Yak">Yield Yak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Score</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="change">24h Change</SelectItem>
                  <SelectItem value="volume">Volume</SelectItem>
                  <SelectItem value="marketCap">Market Cap</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Min Volume ($)</Label>
              <Input
                type="number"
                placeholder="0"
                value={criteria.volumeMin || ''}
                onChange={(e) => handleCriteriaChange('volumeMin', Number(e.target.value) || 0)}
              />
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Switch
                checked={showAdvanced}
                onCheckedChange={setShowAdvanced}
                id="advanced"
              />
              <Label htmlFor="advanced" className="text-sm">Advanced</Label>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium">Price Range ($)</Label>
                  <div className="space-y-2 mt-2">
                    <Slider
                      value={[criteria.priceMin, criteria.priceMax]}
                      onValueChange={(value) => {
                        handleCriteriaChange('priceMin', value[0]);
                        handleCriteriaChange('priceMax', value[1]);
                      }}
                      max={1000}
                      min={0}
                      step={0.01}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${criteria.priceMin}</span>
                      <span>${criteria.priceMax}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">24h Change (%)</Label>
                  <div className="space-y-2 mt-2">
                    <Slider
                      value={[criteria.changeMin, criteria.changeMax]}
                      onValueChange={(value) => {
                        handleCriteriaChange('changeMin', value[0]);
                        handleCriteriaChange('changeMax', value[1]);
                      }}
                      max={50}
                      min={-50}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{criteria.changeMin}%</span>
                      <span>{criteria.changeMax}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={resetCriteria} variant="outline" size="sm">
                  Reset Filters
                </Button>
                <div className="text-sm text-gray-600 flex items-center">
                  Found {filteredResults.length} assets matching criteria
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>Screener Results ({sortedResults.length} assets)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedResults.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No assets match your criteria</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              sortedResults.map((result, index) => (
                <div key={result.symbol} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500 w-6 text-center">#{index + 1}</div>
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                      {result.symbol.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{result.name}</span>
                        <Badge variant="outline" className="text-xs">{result.symbol}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{result.category}</span>
                        <span>•</span>
                        <span>{result.exchange}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-6 text-center">
                    <div>
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="font-medium">${result.price.toFixed(3)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">24h Change</p>
                      <div className={`flex items-center justify-center gap-1 ${result.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {result.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span className="font-medium">{result.change24h >= 0 ? '+' : ''}{result.change24h.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Volume</p>
                      <p className="font-medium">{formatNumber(result.volume24h)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Market Cap</p>
                      <p className="font-medium">{formatNumber(result.marketCap)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Score</p>
                      <Badge className={getScoreColor(result.score)}>
                        {result.score}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost">
                      <Star className="w-4 h-4" />
                    </Button>
                    <Button size="sm">View</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketScreener;