import React, { useEffect } from 'react';
import { StepCard } from '../StepCard';
import { Input } from '../ui/Input';
import { Slider } from '../ui/Slider';
import { usePropertyAnalysis } from '../../context/PropertyAnalysisContext';
interface ExpenseInputsProps {
  onNext: () => void;
  onBack: () => void;
}
interface MaintenanceOption {
  label: string;
  value: 'low' | 'medium' | 'high';
  percentage: number;
  description: string;
}
const maintenanceOptions: MaintenanceOption[] = [{
  label: 'Low',
  value: 'low',
  percentage: 5,
  description: 'Newer property, minimal repairs expected'
}, {
  label: 'Medium',
  value: 'medium',
  percentage: 7.5,
  description: 'Average age and condition'
}, {
  label: 'High',
  value: 'high',
  percentage: 10,
  description: 'Older property, more repairs expected'
}];
export const ExpenseInputs = ({
  onNext,
  onBack
}: ExpenseInputsProps) => {
  const {
    expenseDetails,
    updateExpenseDetails,
    propertyDetails,
    incomeDetails
  } = usePropertyAnalysis();
  // Calculate effective gross income
  const effectiveGrossIncome = incomeDetails.monthlyRent * 12 * (1 - incomeDetails.vacancyRate / 100) + incomeDetails.otherIncome * 12;
  // Suggest property tax (approximately 1.1% of property value annually)
  const suggestedPropertyTax = propertyDetails.price * 0.011;
  // Suggest insurance (approximately 0.5% of property value annually)
  const suggestedInsurance = propertyDetails.price * 0.005;
  // Auto-fill values if they're 0
  useEffect(() => {
    if (expenseDetails.propertyTax === 0 && suggestedPropertyTax > 0) {
      updateExpenseDetails({
        propertyTax: Math.round(suggestedPropertyTax)
      });
    }
    if (expenseDetails.insurance === 0 && suggestedInsurance > 0) {
      updateExpenseDetails({
        insurance: Math.round(suggestedInsurance)
      });
    }
  }, [suggestedPropertyTax, suggestedInsurance]);
  const getPercentageFromLevel = (level: 'low' | 'medium' | 'high') => {
    return maintenanceOptions.find(opt => opt.value === level)?.percentage || 7.5;
  };
  // Calculate maintenance cost based on level
  const maintenanceCost = incomeDetails.monthlyRent * 12 * (getPercentageFromLevel(expenseDetails.maintenanceLevel) / 100);
  // Calculate CapEx cost based on level
  const capExCost = incomeDetails.monthlyRent * 12 * (getPercentageFromLevel(expenseDetails.capExLevel) / 100);
  // Calculate property management cost based on percentage of rent
  const propertyManagementCost = incomeDetails.monthlyRent * 12 * (expenseDetails.propertyManagement / 100);
  // Calculate total annual expenses
  const totalAnnualExpenses = expenseDetails.propertyTax + expenseDetails.insurance + expenseDetails.hoa * 12 + maintenanceCost + capExCost + propertyManagementCost + expenseDetails.utilities * 12;
  return <StepCard title="Expense inputs" subtitle="Enter the expected expenses for this property" onNext={onNext} onBack={onBack}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Fixed expenses
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Annual property tax" type="number" prefix="$" placeholder="3850" value={expenseDetails.propertyTax || ''} onChange={e => updateExpenseDetails({
            propertyTax: parseFloat(e.target.value) || 0
          })} helpText="Annual property tax amount" />
            <Input label="Annual insurance" type="number" prefix="$" placeholder="1750" value={expenseDetails.insurance || ''} onChange={e => updateExpenseDetails({
            insurance: parseFloat(e.target.value) || 0
          })} helpText="Annual property insurance premium" />
            <Input label="Monthly HOA" type="number" prefix="$" placeholder="0" value={expenseDetails.hoa || ''} onChange={e => updateExpenseDetails({
            hoa: parseFloat(e.target.value) || 0
          })} helpText="Monthly HOA or condo fees (if applicable)" />
            <Input label="Monthly utilities" type="number" prefix="$" placeholder="0" value={expenseDetails.utilities || ''} onChange={e => updateExpenseDetails({
            utilities: parseFloat(e.target.value) || 0
          })} helpText="Monthly utilities paid by owner (if applicable)" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Variable expenses
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maintenance level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {maintenanceOptions.map(option => <button key={option.value} type="button" className={`p-3 border rounded-lg text-left transition-colors ${expenseDetails.maintenanceLevel === option.value ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`} onClick={() => updateExpenseDetails({
                maintenanceLevel: option.value
              })}>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm mt-1">{option.percentage}%</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {option.description}
                    </div>
                  </button>)}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                ${Math.round(maintenanceCost)} per year ($
                {Math.round(maintenanceCost / 12)}/month)
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capital Expenditures (CapEx) level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {maintenanceOptions.map(option => <button key={option.value} type="button" className={`p-3 border rounded-lg text-left transition-colors ${expenseDetails.capExLevel === option.value ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`} onClick={() => updateExpenseDetails({
                capExLevel: option.value
              })}>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm mt-1">{option.percentage}%</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {option.description}
                    </div>
                  </button>)}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                ${Math.round(capExCost)} per year (${Math.round(capExCost / 12)}
                /month)
              </div>
            </div>
            <Input label="Property management" type="number" suffix="% of rent" placeholder="8" value={expenseDetails.propertyManagement} onChange={e => updateExpenseDetails({
            propertyManagement: parseFloat(e.target.value) || 0
          })} helpText="Typical property management fees range from 7-10% of rental income" />
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Total annual expenses:</span>
            <span className="text-lg font-mono font-medium">
              $
              {totalAnnualExpenses.toLocaleString('en-US', {
              maximumFractionDigits: 0
            })}
            </span>
          </div>
          <div className="flex justify-between items-center mt-1 text-sm">
            <span className="text-gray-500">Monthly expenses:</span>
            <span className="font-mono">
              $
              {(totalAnnualExpenses / 12).toLocaleString('en-US', {
              maximumFractionDigits: 0
            })}
            </span>
          </div>
          <div className="flex justify-between items-center mt-1 text-sm">
            <span className="text-gray-500">Expense ratio:</span>
            <span className="font-mono">
              {effectiveGrossIncome ? Math.round(totalAnnualExpenses / effectiveGrossIncome * 100) : 0}
              %
            </span>
          </div>
        </div>
      </div>
    </StepCard>;
};