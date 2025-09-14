/**
 * Subnet Explorer Component
 * Comprehensive tool for exploring and analyzing Avalanche subnets
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
  Network, 
  Server, 
  Users, 
  Zap, 
  Clock,
  Shield,
  TrendingUp,
  Activity,
  Search,
  Plus,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Validator {
  nodeID: string;
  weight: number;
  connected: boolean;
  uptime: number;
  stakeAmount: number;
  rewardOwner: string;
  potentialReward: number;
}

interface SubnetInfo {
  id: string;
  name: string;
  description?: string;
  controlKeys: string[];
  threshold: number;
  validators: Validator[];
  totalStake: number;
  isPermissioned: boolean;
  vmID?: string;
  chainID?: string;
  createdAt?: Date;
  status: 'active' | 'inactive' | 'pending';
  networkStats: {
    transactions24h: number;
    blocks24h: number;
    avgBlockTime: number;
    gasPrice: number;
  };
  category: 'defi' | 'gaming' | 'enterprise' | 'infrastructure' | 'other';
  website?: string;
  social?: {
    twitter?: string;
    discord?: string;
    github?: string;
  };
}

interface SubnetMetrics {
  totalSubnets: number;
  activeSubnets: number;
  totalValidators: number;
  totalStaked: number;
  averageUptime: number;
  newSubnets7d: number;
}

export const SubnetExplorer: React.FC = () => {
  const [subnets, setSubnets] = useState<SubnetInfo[]>([]);
  const [metrics, setMetrics] = useState<SubnetMetrics | null>(null);
  const [selectedSubnet, setSelectedSubnet] = useState<SubnetInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();

  // Fetch subnet data
  const fetchSubnetData = useCallback(async () => {
    setLoading(true);
    try {
      // Mock subnet data - replace with actual Avalanche API calls
      const mockSubnets: SubnetInfo[] = [
        {
          id: '2bRCr6B4MiEfSjidDwxDpdCyviwnfUVqB2HGwhm947w9YYqb7r',
          name: 'DeFi Kingdoms Subnet',
          description: 'Gaming and DeFi hybrid subnet for DeFi Kingdoms',
          controlKeys: ['P-avax1s3p4rsh2h9vsnfff98mqh9gfn3v2y2rlvzr9e2'],
          threshold: 1,
          isPermissioned: true,
          vmID: 'srEXiWaHuhNyGwPUi444Tu47ZEDwxTWrbQiuD7FmgSAQ6X7Dy',
          chainID: '0x335eeca0',
          category: 'gaming',
          status: 'active',
          totalStake: 2000000,
          website: 'https://defikingdoms.com',
          social: {
            twitter: '@DefiKingdoms',
            discord: 'defikingdoms',
            github: 'defikingdoms'
          },
          validators: [
            {
              nodeID: 'NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg',
              weight: 500000,
              connected: true,
              uptime: 99.8,
              stakeAmount: 500000,
              rewardOwner: 'P-avax1s3p4rsh2h9vsnfff98mqh9gfn3v2y2rlvzr9e2',
              potentialReward: 25000
            },
            {
              nodeID: 'NodeID-MFrZFVCXPv5iCn6M9K6XduxGTYp891xXZ',
              weight: 750000,
              connected: true,
              uptime: 99.9,
              stakeAmount: 750000,
              rewardOwner: 'P-avax1m8pfrv3q7z8ahkv8t5ju2k4ua7gyl3lx5zm4j6',
              potentialReward: 37500
            }
          ],
          networkStats: {
            transactions24h: 45000,
            blocks24h: 4320,
            avgBlockTime: 20,
            gasPrice: 25
          },
          createdAt: new Date('2022-03-30')
        },
        {
          id: '2DeHa6BR9bqFzJgqX4wG8vTg6v8xqjEHf4nPVjh7zNDgz8r8vX',
          name: 'Swimmer Network',
          description: 'High-performance DeFi subnet with advanced trading features',
          controlKeys: ['P-avax1qm2m6k8v5s8k9a7w8n9e5r6t7u8i9o0p1q2w3e4'],
          threshold: 2,
          isPermissioned: true,
          category: 'defi',
          status: 'active',
          totalStake: 1500000,
          website: 'https://swimmer.network',
          validators: [
            {
              nodeID: 'NodeID-BFa1padLXBj7VHdg4X5u7Nc7H2KVEYZ8b',
              weight: 500000,
              connected: true,
              uptime: 99.7,
              stakeAmount: 500000,
              rewardOwner: 'P-avax1qm2m6k8v5s8k9a7w8n9e5r6t7u8i9o0p1q2w3e4',
              potentialReward: 22000
            }
          ],
          networkStats: {
            transactions24h: 28000,
            blocks24h: 4320,
            avgBlockTime: 20,
            gasPrice: 20
          },
          createdAt: new Date('2022-05-15')
        },
        {
          id: '3F7vMgaMhCMysxXhVhozJY8RSvdqcBwKRzdHH6Y7YkP8Tqv8gK',
          name: 'Crabada Subnet',
          description: 'Gaming subnet for the Crabada NFT game ecosystem',
          controlKeys: ['P-avax1z2x3c4v5b6n7m8k9j0h1g2f3d4s5a6p7o8i9u0y'],
          threshold: 1,
          isPermissioned: true,
          category: 'gaming',
          status: 'active',
          totalStake: 1200000,
          website: 'https://crabada.com',
          validators: [
            {
              nodeID: 'NodeID-CZmZ3VixqKTNPRzMmWHcvFHa2r5k6Pm7X',
              weight: 400000,
              connected: true,
              uptime: 99.5,
              stakeAmount: 400000,
              rewardOwner: 'P-avax1z2x3c4v5b6n7m8k9j0h1g2f3d4s5a6p7o8i9u0y',
              potentialReward: 18000
            }
          ],
          networkStats: {
            transactions24h: 35000,
            blocks24h: 4320,
            avgBlockTime: 20,
            gasPrice: 22
          },
          createdAt: new Date('2022-07-20')
        }
      ];

      setSubnets(mockSubnets);

      // Mock metrics
      const mockMetrics: SubnetMetrics = {
        totalSubnets: 25,
        activeSubnets: 22,
        totalValidators: 156,
        totalStaked: 45000000,
        averageUptime: 99.6,
        newSubnets7d: 3
      };

      setMetrics(mockMetrics);

    } catch (error) {
      console.error('Subnet data fetch error:', error);
      toast({
        title: "Data Fetch Error",
        description: "Failed to fetch subnet data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSubnetData();
  }, [fetchSubnetData]);

  // Filter subnets based on search and category
  const filteredSubnets = subnets.filter(subnet => {
    const matchesSearch = subnet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subnet.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || subnet.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const formatNumber = (num: number) => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  const getStatusIcon = (status: SubnetInfo['status']) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'defi': return 'bg-blue-100 text-blue-800';
      case 'gaming': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-green-100 text-green-800';
      case 'infrastructure': return 'bg-gray-100 text-gray-800';
      default: return 'bg-orange-100 text-orange-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Network className="w-6 h-6 mx-auto mb-2 text-avax-primary" />
              <p className="text-2xl font-bold">{metrics.totalSubnets}</p>
              <p className="text-sm text-muted-foreground">Total Subnets</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Activity className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold">{metrics.activeSubnets}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold">{metrics.totalValidators}</p>
              <p className="text-sm text-muted-foreground">Validators</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
              <p className="text-2xl font-bold">{formatNumber(metrics.totalStaked)}</p>
              <p className="text-sm text-muted-foreground">AVAX Staked</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Shield className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold">{metrics.averageUptime}%</p>
              <p className="text-sm text-muted-foreground">Avg Uptime</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-orange-600" />
              <p className="text-2xl font-bold">+{metrics.newSubnets7d}</p>
              <p className="text-sm text-muted-foreground">New (7d)</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Subnet Explorer
          </CardTitle>
          <CardDescription>
            Explore and analyze Avalanche subnets, validators, and network statistics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Subnets</Label>
              <Input
                id="search"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="defi">DeFi</option>
                <option value="gaming">Gaming</option>
                <option value="enterprise">Enterprise</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subnet List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Subnet Directory</CardTitle>
            <CardDescription>{filteredSubnets.length} subnets found</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {filteredSubnets.map((subnet) => (
                  <div
                    key={subnet.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                      selectedSubnet?.id === subnet.id ? 'bg-muted border-primary' : ''
                    }`}
                    onClick={() => setSelectedSubnet(subnet)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(subnet.status)}
                        <h4 className="font-medium">{subnet.name}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getCategoryColor(subnet.category)}>
                          {subnet.category.toUpperCase()}
                        </Badge>
                        {subnet.website && (
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {subnet.description && (
                      <p className="text-sm text-muted-foreground mb-3">{subnet.description}</p>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Validators:</span>
                        <span className="ml-1 font-medium">{subnet.validators.length}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Stake:</span>
                        <span className="ml-1 font-medium">{formatNumber(subnet.totalStake)} AVAX</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Subnet Details */}
        <Card>
          <CardHeader>
            <CardTitle>Subnet Details</CardTitle>
            <CardDescription>
              {selectedSubnet ? `Details for ${selectedSubnet.name}` : 'Select a subnet to view details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedSubnet ? (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="validators">Validators</TabsTrigger>
                  <TabsTrigger value="stats">Statistics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Subnet ID</Label>
                      <p className="font-mono text-sm bg-muted p-2 rounded break-all">
                        {selectedSubnet.id}
                      </p>
                    </div>

                    {selectedSubnet.chainID && (
                      <div>
                        <Label className="text-sm font-medium">Chain ID</Label>
                        <p className="font-mono text-sm">{selectedSubnet.chainID}</p>
                      </div>
                    )}

                    <div>
                      <Label className="text-sm font-medium">Permissioned</Label>
                      <p className="text-sm">{selectedSubnet.isPermissioned ? 'Yes' : 'No'}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Control Threshold</Label>
                      <p className="text-sm">{selectedSubnet.threshold} of {selectedSubnet.controlKeys.length} signatures required</p>
                    </div>

                    {selectedSubnet.website && (
                      <div>
                        <Label className="text-sm font-medium">Website</Label>
                        <a
                          href={selectedSubnet.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {selectedSubnet.website}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {selectedSubnet.social && (
                      <div>
                        <Label className="text-sm font-medium">Social Links</Label>
                        <div className="flex gap-2 mt-1">
                          {selectedSubnet.social.twitter && (
                            <Badge variant="outline">Twitter</Badge>
                          )}
                          {selectedSubnet.social.discord && (
                            <Badge variant="outline">Discord</Badge>
                          )}
                          {selectedSubnet.social.github && (
                            <Badge variant="outline">GitHub</Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="validators" className="space-y-4">
                  <div className="space-y-3">
                    {selectedSubnet.validators.map((validator, index) => (
                      <div key={validator.nodeID} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {validator.connected ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className="font-medium">Validator {index + 1}</span>
                          </div>
                          <Badge variant="outline">{validator.uptime.toFixed(1)}% uptime</Badge>
                        </div>

                        <div className="text-sm space-y-1">
                          <p>
                            <span className="text-muted-foreground">Node ID:</span>
                            <span className="ml-1 font-mono">{validator.nodeID.slice(0, 20)}...</span>
                          </p>
                          <p>
                            <span className="text-muted-foreground">Stake:</span>
                            <span className="ml-1 font-medium">{formatNumber(validator.stakeAmount)} AVAX</span>
                          </p>
                          <p>
                            <span className="text-muted-foreground">Weight:</span>
                            <span className="ml-1">{formatNumber(validator.weight)}</span>
                          </p>
                          <p>
                            <span className="text-muted-foreground">Potential Reward:</span>
                            <span className="ml-1 text-green-600">{formatNumber(validator.potentialReward)} AVAX</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="stats" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-lg font-bold">{formatNumber(selectedSubnet.networkStats.transactions24h)}</p>
                      <p className="text-sm text-muted-foreground">Transactions (24h)</p>
                    </div>

                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-lg font-bold">{formatNumber(selectedSubnet.networkStats.blocks24h)}</p>
                      <p className="text-sm text-muted-foreground">Blocks (24h)</p>
                    </div>

                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-lg font-bold">{selectedSubnet.networkStats.avgBlockTime}s</p>
                      <p className="text-sm text-muted-foreground">Avg Block Time</p>
                    </div>

                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-lg font-bold">{selectedSubnet.networkStats.gasPrice}</p>
                      <p className="text-sm text-muted-foreground">Gas Price (Gwei)</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Validator Health</span>
                        <span>{selectedSubnet.validators.filter(v => v.connected).length}/{selectedSubnet.validators.length} online</span>
                      </div>
                      <Progress 
                        value={(selectedSubnet.validators.filter(v => v.connected).length / selectedSubnet.validators.length) * 100} 
                        className="h-2" 
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Average Uptime</span>
                        <span>
                          {(selectedSubnet.validators.reduce((sum, v) => sum + v.uptime, 0) / selectedSubnet.validators.length).toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={selectedSubnet.validators.reduce((sum, v) => sum + v.uptime, 0) / selectedSubnet.validators.length} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <Alert>
                <Network className="w-4 h-4" />
                <AlertDescription>
                  Select a subnet from the list to view detailed information about its validators, 
                  statistics, and network performance.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};