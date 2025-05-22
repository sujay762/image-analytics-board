
import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardTabsProps {
  activeTab: 'analytics' | 'clinics';
  onTabChange: (tab: 'analytics' | 'clinics') => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex border-b mb-4">
      <button
        onClick={() => onTabChange('analytics')}
        className={cn(
          "py-2 px-4 relative",
          activeTab === 'analytics' && "font-medium"
        )}
      >
        Analytics Dashboard
        {activeTab === 'analytics' && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500"></div>
        )}
      </button>
      <button
        onClick={() => onTabChange('clinics')}
        className={cn(
          "py-2 px-4 relative",
          activeTab === 'clinics' && "font-medium"
        )}
      >
        Clinics Dashboard
        {activeTab === 'clinics' && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500"></div>
        )}
      </button>
    </div>
  );
};

export default DashboardTabs;
