import React, { useState } from 'react';
import { HelpCircleIcon } from 'lucide-react';
interface TooltipProps {
  text: string;
  children?: ReactNode;
}
export const Tooltip = ({
  text,
  children
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  return <div className="relative inline-block">
      <div className="inline-flex items-center cursor-help" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
        {children || <HelpCircleIcon className="h-4 w-4 text-gray-400" />}
      </div>
      {isVisible && <div className="absolute z-10 w-64 p-3 bg-gray-800 text-white text-sm rounded-md shadow-lg bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2">
          {text}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
        </div>}
    </div>;
};