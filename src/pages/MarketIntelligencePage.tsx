import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import MarketIntelligence from '@/components/market/MarketIntelligence';

const MarketIntelligencePage: React.FC = () => {
  return (
    <DashboardLayout>
      <MarketIntelligence />
    </DashboardLayout>
  );
};

export default MarketIntelligencePage;