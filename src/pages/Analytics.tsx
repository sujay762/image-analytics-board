
import React, { useState } from 'react';
import AnalyticsHeader from '@/components/AnalyticsHeader';
import DashboardTabs from '@/components/DashboardTabs';
import FilterButton from '@/components/FilterButton';
import AnalyticsContent from '@/components/analytics/AnalyticsContent';
import ClinicsContent from '@/components/clinics/ClinicsContent';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type TabType = 'analytics' | 'clinics';

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('analytics');
  const [filterOpen, setFilterOpen] = useState<boolean>(false);

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <AnalyticsHeader />
      
      <div className="mb-4 flex items-center">
        <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <FilterButton onClick={() => setFilterOpen(true)} />
      </div>

      {activeTab === 'analytics' ? (
        <ClinicsContent />
      ) : (
        <AnalyticsContent />
      )}

      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Date Range</label>
                <select className="w-full border rounded p-2">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                  <option>Custom Range</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Clinic</label>
                <select className="w-full border rounded p-2">
                  <option>All Clinics</option>
                  <option>Ayashu Clinic</option>
                  <option>Radha Hospital</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <select className="w-full border rounded p-2">
                  <option>All Categories</option>
                  <option>Appointments</option>
                  <option>Consultations</option>
                  <option>Billing</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button 
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                  onClick={() => setFilterOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                  onClick={() => setFilterOpen(false)}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Analytics;
