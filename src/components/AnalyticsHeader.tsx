
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AnalyticsHeader: React.FC = () => {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <Link to="/" className="p-2 rounded-lg bg-gray-100 flex items-center justify-center">
        <ArrowLeft className="h-5 w-5" />
      </Link>
      <h1 className="text-2xl font-semibold">Analytics</h1>
    </div>
  );
};

export default AnalyticsHeader;
