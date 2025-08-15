import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

// Helper component for collapsible sections
export const CollapsibleSection = ({ title, isExpanded, onToggle, children }: {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 mb-3">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-purple-50 hover:to-purple-100 transition-all duration-200 rounded-t-xl group"
    >
      <span className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">{title}</span>
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full transition-colors ${
          isExpanded ? 'bg-purple-500' : 'bg-gray-400'
        }`} />
        {isExpanded ? 
          <ChevronDown className="w-4 h-4 text-purple-600 transition-transform" /> : 
          <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-purple-600 transition-colors" />
        }
      </div>
    </button>
    {isExpanded && (
      <div className="p-4 space-y-3 bg-gray-50/30 rounded-b-xl">
        {children}
      </div>
    )}
  </div>
);