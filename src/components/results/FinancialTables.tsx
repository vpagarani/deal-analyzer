import React, { useState } from 'react';
import { Tooltip } from '../ui/Tooltip';
import { InfoIcon } from 'lucide-react';
interface Metrics {
  purchasePrice: number;
  totalInvestment: number;
  netOperatingIncome: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  cashOnCashReturn: number;
  capRate: number;
  downPayment: number;
  [key: string]: number;
}
interface GrowthAssumptions {
  rentGrowth: number;
  expenseGrowth: number;
  propertyAppreciation: number;
  holdingPeriod: number;
}
interface FinancialTablesProps {
  metrics: Metrics;
  growthAssumptions: GrowthAssumptions;
}
export const FinancialTables = ({
  metrics,
  growthAssumptions
}: FinancialTablesProps) => {
  const [activeTab, setActiveTab] = useState('irr');
  // Update the generateProjections function
  const generateProjections = () => {
    const years = Math.min(growthAssumptions.holdingPeriod, 10);
    const projections = [];
    let currentNOI = metrics.netOperatingIncome;
    let currentPropertyValue = metrics.purchasePrice;
    let remainingLoanBalance = metrics.purchasePrice * (1 - metrics.downPayment / 100);
    const monthlyMortgage = metrics.monthlyCashFlow + currentNOI / 12;
    const annualMortgage = monthlyMortgage * 12;
    const interestRate = remainingLoanBalance > 0 ? (annualMortgage - (metrics.annualCashFlow + currentNOI)) / remainingLoanBalance : 0;
    for (let year = 1; year <= years; year++) {
      // Calculate principal paydown
      const annualInterest = remainingLoanBalance * interestRate;
      const principalPaydown = annualMortgage - annualInterest;
      remainingLoanBalance -= principalPaydown;
      // Apply growth rates to NOI and property value
      currentNOI *= 1 + (growthAssumptions.rentGrowth - growthAssumptions.expenseGrowth) / 100;
      currentPropertyValue *= 1 + growthAssumptions.propertyAppreciation / 100;
      // Calculate cash flow (NOI minus debt service)
      const cashFlow = currentNOI - annualMortgage;
      // Calculate appreciation (cumulative)
      const appreciation = currentPropertyValue - metrics.purchasePrice;
      // Calculate total return for the year
      const totalReturn = cashFlow + principalPaydown + appreciation;
      // Calculate IRR
      const irrEstimate = calculateYearIRR(metrics.totalInvestment, cashFlow, principalPaydown, appreciation, year, currentPropertyValue, remainingLoanBalance);
      // Calculate cash-on-cash return
      const cashOnCash = cashFlow / metrics.totalInvestment * 100;
      projections.push({
        year,
        noi: currentNOI,
        propertyValue: currentPropertyValue,
        cashFlow,
        principalPaydown,
        appreciation,
        totalReturn,
        irrEstimate,
        cashOnCash
      });
    }
    return projections;
  };
  const projections = generateProjections();
  return <div>
      <div className="border-b border-gray-200 mb-4">
        <div className="flex space-x-6">
          <button className={`py-2 px-1 border-b-2 text-sm font-medium ${activeTab === 'irr' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('irr')}>
            IRR & Equity
          </button>
          <button className={`py-2 px-1 border-b-2 text-sm font-medium ${activeTab === 'coc' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('coc')}>
            Cash-on-Cash Return
          </button>
        </div>
      </div>
      {activeTab === 'irr' && <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-end">
                    Cash flow
                    <Tooltip text="Annual net cash flow after all expenses and mortgage">
                      <InfoIcon className="h-3 w-3 ml-1 text-gray-400" />
                    </Tooltip>
                  </div>
                </th>
                <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-end">
                    Principal paydown
                    <Tooltip text="Equity gained from paying down the mortgage principal">
                      <InfoIcon className="h-3 w-3 ml-1 text-gray-400" />
                    </Tooltip>
                  </div>
                </th>
                <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-end">
                    Appreciation
                    <Tooltip text="Increase in property value based on appreciation rate">
                      <InfoIcon className="h-3 w-3 ml-1 text-gray-400" />
                    </Tooltip>
                  </div>
                </th>
                <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-end">
                    Total return
                    <Tooltip text="Sum of cash flow, principal paydown, and appreciation">
                      <InfoIcon className="h-3 w-3 ml-1 text-gray-400" />
                    </Tooltip>
                  </div>
                </th>
                <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-end">
                    IRR (est.)
                    <Tooltip text="Estimated Internal Rate of Return, simplified calculation">
                      <InfoIcon className="h-3 w-3 ml-1 text-gray-400" />
                    </Tooltip>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projections.map(projection => <tr key={projection.year}>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    Year {projection.year}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-mono">
                    ${Math.round(projection.cashFlow).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-mono">
                    ${Math.round(projection.principalPaydown).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-mono">
                    $
                    {Math.round(projection.appreciation / projection.year).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-mono font-medium">
                    ${Math.round(projection.totalReturn).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-mono font-medium">
                    {projection.irrEstimate.toFixed(2)}%
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>}
      {activeTab === 'coc' && <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-end">
                    NOI
                    <Tooltip text="Net Operating Income (before mortgage payment)">
                      <InfoIcon className="h-3 w-3 ml-1 text-gray-400" />
                    </Tooltip>
                  </div>
                </th>
                <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Annual cash flow
                </th>
                <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-end">
                    Cash-on-cash
                    <Tooltip text="Annual cash flow divided by total cash invested">
                      <InfoIcon className="h-3 w-3 ml-1 text-gray-400" />
                    </Tooltip>
                  </div>
                </th>
                <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-end">
                    Property value
                    <Tooltip text="Projected property value based on appreciation rate">
                      <InfoIcon className="h-3 w-3 ml-1 text-gray-400" />
                    </Tooltip>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projections.map(projection => <tr key={projection.year}>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    Year {projection.year}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-mono">
                    ${Math.round(projection.noi).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-mono">
                    ${Math.round(projection.cashFlow).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-mono font-medium">
                    {projection.cashOnCash.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-mono">
                    ${Math.round(projection.propertyValue).toLocaleString()}
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>}
    </div>;
};
function calculateYearIRR(initialInvestment: number, cashFlow: number, principalPaydown: number, appreciation: number, year: number, currentPropertyValue: number, remainingLoanBalance: number): number {
  // For final year, include property sale proceeds
  const totalValue = currentPropertyValue - remainingLoanBalance;
  const totalReturn = cashFlow + (year === 5 ? totalValue - initialInvestment : 0);
  // Calculate IRR using time value of money formula
  const irr = Math.pow(totalReturn / initialInvestment + 1, 1 / year) - 1;
  return Math.min(Math.max(irr * 100, 0), 50); // Convert to percentage and cap between 0-50%
}