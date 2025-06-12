import React from 'react';
import { Tooltip } from '../ui/Tooltip';
import { InfoIcon } from 'lucide-react';
interface MonthlyCashFlowCardProps {
  monthlyNOI: number;
  monthlyMortgage: number;
}
export const MonthlyCashFlowCard = ({
  monthlyNOI,
  monthlyMortgage
}: MonthlyCashFlowCardProps) => {
  const monthlyCashFlow = monthlyNOI - monthlyMortgage;
  return <div className="border border-gray-200 rounded-md">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h3 className="text-lg font-medium text-gray-800">
              Monthly cash flow
            </h3>
            <div className="ml-2">
              <Tooltip text="Monthly cash flow = Net Operating Income - Mortgage Payment">
                <InfoIcon className="h-4 w-4 text-gray-400" />
              </Tooltip>
            </div>
          </div>
          <div className={`text-xl font-mono font-medium ${monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${Math.round(monthlyCashFlow).toLocaleString()}
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-gray-600">Monthly income</div>
          <div className="font-mono text-gray-800">
            ${Math.round(monthlyNOI).toLocaleString()}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-gray-600">Monthly mortgage</div>
          <div className="font-mono text-gray-800">
            -${Math.round(monthlyMortgage).toLocaleString()}
          </div>
        </div>
        <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between items-center">
          <div className="font-medium text-gray-700">Net cash flow</div>
          <div className={`font-mono font-medium ${monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${Math.round(monthlyCashFlow).toLocaleString()}
          </div>
        </div>
      </div>
    </div>;
};