import React from 'react';
import { Tooltip } from './Tooltip';
import { ChevronDownIcon } from 'lucide-react';
interface SelectOption {
  value: string;
  label: string;
}
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  helpText?: string;
  error?: string;
}
export const Select = ({
  label,
  options,
  helpText,
  error,
  ...props
}: SelectProps) => {
  return <div className="mb-4">
      <div className="flex items-center mb-1">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {helpText && <div className="ml-2">
            <Tooltip text={helpText} />
          </div>}
      </div>
      <div className="relative">
        <select className={`appearance-none w-full py-2 px-3 pr-10 border ${error ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white`} {...props}>
          {options.map(option => <option key={option.value} value={option.value}>
              {option.label}
            </option>)}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>;
};