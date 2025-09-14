import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface PriceAlert {
  id: string;
  asset: string;
  condition: 'above' | 'below';
  price: number;
  currentPrice: number;
  isActive: boolean;
  createdAt: string;
}

const PriceAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: '1',
      asset: 'AVAX',
      condition: 'above',
      price: 45.00,
      currentPrice: 42.35,
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      asset: 'JOE',
      condition: 'below',
      price: 0.30,
      currentPrice: 0.385,
      isActive: true,
      createdAt: '2024-01-14'
    },
    {
      id: '3',
      asset: 'PNG',
      condition: 'above',
      price: 0.030,
      currentPrice: 0.025,
      isActive: false,
      createdAt: '2024-01-13'
    }
  ]);

  const [newAlert, setNewAlert] = useState({
    asset: '',
    condition: 'above' as 'above' | 'below',
    price: ''
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateAlert = () => {
    if (!newAlert.asset || !newAlert.price) return;

    const alert: PriceAlert = {
      id: Date.now().toString(),
      asset: newAlert.asset,
      condition: newAlert.condition,
      price: parseFloat(newAlert.price),
      currentPrice: newAlert.asset === 'AVAX' ? 42.35 : newAlert.asset === 'JOE' ? 0.385 : 0.025,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setAlerts([...alerts, alert]);
    setNewAlert({ asset: '', condition: 'above', price: '' });
    setIsDialogOpen(false);
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const getAlertStatus = (alert: PriceAlert) => {
    if (!alert.isActive) return { status: 'inactive', color: 'bg-gray-100 text-gray-800' };
    
    const triggered = alert.condition === 'above' 
      ? alert.currentPrice >= alert.price
      : alert.currentPrice <= alert.price;
    
    if (triggered) {
      return { status: 'triggered', color: 'bg-red-100 text-red-800' };
    } else {
      return { status: 'waiting', color: 'bg-blue-100 text-blue-800' };
    }
  };

  const getProgressPercentage = (alert: PriceAlert) => {
    if (alert.condition === 'above') {
      return Math.min((alert.currentPrice / alert.price) * 100, 100);
    } else {
      return Math.min(((alert.price - alert.currentPrice) / alert.price) * 100, 100);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Price Alerts
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Alert
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Price Alert</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="asset">Asset</Label>
                  <Select value={newAlert.asset} onValueChange={(value) => setNewAlert({...newAlert, asset: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AVAX">AVAX</SelectItem>
                      <SelectItem value="JOE">JOE</SelectItem>
                      <SelectItem value="PNG">PNG</SelectItem>
                      <SelectItem value="QI">QI</SelectItem>
                      <SelectItem value="YAK">YAK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <Select value={newAlert.condition} onValueChange={(value) => setNewAlert({...newAlert, condition: value as 'above' | 'below'})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">Above</SelectItem>
                      <SelectItem value="below">Below</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="price">Target Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newAlert.price}
                    onChange={(e) => setNewAlert({...newAlert, price: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                
                <Button onClick={handleCreateAlert} className="w-full">
                  Create Alert
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No price alerts set</p>
              <p className="text-sm">Create your first alert to get notified of price movements</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const alertStatus = getAlertStatus(alert);
              const progress = getProgressPercentage(alert);
              
              return (
                <div key={alert.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {alert.asset.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{alert.asset}</span>
                          {alert.condition === 'above' ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {alert.condition === 'above' ? 'Above' : 'Below'} ${alert.price.toFixed(3)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={alertStatus.color}>
                        {alertStatus.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleAlert(alert.id)}
                        className="p-1"
                      >
                        {alert.isActive ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : (
                          <Bell className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current: ${alert.currentPrice.toFixed(3)}</span>
                      <span>Target: ${alert.price.toFixed(3)}</span>
                    </div>
                    
                    {alert.isActive && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            alertStatus.status === 'triggered' ? 'bg-red-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    )}
                    
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Created: {alert.createdAt}</span>
                      <span>{Math.abs(((alert.currentPrice - alert.price) / alert.price * 100)).toFixed(1)}% away</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceAlerts;