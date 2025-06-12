import React, { useState } from 'react';
import { StepCard } from '../StepCard';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { usePropertyAnalysis } from '../../context/PropertyAnalysisContext';
import { LinkIcon } from 'lucide-react';
interface PropertyDetailsProps {
  onNext: () => void;
}
export const PropertyDetails = ({
  onNext
}: PropertyDetailsProps) => {
  const {
    propertyDetails,
    updatePropertyDetails
  } = usePropertyAnalysis();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!propertyDetails.propertyUrl) {
      newErrors.propertyUrl = 'Property URL is required';
    }
    if (propertyDetails.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };
  return <StepCard title="Property details" subtitle="Let's start with basic information about the property" onNext={handleSubmit}>
      <div className="space-y-4">
        <div className="relative">
          <Input label="Property URL" type="url" placeholder="https://www.zillow.com/homedetails/..." value={propertyDetails.propertyUrl} onChange={e => updatePropertyDetails({
          propertyUrl: e.target.value
        })} error={errors.propertyUrl} helpText="Paste a Zillow, Redfin, or Realtor.com listing URL" />
          {propertyDetails.propertyUrl && <div className="absolute right-2 top-9">
              <a href="#" className="flex items-center text-blue-600 text-sm" onClick={e => {
            e.preventDefault();
            // In a real app, this would fetch property data from the URL
            updatePropertyDetails({
              address: '123 Main St, Anytown, USA',
              price: 350000,
              beds: 3,
              baths: 2,
              sqft: 1800
            });
          }}>
                <LinkIcon className="h-4 w-4 mr-1" />
                Fetch data
              </a>
            </div>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Property address" type="text" placeholder="123 Main St, Anytown, USA" value={propertyDetails.address} onChange={e => updatePropertyDetails({
          address: e.target.value
        })} />
          <Input label="Purchase price" type="number" prefix="$" placeholder="350000" value={propertyDetails.price || ''} onChange={e => updatePropertyDetails({
          price: parseFloat(e.target.value) || 0
        })} error={errors.price} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Input label="Beds" type="number" placeholder="3" value={propertyDetails.beds || ''} onChange={e => updatePropertyDetails({
          beds: parseInt(e.target.value) || 0
        })} />
          <Input label="Baths" type="number" placeholder="2" value={propertyDetails.baths || ''} onChange={e => updatePropertyDetails({
          baths: parseFloat(e.target.value) || 0
        })} />
          <Input label="Square feet" type="number" placeholder="1500" value={propertyDetails.sqft || ''} onChange={e => updatePropertyDetails({
          sqft: parseInt(e.target.value) || 0
        })} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Select label="Investment strategy" options={[{
          value: 'buy_and_hold',
          label: 'Buy and hold'
        }, {
          value: 'fix_and_flip',
          label: 'Fix and flip'
        }, {
          value: 'brrrr',
          label: 'BRRRR (Buy, Rehab, Rent, Refinance, Repeat)'
        }]} value={propertyDetails.investmentStrategy} onChange={e => updatePropertyDetails({
          investmentStrategy: e.target.value
        })} helpText="Select the strategy you plan to use for this property" />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Primary investment goal
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" className={`px-4 py-3 border rounded-md transition-colors ${propertyDetails.investmentGoal === 'cash_flow' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`} onClick={() => updatePropertyDetails({
              investmentGoal: 'cash_flow'
            })}>
                <div className="text-sm font-medium">Cash flow</div>
                <div className="text-xs text-gray-500 mt-1">
                  Optimize for monthly income
                </div>
              </button>
              <button type="button" className={`px-4 py-3 border rounded-md transition-colors ${propertyDetails.investmentGoal === 'appreciation' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`} onClick={() => updatePropertyDetails({
              investmentGoal: 'appreciation'
            })}>
                <div className="text-sm font-medium">Appreciation</div>
                <div className="text-xs text-gray-500 mt-1">
                  Optimize for long-term growth
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </StepCard>;
};