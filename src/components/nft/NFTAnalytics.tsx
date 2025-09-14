/**
 * NFT Analytics Component
 * Comprehensive NFT analysis and portfolio tracking for Avalanche ecosystem
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Image as ImageIcon, 
  TrendingUp, 
  TrendingDown, 
  Star,
  Eye,
  DollarSign,
  Users,
  Activity,
  Search,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Crown,
  Trophy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NFTTrait {
  trait_type: string;
  value: string;
  rarity: number; // percentage
}

interface NFTItem {
  tokenId: string;
  name: string;
  description?: string;
  image: string;
  traits: NFTTrait[];
  rarityRank: number;
  rarityScore: number;
  lastSale?: {
    price: number;
    currency: 'AVAX' | 'ETH';
    timestamp: Date;
  };
  owner: string;
  listed: boolean;
  listingPrice?: number;
}

interface NFTCollection {
  contractAddress: string;
  name: string;
  description: string;
  symbol: string;
  totalSupply: number;
  floorPrice: number;
  volumeTraded: number;
  volume24h: number;
  volume7d: number;
  change24h: number;
  change7d: number;
  owners: number;
  listedCount: number;
  averagePrice: number;
  marketCap: number;
  category: 'art' | 'gaming' | 'utility' | 'pfp' | 'music' | 'sports' | 'other';
  verified: boolean;
  website?: string;
  twitter?: string;
  discord?: string;
  createdAt: Date;
  topSales: Array<{
    tokenId: string;
    price: number;
    timestamp: Date;
  }>;
}

interface PortfolioStats {
  totalValue: number;
  totalItems: number;
  collections: number;
  unrealizedGains: number;
  topCollection: string;
  rarest: NFTItem;
}

export const NFTAnalytics: React.FC = () => {
  const [collections, setCollections] = useState<NFTCollection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<NFTCollection | null>(null);
  const [collectionNFTs, setCollectionNFTs] = useState<NFTItem[]>([]);
  const [portfolioStats, setPortfolioStats] = useState<PortfolioStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  
  const { toast } = useToast();

  // Fetch NFT data
  const fetchNFTData = useCallback(async () => {
    setLoading(true);
    try {
      // Mock collections data - replace with actual NFT marketplace APIs
      const mockCollections: NFTCollection[] = [
        {
          contractAddress: '0x1234567890123456789012345678901234567890',
          name: 'Avalanche Legends',
          description: 'Legendary characters from the Avalanche ecosystem',
          symbol: 'ALEGEND',
          totalSupply: 10000,
          floorPrice: 2.5,
          volumeTraded: 125000,
          volume24h: 15000,
          volume7d: 85000,
          change24h: 12.5,
          change7d: -5.2,
          owners: 3500,
          listedCount: 1250,
          averagePrice: 4.2,
          marketCap: 25000,
          category: 'art',
          verified: true,
          website: 'https://avalanchelegends.com',
          twitter: '@AvalancheLegends',
          discord: 'avalanchelegends',
          createdAt: new Date('2022-06-15'),
          topSales: [
            { tokenId: '1337', price: 45.0, timestamp: new Date('2024-01-08') },
            { tokenId: '8888', price: 38.5, timestamp: new Date('2024-01-07') },
            { tokenId: '2222', price: 32.1, timestamp: new Date('2024-01-06') }
          ]
        },
        {
          contractAddress: '0x2345678901234567890123456789012345678901',
          name: 'Crabada Warriors',
          description: 'Battle-ready crabs from the underwater kingdom',
          symbol: 'CRAB',
          totalSupply: 8888,
          floorPrice: 1.8,
          volumeTraded: 89000,
          volume24h: 8500,
          volume7d: 52000,
          change24h: -2.1,
          change7d: 8.9,
          owners: 2800,
          listedCount: 980,
          averagePrice: 2.9,
          marketCap: 16000,
          category: 'gaming',
          verified: true,
          website: 'https://crabada.com',
          twitter: '@PlayCrabada',
          discord: 'crabada',
          createdAt: new Date('2021-11-20'),
          topSales: [
            { tokenId: '0001', price: 28.0, timestamp: new Date('2024-01-08') },
            { tokenId: '7777', price: 22.5, timestamp: new Date('2024-01-07') },
            { tokenId: '4444', price: 19.8, timestamp: new Date('2024-01-06') }
          ]
        },
        {
          contractAddress: '0x3456789012345678901234567890123456789012',
          name: 'Avalanche Punks',
          description: 'Pixel art punks living on the Avalanche network',
          symbol: 'APUNK',
          totalSupply: 5000,
          floorPrice: 0.95,
          volumeTraded: 45000,
          volume24h: 3200,
          volume7d: 18000,
          change24h: 5.8,
          change7d: -12.3,
          owners: 1800,
          listedCount: 450,
          averagePrice: 1.5,
          marketCap: 4750,
          category: 'pfp',
          verified: true,
          createdAt: new Date('2022-02-14'),
          topSales: [
            { tokenId: '0420', price: 15.5, timestamp: new Date('2024-01-08') },
            { tokenId: '1000', price: 12.2, timestamp: new Date('2024-01-07') },
            { tokenId: '2500', price: 9.8, timestamp: new Date('2024-01-06') }
          ]
        }
      ];

      setCollections(mockCollections);

      // Mock portfolio stats
      const mockPortfolio: PortfolioStats = {
        totalValue: 47.8,
        totalItems: 12,
        collections: 4,
        unrealizedGains: 12.3,
        topCollection: 'Avalanche Legends',
        rarest: {
          tokenId: '1337',
          name: 'Golden Avalanche Dragon',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
          traits: [
            { trait_type: 'Background', value: 'Golden Sunset', rarity: 0.5 },
            { trait_type: 'Type', value: 'Dragon', rarity: 2.1 },
            { trait_type: 'Color', value: 'Golden', rarity: 0.8 }
          ],
          rarityRank: 1,
          rarityScore: 850.2,
          owner: walletAddress,
          listed: false
        }
      };

      setPortfolioStats(mockPortfolio);

    } catch (error) {
      console.error('NFT data fetch error:', error);
      toast({
        title: "Data Fetch Error",
        description: "Failed to fetch NFT data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast, walletAddress]);

  // Fetch collection NFTs
  const fetchCollectionNFTs = useCallback(async (collection: NFTCollection) => {
    try {
      // Mock NFT items for the selected collection
      const mockNFTs: NFTItem[] = Array.from({ length: 20 }, (_, i) => ({
        tokenId: (i + 1).toString(),
        name: `${collection.name} #${i + 1}`,
        image: `https://images.unsplash.com/photo-${1570000000000 + i * 1000000}?w=400&h=400&fit=crop`,
        traits: [
          { trait_type: 'Background', value: ['Red', 'Blue', 'Green', 'Purple'][i % 4], rarity: Math.random() * 10 },
          { trait_type: 'Eyes', value: ['Normal', 'Laser', 'Zombie'][i % 3], rarity: Math.random() * 15 },
          { trait_type: 'Accessory', value: ['None', 'Hat', 'Glasses', 'Crown'][i % 4], rarity: Math.random() * 20 }
        ],
        rarityRank: i + 1,
        rarityScore: Math.random() * 1000,
        owner: `0x${Math.random().toString(16).substr(2, 40)}`,
        listed: Math.random() > 0.7,
        listingPrice: Math.random() > 0.7 ? Math.random() * 10 + 1 : undefined,
        lastSale: Math.random() > 0.5 ? {
          price: Math.random() * 5 + 0.5,
          currency: 'AVAX',
          timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        } : undefined
      }));

      setCollectionNFTs(mockNFTs);
    } catch (error) {
      console.error('Collection NFTs fetch error:', error);
    }
  }, []);

  useEffect(() => {
    fetchNFTData();
  }, [fetchNFTData]);

  useEffect(() => {
    if (selectedCollection) {
      fetchCollectionNFTs(selectedCollection);
    }
  }, [selectedCollection, fetchCollectionNFTs]);

  const formatNumber = (num: number, decimals = 2) => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(decimals)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(decimals)}K`;
    return num.toFixed(decimals);
  };

  const formatPercent = (percent: number) => {
    const isPositive = percent >= 0;
    return (
      <span className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {Math.abs(percent).toFixed(1)}%
      </span>
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'art': return 'bg-purple-100 text-purple-800';
      case 'gaming': return 'bg-green-100 text-green-800';
      case 'utility': return 'bg-blue-100 text-blue-800';
      case 'pfp': return 'bg-orange-100 text-orange-800';
      case 'music': return 'bg-pink-100 text-pink-800';
      case 'sports': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRarityColor = (rank: number, total: number) => {
    const percentile = (rank / total) * 100;
    if (percentile <= 1) return 'text-yellow-600'; // Legendary
    if (percentile <= 5) return 'text-purple-600'; // Epic
    if (percentile <= 15) return 'text-blue-600'; // Rare
    if (percentile <= 50) return 'text-green-600'; // Uncommon
    return 'text-gray-600'; // Common
  };

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Portfolio Stats */}
      {portfolioStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold">{portfolioStats.totalValue.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Total Value (AVAX)</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <ImageIcon className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold">{portfolioStats.totalItems}</p>
              <p className="text-sm text-muted-foreground">Total NFTs</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Star className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold">{portfolioStats.collections}</p>
              <p className="text-sm text-muted-foreground">Collections</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-orange-600" />
              <p className="text-2xl font-bold">+{portfolioStats.unrealizedGains.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Unrealized (AVAX)</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Crown className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
              <p className="text-lg font-bold">#{portfolioStats.rarest.rarityRank}</p>
              <p className="text-sm text-muted-foreground">Rarest Owned</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="w-6 h-6 mx-auto mb-2 text-avax-primary" />
              <p className="text-sm font-bold">{portfolioStats.topCollection}</p>
              <p className="text-sm text-muted-foreground">Top Collection</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="collections" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
          <TabsTrigger value="rarity">Rarity Tools</TabsTrigger>
          <TabsTrigger value="market">Market Trends</TabsTrigger>
        </TabsList>

        {/* Collections Tab */}
        <TabsContent value="collections" className="space-y-6">
          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                NFT Collections
              </CardTitle>
              <CardDescription>
                Explore and analyze NFT collections on Avalanche
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search collections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline">
                  <Activity className="w-4 h-4 mr-2" />
                  Trending
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCollections.map((collection) => (
                  <Card key={collection.contractAddress} className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setSelectedCollection(collection)}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{collection.name}</h4>
                          {collection.verified && (
                            <Badge variant="default" className="bg-blue-100 text-blue-800">
                              <Star className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <Badge className={getCategoryColor(collection.category)}>
                          {collection.category.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Floor Price</p>
                          <p className="font-bold">{collection.floorPrice} AVAX</p>
                          <div className="flex items-center gap-1">
                            {formatPercent(collection.change24h)}
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Volume (24h)</p>
                          <p className="font-bold">{formatNumber(collection.volume24h)} AVAX</p>
                          <p className="text-xs text-muted-foreground">
                            {collection.owners} owners
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{collection.totalSupply} items</span>
                        <span>{((collection.listedCount / collection.totalSupply) * 100).toFixed(1)}% listed</span>
                      </div>

                      {collection.topSales.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Recent Top Sale:</p>
                          <p className="text-sm font-medium">
                            #{collection.topSales[0].tokenId} - {collection.topSales[0].price} AVAX
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Collection Details Modal */}
          {selectedCollection && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    {selectedCollection.name} Collection
                  </CardTitle>
                  <Button variant="outline" onClick={() => setSelectedCollection(null)}>
                    Close
                  </Button>
                </div>
                <CardDescription>{selectedCollection.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="items">Items</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Contract Address</Label>
                          <p className="font-mono text-sm bg-muted p-2 rounded break-all">
                            {selectedCollection.contractAddress}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Total Supply</p>
                            <p className="font-bold">{selectedCollection.totalSupply.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Owners</p>
                            <p className="font-bold">{selectedCollection.owners.toLocaleString()}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">Ownership Distribution</p>
                          <Progress 
                            value={(selectedCollection.owners / selectedCollection.totalSupply) * 100} 
                            className="mt-1" 
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {((selectedCollection.owners / selectedCollection.totalSupply) * 100).toFixed(1)}% unique ownership
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <p className="text-2xl font-bold">{selectedCollection.floorPrice} AVAX</p>
                          <p className="text-sm text-muted-foreground">Floor Price</p>
                          {formatPercent(selectedCollection.change24h)}
                        </div>

                        <div className="text-center p-4 bg-muted rounded-lg">
                          <p className="text-2xl font-bold">{selectedCollection.averagePrice.toFixed(2)} AVAX</p>
                          <p className="text-sm text-muted-foreground">Average Price</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium mb-2">Volume Statistics</p>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">24h Volume:</span>
                              <span className="font-medium">{formatNumber(selectedCollection.volume24h)} AVAX</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">7d Volume:</span>
                              <span className="font-medium">{formatNumber(selectedCollection.volume7d)} AVAX</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Volume:</span>
                              <span className="font-medium">{formatNumber(selectedCollection.volumeTraded)} AVAX</span>
                            </div>
                          </div>
                        </div>

                        {selectedCollection.website && (
                          <div>
                            <p className="text-sm font-medium mb-2">Links</p>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="cursor-pointer">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Website
                              </Badge>
                              {selectedCollection.twitter && (
                                <Badge variant="outline" className="cursor-pointer">Twitter</Badge>
                              )}
                              {selectedCollection.discord && (
                                <Badge variant="outline" className="cursor-pointer">Discord</Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedCollection.topSales.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">Recent Top Sales</h4>
                        <div className="space-y-2">
                          {selectedCollection.topSales.map((sale, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div>
                                <p className="font-medium">#{sale.tokenId}</p>
                                <p className="text-sm text-muted-foreground">
                                  {sale.timestamp.toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">{sale.price} AVAX</p>
                                <p className="text-sm text-muted-foreground">
                                  ${(sale.price * 35).toFixed(0)} USD
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="items" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {collectionNFTs.slice(0, 12).map((nft) => (
                        <Card key={nft.tokenId} className="overflow-hidden">
                          <div className="aspect-square relative">
                            <img 
                              src={nft.image} 
                              alt={nft.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute top-2 left-2">
                              <Badge 
                                variant="secondary" 
                                className={`${getRarityColor(nft.rarityRank, selectedCollection.totalSupply)} bg-white/90`}
                              >
                                #{nft.rarityRank}
                              </Badge>
                            </div>
                            {nft.listed && (
                              <div className="absolute top-2 right-2">
                                <Badge variant="destructive">
                                  <DollarSign className="w-3 h-3 mr-1" />
                                  Listed
                                </Badge>
                              </div>
                            )}
                          </div>
                          <CardContent className="p-3">
                            <h4 className="font-medium text-sm mb-2">{nft.name}</h4>
                            
                            {nft.listingPrice && (
                              <p className="text-sm font-bold text-green-600 mb-2">
                                {nft.listingPrice.toFixed(2)} AVAX
                              </p>
                            )}

                            {nft.lastSale && (
                              <p className="text-xs text-muted-foreground">
                                Last: {nft.lastSale.price.toFixed(2)} AVAX
                              </p>
                            )}

                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground">
                                Rarity Score: {nft.rarityScore.toFixed(1)}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="analytics" className="space-y-4">
                    <Alert>
                      <Sparkles className="w-4 h-4" />
                      <AlertDescription>
                        Advanced analytics including price prediction, trait analysis, and market insights 
                        coming soon. This will provide deep insights into collection performance and trends.
                      </AlertDescription>
                    </Alert>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Analysis</CardTitle>
              <CardDescription>
                Analyze NFT portfolio for any Avalanche address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter wallet address (0x...)"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="font-mono"
                />
                <Button onClick={fetchNFTData} disabled={loading}>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze
                </Button>
              </div>

              {portfolioStats && walletAddress && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Portfolio Highlights</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h5 className="font-medium mb-2">Rarest NFT</h5>
                        <div className="flex gap-3">
                          <img 
                            src={portfolioStats.rarest.image} 
                            alt={portfolioStats.rarest.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{portfolioStats.rarest.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Rank #{portfolioStats.rarest.rarityRank}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Score: {portfolioStats.rarest.rarityScore.toFixed(1)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h5 className="font-medium mb-2">Portfolio Value</h5>
                        <p className="text-2xl font-bold text-green-600">
                          {portfolioStats.totalValue.toFixed(2)} AVAX
                        </p>
                        <p className="text-sm text-muted-foreground">
                          +{portfolioStats.unrealizedGains.toFixed(2)} unrealized gains
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          ≈ ${(portfolioStats.totalValue * 35).toFixed(0)} USD
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rarity Tools Tab */}
        <TabsContent value="rarity" className="space-y-6">
          <Alert>
            <Crown className="w-4 h-4" />
            <AlertDescription>
              Advanced rarity calculation tools, trait analysis, and collection ranking system 
              coming soon. This will help identify undervalued NFTs and rarity opportunities.
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Market Trends Tab */}
        <TabsContent value="market" className="space-y-6">
          <Alert>
            <TrendingUp className="w-4 h-4" />
            <AlertDescription>
              Market trend analysis, price predictions, and trading signals for NFT collections 
              coming soon. This will provide insights into market movements and opportunities.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
};