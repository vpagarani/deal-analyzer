import React from 'react';
import { Tooltip } from './Tooltip';
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helpText?: string;
  error?: string;
  prefix?: string;
  suffix?: string;
}
export const Input = ({
  label,
  helpText,
  error,
  prefix,
  suffix,
  ...props
}: InputProps) => {
  return <div className="mb-4">
      <div className="flex items-center mb-1">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {helpText && <div className="ml-2">
            <Tooltip text={helpText} />
          </div>}
      </div>
      <div className={`relative flex items-center rounded-md border ${error ? 'border-red-300' : 'border-gray-300'} focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500`}>
        {prefix && <span className="pl-3 text-gray-500">{prefix}</span>}
        <input className={`w-full py-2 px-3 ${prefix ? 'pl-1' : ''} ${suffix ? 'pr-1' : ''} text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent`} {...props} />
        {suffix && <span className="pr-3 text-gray-500">{suffix}</span>}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>;
};