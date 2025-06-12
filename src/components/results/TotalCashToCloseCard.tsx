import React from 'react';
interface TotalCashToCloseCardProps {
  downPayment: number;
  closingCosts: number;
  rehabCosts: number;
}
export const TotalCashToCloseCard = ({
  downPayment,
  closingCosts,
  rehabCosts
}: TotalCashToCloseCardProps) => {
  const totalCashToClose = downPayment + closingCosts + rehabCosts;
  return <div className="border border-gray-200 rounded-md">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-800">
          Total cash to close
        </h3>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-gray-600">Down payment</div>
          <div className="font-mono text-gray-800">
            ${Math.round(downPayment).toLocaleString()}
          </div>
        </div>
        <div className="flex justify-between items-center mb-2">
          <div className="text-gray-600">Closing costs</div>
          <div className="font-mono text-gray-800">
            ${Math.round(closingCosts).toLocaleString()}
          </div>
        </div>
        {rehabCosts > 0 && <div className="flex justify-between items-center mb-2">
            <div className="text-gray-600">Rehab costs</div>
            <div className="font-mono text-gray-800">
              ${Math.round(rehabCosts).toLocaleString()}
            </div>
          </div>}
        <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between items-center">
          <div className="font-medium text-gray-700">Total cash required</div>
          <div className="font-mono font-medium text-gray-900">
            ${Math.round(totalCashToClose).toLocaleString()}
          </div>
        </div>
      </div>
    </div>;
};