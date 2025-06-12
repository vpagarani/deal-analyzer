import React, { useEffect, useState } from 'react';
import { StepCard } from '../StepCard';
import { Input } from '../ui/Input';
import { Slider } from '../ui/Slider';
import { usePropertyAnalysis } from '../../context/PropertyAnalysisContext';
import { PlusIcon, TrashIcon } from 'lucide-react';
interface IncomeInputsProps {
  onNext: () => void;
  onBack: () => void;
}
interface RentItem {
  id: string;
  description: string;
  amount: number;
  hasTenant: boolean;
}
export const IncomeInputs = ({
  onNext,
  onBack
}: IncomeInputsProps) => {
  const {
    incomeDetails,
    updateIncomeDetails,
    propertyDetails
  } = usePropertyAnalysis();
  const [rentItems, setRentItems] = useState<RentItem[]>([{
    id: '1',
    description: 'Main unit',
    amount: 0,
    hasTenant: false
  }]);
  const [otherIncomeItems, setOtherIncomeItems] = useState<RentItem[]>([]);
  // Calculate total monthly rent
  const totalRent = rentItems.reduce((sum, item) => sum + item.amount, 0);
  // Calculate total other income
  const totalOtherIncome = otherIncomeItems.reduce((sum, item) => sum + item.amount, 0);
  // Calculate tenant placement fees
  const calculateTenantPlacementFees = (items: RentItem[]) => {
    return items.reduce((total, item) => {
      if (!item.hasTenant) {
        return total + item.amount * 0.5; // 50% of one month's rent
      }
      return total;
    }, 0);
  };
  // Update context when values change
  useEffect(() => {
    const placementFees = calculateTenantPlacementFees(rentItems);
    updateIncomeDetails({
      monthlyRent: totalRent,
      otherIncome: totalOtherIncome,
      tenantPlacementFee: placementFees,
      rentUnits: rentItems
    });
  }, [rentItems, totalRent, totalOtherIncome]);
  const handleAddRentItem = () => {
    setRentItems([...rentItems, {
      id: `rent-${Date.now()}`,
      description: `Unit ${rentItems.length + 1}`,
      amount: 0,
      hasTenant: false
    }]);
  };
  const handleAddOtherIncomeItem = () => {
    setOtherIncomeItems([...otherIncomeItems, {
      id: `other-${Date.now()}`,
      description: '',
      amount: 0
    }]);
  };
  const updateRentItem = (id: string, updates: Partial<RentItem>) => {
    setRentItems(rentItems.map(item => item.id === id ? {
      ...item,
      ...updates
    } : item));
  };
  const updateOtherIncomeItem = (id: string, updates: Partial<RentItem>) => {
    setOtherIncomeItems(otherIncomeItems.map(item => item.id === id ? {
      ...item,
      ...updates
    } : item));
  };
  const removeRentItem = (id: string) => {
    setRentItems(rentItems.filter(item => item.id !== id));
  };
  const removeOtherIncomeItem = (id: string) => {
    setOtherIncomeItems(otherIncomeItems.filter(item => item.id !== id));
  };
  const handleSubmit = () => {
    // In a real app, we would validate here
    onNext();
  };
  // Suggest a reasonable rent based on property details
  const suggestedRent = Math.round(propertyDetails.price * 0.008); // 0.8% rule as a starting point
  // Auto-fill rent if it's 0
  useEffect(() => {
    if (rentItems[0].amount === 0 && suggestedRent > 0) {
      updateRentItem('1', {
        amount: suggestedRent
      });
    }
  }, [suggestedRent]);
  return <StepCard title="Income inputs" subtitle="Enter the expected rental income and other revenue sources" onNext={handleSubmit} onBack={onBack}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Rent roll</h3>
          <div className="space-y-3">
            {rentItems.map((item, index) => <div key={item.id} className="flex items-center space-x-3">
                <div className="flex-1">
                  <Input label={index === 0 ? 'Description' : ''} placeholder="Unit description" value={item.description} onChange={e => updateRentItem(item.id, {
                description: e.target.value
              })} />
                </div>
                <div className="w-36">
                  <Input label={index === 0 ? 'Monthly rent' : ''} type="number" prefix="$" placeholder="0" value={item.amount || ''} onChange={e => updateRentItem(item.id, {
                amount: parseFloat(e.target.value) || 0
              })} />
                </div>
                <div className="flex items-center mt-6 ml-2">
                  <label className="flex items-center space-x-2 text-sm text-gray-600">
                    <input type="checkbox" checked={item.hasTenant} onChange={e => updateRentItem(item.id, {
                  hasTenant: e.target.checked
                })} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span>Has tenant</span>
                  </label>
                </div>
                {rentItems.length > 1 && <button type="button" className="mt-6 p-1 text-gray-400 hover:text-red-500" onClick={() => removeRentItem(item.id)}>
                    <TrashIcon className="h-5 w-5" />
                  </button>}
              </div>)}
            <button type="button" className="flex items-center text-sm text-blue-600 hover:text-blue-800" onClick={handleAddRentItem}>
              <PlusIcon className="h-4 w-4 mr-1" />
              Add another unit
            </button>
          </div>
        </div>
        <div>
          <Input label="Vacancy rate" type="number" suffix="%" placeholder="5" value={incomeDetails.vacancyRate} onChange={e => updateIncomeDetails({
          vacancyRate: parseFloat(e.target.value) || 0
        })} helpText="Typical vacancy rates range from 3-10% depending on the market" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Other income
          </h3>
          {otherIncomeItems.length === 0 ? <div className="text-sm text-gray-500 mb-2">
              No additional income sources added
            </div> : <div className="space-y-3 mb-3">
              {otherIncomeItems.map((item, index) => <div key={item.id} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <Input label={index === 0 ? 'Description' : ''} placeholder="Laundry, parking, etc." value={item.description} onChange={e => updateOtherIncomeItem(item.id, {
                description: e.target.value
              })} />
                  </div>
                  <div className="w-36">
                    <Input label={index === 0 ? 'Monthly amount' : ''} type="number" prefix="$" placeholder="0" value={item.amount || ''} onChange={e => updateOtherIncomeItem(item.id, {
                amount: parseFloat(e.target.value) || 0
              })} />
                  </div>
                  <button type="button" className="mt-6 p-1 text-gray-400 hover:text-red-500" onClick={() => removeOtherIncomeItem(item.id)}>
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>)}
            </div>}
          <button type="button" className="flex items-center text-sm text-blue-600 hover:text-blue-800" onClick={handleAddOtherIncomeItem}>
            <PlusIcon className="h-4 w-4 mr-1" />
            Add other income source
          </button>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Total monthly income:</span>
            <span className="text-lg font-mono font-medium">
              $
              {(totalRent + totalOtherIncome).toLocaleString('en-US', {
              maximumFractionDigits: 0
            })}
            </span>
          </div>
          <div className="flex justify-between items-center mt-1 text-sm">
            <span className="text-gray-500">
              After vacancy ({incomeDetails.vacancyRate}%):
            </span>
            <span className="font-mono">
              $
              {((totalRent + totalOtherIncome) * (1 - incomeDetails.vacancyRate / 100)).toLocaleString('en-US', {
              maximumFractionDigits: 0
            })}
            </span>
          </div>
          {calculateTenantPlacementFees(rentItems) > 0 && <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="text-sm text-amber-600">
                Note: Tenant placement fees (one-time): $
                {Math.round(calculateTenantPlacementFees(rentItems)).toLocaleString()}
              </div>
            </div>}
        </div>
      </div>
    </StepCard>;
};