import React from 'react';
import { StepCard } from '../StepCard';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { usePropertyAnalysis } from '../../context/PropertyAnalysisContext';
interface GrowthAssumptionsProps {
  onNext: () => void;
  onBack: () => void;
}
export const GrowthAssumptions = ({
  onNext,
  onBack
}: GrowthAssumptionsProps) => {
  const {
    growthAssumptions,
    updateGrowthAssumptions
  } = usePropertyAnalysis();
  return <StepCard title="Growth assumptions" subtitle="Set your assumptions for future growth and holding period" onNext={onNext} onBack={onBack} isLastStep>
      <div className="space-y-6">
        <Input label="Annual rent growth" type="number" suffix="%" placeholder="2" value={growthAssumptions.rentGrowth} onChange={e => updateGrowthAssumptions({
        rentGrowth: parseFloat(e.target.value) || 0
      })} helpText="Historical average is 2-4% per year" />
        <Input label="Annual expense growth" type="number" suffix="%" placeholder="2" value={growthAssumptions.expenseGrowth} onChange={e => updateGrowthAssumptions({
        expenseGrowth: parseFloat(e.target.value) || 0
      })} helpText="Typically tracks with inflation (2-3%)" />
        <Input label="Annual property appreciation" type="number" suffix="%" placeholder="3" value={growthAssumptions.propertyAppreciation} onChange={e => updateGrowthAssumptions({
        propertyAppreciation: parseFloat(e.target.value) || 0
      })} helpText="Historical average is 3-4% per year" />
        <Select label="Holding period" options={[{
        value: '1',
        label: '1 year'
      }, {
        value: '3',
        label: '3 years'
      }, {
        value: '5',
        label: '5 years'
      }, {
        value: '10',
        label: '10 years'
      }, {
        value: '15',
        label: '15 years'
      }, {
        value: '30',
        label: '30 years (full loan term)'
      }]} value={growthAssumptions.holdingPeriod.toString()} onChange={e => updateGrowthAssumptions({
        holdingPeriod: parseInt(e.target.value)
      })} helpText="How long you plan to hold this property" />
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-sm font-medium text-gray-800 mb-2">
            Value projection
          </div>
          <div className="space-y-2">
            {[1, 5, 10, 30].map(year => {
            const projectedValue = calculateProjectedValue(year, growthAssumptions.propertyAppreciation);
            return <div key={year} className="flex justify-between items-center">
                  <span className="text-gray-600">Year {year}:</span>
                  <span className="font-mono">
                    $
                    {projectedValue.toLocaleString('en-US', {
                  maximumFractionDigits: 0
                })}
                  </span>
                </div>;
          })}
          </div>
        </div>
      </div>
    </StepCard>;
};
function calculateProjectedValue(years: number, appreciationRate: number): number {
  const {
    propertyDetails
  } = usePropertyAnalysis();
  return propertyDetails.price * Math.pow(1 + appreciationRate / 100, years);
}