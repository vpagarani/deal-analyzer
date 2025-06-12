import React, { useState } from 'react';
import { Tooltip } from './Tooltip';
interface SliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  helpText?: string;
  formatValue?: (value: number) => string;
  suffix?: string;
}
export const Slider = ({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  helpText,
  formatValue,
  suffix
}: SliderProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const displayValue = formatValue ? formatValue(value) : value.toString();
  const percentage = (value - min) / (max - min) * 100;
  return <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          {helpText && <div className="ml-2">
              <Tooltip text={helpText} />
            </div>}
        </div>
        <div className="text-sm font-mono text-gray-700">
          {displayValue}
          {suffix}
        </div>
      </div>
      <div className="relative h-2 bg-gray-200 rounded-full">
        <div className="absolute h-full bg-blue-600 rounded-full" style={{
        width: `${percentage}%`
      }}></div>
        <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(parseFloat(e.target.value))} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} className="absolute w-full h-full opacity-0 cursor-pointer" />
        <div className={`absolute h-4 w-4 bg-white border-2 border-blue-600 rounded-full transform -translate-y-1/4 transition-transform ${isFocused ? 'scale-125' : ''}`} style={{
        left: `calc(${percentage}% - 8px)`
      }}></div>
      </div>
    </div>;
};