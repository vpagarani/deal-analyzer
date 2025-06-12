import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
interface StepCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  isLastStep?: boolean;
}
export const StepCard = ({
  title,
  subtitle,
  children,
  onNext,
  onBack,
  isLastStep = false
}: StepCardProps) => {
  return <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all animate-fadeIn">
      <div className="p-6">
        <h2 className="text-2xl font-medium text-gray-800">{title}</h2>
        {subtitle && <p className="mt-1 text-gray-500">{subtitle}</p>}
        <div className="mt-6">{children}</div>
        <div className="mt-8 flex justify-between">
          {onBack ? <button onClick={onBack} className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back
            </button> : <div></div>}
          {onNext && <button onClick={onNext} className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              {isLastStep ? 'View Results' : 'Next'}
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </button>}
        </div>
      </div>
    </div>;
};