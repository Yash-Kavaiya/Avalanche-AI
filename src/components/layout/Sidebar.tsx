import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Mountain, 
  MessageSquare, 
  Wallet, 
  Search, 
  BarChart3, 
  Coins, 
  Image, 
  Settings,
  Home,
  Network,
  Globe,
  Shield,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  className?: string;
}

const navigation = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', href: '/', icon: Home },
      { name: 'AI Chat', href: '/chat', icon: MessageSquare },
      { name: 'Portfolio', href: '/portfolio', icon: BarChart3 },
    ]
  },
  {
    title: 'Blockchain Tools',
    items: [
      { name: 'Wallet Analysis', href: '/wallet', icon: Wallet },
      { name: 'Transaction Explorer', href: '/transactions', icon: Search },
      { name: 'DeFi Positions', href: '/defi', icon: Coins },
      { name: 'Subnet Explorer', href: '/subnets', icon: Network },
    ]
  },
  {
    title: 'Advanced Features',
    items: [
      { name: 'NFT Analytics', href: '/nft', icon: Image },
      { name: 'Market Intelligence', href: '/market', icon: Globe },
      { name: 'Security Scanner', href: '/security', icon: Shield },
      { name: 'Developer Tools', href: '/dev-tools', icon: Zap },
    ]
  },
];

export function Sidebar({ className }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={cn(
      "w-72 bg-sidebar-background border-r border-sidebar-border",
      "flex flex-col h-full",
      className
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-sidebar-border">
        <div className="w-8 h-8 avalanche-gradient rounded-lg flex items-center justify-center">
          <Mountain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-sidebar-foreground">Avalanche AI</h2>
          <p className="text-xs text-sidebar-foreground/70">Blockchain Analytics</p>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="space-y-8">
          {navigation.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider mb-3">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Button
                      key={item.name}
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 h-10",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                      onClick={() => navigate(item.href)}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </div>
    </div>
  );
}