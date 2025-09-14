import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Wallet, 
  Activity, 
  Users, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Shield,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

const stats = [
  {
    title: 'Total Portfolio Value',
    value: '$124,532',
    change: '+12.3%',
    changeType: 'positive' as const,
    icon: DollarSign,
    description: 'Across all connected wallets',
  },
  {
    title: 'Active Wallets',
    value: '3',
    change: '+1',
    changeType: 'positive' as const,
    icon: Wallet,
    description: '2 on C-Chain, 1 on P-Chain',
  },
  {
    title: 'AVAX Holdings',
    value: '2,847.52',
    change: '-2.1%',
    changeType: 'negative' as const,
    icon: Activity,
    description: 'Current price: $42.50',
  },
  {
    title: 'DeFi Positions',
    value: '8',
    change: '+2',
    changeType: 'positive' as const,
    icon: TrendingUp,
    description: 'Across 5 protocols',
  },
];

const recentActivity = [
  {
    type: 'swap',
    description: 'Swapped 100 USDC for AVAX',
    value: '$4,250',
    timestamp: '2 minutes ago',
    status: 'completed',
  },
  {
    type: 'stake',
    description: 'Staked 50 AVAX to Validator',
    value: '50 AVAX',
    timestamp: '1 hour ago',
    status: 'completed',
  },
  {
    type: 'bridge',
    description: 'Bridged ETH from Ethereum',
    value: '$8,500',
    timestamp: '3 hours ago',
    status: 'pending',
  },
];

const quickActions = [
  {
    title: 'Analyze Wallet',
    description: 'Get detailed insights',
    icon: Wallet,
    color: 'bg-blue-500/10 text-blue-600',
  },
  {
    title: 'Track Transaction',
    description: 'Follow tx status',
    icon: Activity,
    color: 'bg-green-500/10 text-green-600',
  },
  {
    title: 'DeFi Scanner',
    description: 'Find opportunities',
    icon: Zap,
    color: 'bg-yellow-500/10 text-yellow-600',
  },
  {
    title: 'Security Check',
    description: 'Audit contracts',
    icon: Shield,
    color: 'bg-red-500/10 text-red-600',
  },
];

export function DashboardOverview() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your Avalanche portfolio.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500/10 text-green-600 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            Live Data
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <div className={cn(
                  "flex items-center",
                  stat.changeType === 'positive' ? "text-green-600" : "text-red-600"
                )}>
                  {stat.changeType === 'positive' ? (
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 mr-1" />
                  )}
                  {stat.change}
                </div>
                <span>{stat.description}</span>
              </div>
            </CardContent>
            <div className={cn(
              "absolute top-0 right-0 w-16 h-16 opacity-10",
              stat.changeType === 'positive' ? "bg-green-500" : "bg-red-500"
            )} style={{ clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)' }} />
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest transactions and DeFi interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      activity.status === 'completed' ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                    )}>
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{activity.value}</p>
                    <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {quickActions.map((action) => (
                <Button
                  key={action.title}
                  variant="ghost"
                  className="h-auto p-4 justify-start"
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mr-3", action.color)}>
                    <action.icon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Avalanche Network Status
          </CardTitle>
          <CardDescription>
            Real-time network metrics and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm font-medium">Block Time</p>
                <p className="text-2xl font-bold text-green-600">1.2s</p>
              </div>
              <div className="text-green-600">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm font-medium">Active Validators</p>
                <p className="text-2xl font-bold text-blue-600">1,847</p>
              </div>
              <div className="text-blue-600">
                <Users className="w-6 h-6" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm font-medium">Total Staked</p>
                <p className="text-2xl font-bold text-purple-600">67.8%</p>
              </div>
              <div className="text-purple-600">
                <Shield className="w-6 h-6" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}