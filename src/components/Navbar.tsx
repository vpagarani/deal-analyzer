import React from 'react';
import { HomeIcon } from 'lucide-react';
export const Navbar = () => {
  return <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <HomeIcon className="h-6 w-6 text-blue-600" />
          <span className="font-medium text-lg">PropertyAnalyzer</span>
        </div>
      </div>
    </header>;
};