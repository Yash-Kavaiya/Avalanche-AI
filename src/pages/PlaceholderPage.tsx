import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function PlaceholderPage({ title, description, icon: Icon = Construction }: PlaceholderPageProps) {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6 h-full">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground mt-2">{description}</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Icon className="w-6 h-6 text-muted-foreground" />
                Coming Soon
              </CardTitle>
              <CardDescription>
                This feature is currently under development and will be available in a future update.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We're working hard to bring you the best {title.toLowerCase()} experience. 
                  Stay tuned for updates!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

export default PlaceholderPage;