
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="text-center">
        <Loader2 className="animate-spin h-16 w-16 text-raahi-blue mx-auto mb-4" />
        <h2 className="text-xl font-medium text-raahi-blue">
          <span className="text-raahi-orange">R</span>aahi
        </h2>
        <p className="text-gray-500 mt-2">Loading your travel experience...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
