import React from 'react';
import { StepCard } from '../StepCard';
import { Input } from '../ui/Input';
import { Slider } from '../ui/Slider';
import { Select } from '../ui/Select';
import { usePropertyAnalysis } from '../../context/PropertyAnalysisContext';
interface FinancingTermsProps {
  onNext: () => void;
  onBack: () => void;
}
export const FinancingTerms = ({
  onNext,
  onBack
}: FinancingTermsProps) => {
  const {
    financingDetails,
    updateFinancingDetails,
    propertyDetails
  } = usePropertyAnalysis();
  // Calculate loan amount
  const loanAmount = propertyDetails.price * (1 - financingDetails.downPayment / 100);
  // Calculate down payment amount
  const downPaymentAmount = propertyDetails.price * (financingDetails.downPayment / 100);
  // Calculate closing costs
  const closingCostsAmount = propertyDetails.price * (financingDetails.closingCosts / 100);
  // Calculate total cash to close
  const totalCashToClose = downPaymentAmount + closingCostsAmount + financingDetails.rehabCosts;
  // Calculate monthly mortgage payment
  const calculateMortgagePayment = () => {
    const r = financingDetails.interestRate / 100 / 12; // Monthly interest rate
    const n = financingDetails.loanTerm * 12; // Total number of payments
    if (r === 0) return loanAmount / n;
    const payment = loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return payment;
  };
  const monthlyPayment = calculateMortgagePayment();
  return <StepCard title="Financing terms" subtitle="Enter the financing details for this property" onNext={onNext} onBack={onBack}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Slider label="Down payment" min={0} max={100} step={1} value={financingDetails.downPayment} onChange={value => updateFinancingDetails({
          downPayment: value
        })} suffix="%" helpText="Percentage of purchase price paid upfront" />
          <div className="flex items-end">
            <div className="text-sm text-gray-600 mb-4">
              $
              {downPaymentAmount.toLocaleString('en-US', {
              maximumFractionDigits: 0
            })}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Slider label="Interest rate" min={1} max={12} step={0.125} value={financingDetails.interestRate} onChange={value => updateFinancingDetails({
          interestRate: value
        })} suffix="%" helpText="Annual interest rate for the mortgage" />
          <Select label="Loan term" options={[{
          value: '15',
          label: '15 years'
        }, {
          value: '20',
          label: '20 years'
        }, {
          value: '30',
          label: '30 years'
        }]} value={financingDetails.loanTerm.toString()} onChange={e => updateFinancingDetails({
          loanTerm: parseInt(e.target.value)
        })} helpText="Length of the mortgage loan" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Closing costs" type="number" suffix="% of purchase" placeholder="3" value={financingDetails.closingCosts} onChange={e => updateFinancingDetails({
          closingCosts: parseFloat(e.target.value) || 0
        })} helpText="Typically 2-5% of purchase price" />
          <div className="flex items-end">
            <div className="text-sm text-gray-600 mb-4">
              $
              {closingCostsAmount.toLocaleString('en-US', {
              maximumFractionDigits: 0
            })}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Rehab costs" type="number" prefix="$" placeholder="0" value={financingDetails.rehabCosts || ''} onChange={e => updateFinancingDetails({
          rehabCosts: parseFloat(e.target.value) || 0
        })} helpText="Estimated renovation or repair costs" />
        </div>
        <div className="bg-gray-50 p-4 rounded-md space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Loan amount:</span>
            <span className="font-mono">
              $
              {loanAmount.toLocaleString('en-US', {
              maximumFractionDigits: 0
            })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Monthly payment:</span>
            <span className="text-lg font-mono font-medium">
              $
              {monthlyPayment.toLocaleString('en-US', {
              maximumFractionDigits: 0
            })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Total cash to close:</span>
            <span className="text-lg font-mono font-medium">
              $
              {totalCashToClose.toLocaleString('en-US', {
              maximumFractionDigits: 0
            })}
            </span>
          </div>
        </div>
        <div className="flex justify-center">
          <button type="button" className="text-sm text-blue-600 hover:text-blue-800" onClick={() => {
          // In a real app, this would open an amortization schedule modal
          alert('Amortization schedule would open here');
        }}>
            View amortization schedule
          </button>
        </div>
      </div>
    </StepCard>;
};