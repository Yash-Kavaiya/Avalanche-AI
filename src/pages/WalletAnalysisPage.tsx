import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { WalletAnalysis } from '@/components/wallet/WalletAnalysis';

export function WalletAnalysisPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <WalletAnalysis />
      </div>
    </DashboardLayout>
  );
}