import React from 'react';
import { StepCard } from '../StepCard';
import { usePropertyAnalysis } from '../../context/PropertyAnalysisContext';
import { PrinterIcon, DownloadIcon, ArrowLeftIcon } from 'lucide-react';
import { MonthlyCashFlowCard } from '../results/MonthlyCashFlowCard';
import { TotalCashToCloseCard } from '../results/TotalCashToCloseCard';
import { FinancialTables } from '../results/FinancialTables';
interface ResultsDashboardProps {
  onBack: () => void;
}
export const ResultsDashboard = ({
  onBack
}: ResultsDashboardProps) => {
  const {
    propertyDetails,
    incomeDetails,
    expenseDetails,
    financingDetails,
    growthAssumptions
  } = usePropertyAnalysis();
  // Calculate key metrics
  const calculateMetrics = () => {
    // Purchase price
    const purchasePrice = propertyDetails.price;
    // Loan amount
    const loanAmount = purchasePrice * (1 - financingDetails.downPayment / 100);
    // Down payment
    const downPayment = purchasePrice * (financingDetails.downPayment / 100);
    // Closing costs
    const closingCosts = purchasePrice * (financingDetails.closingCosts / 100);
    // Total cash invested
    const totalInvestment = downPayment + closingCosts + financingDetails.rehabCosts;
    // Annual rental income
    const annualRentalIncome = incomeDetails.monthlyRent * 12;
    // Effective gross income (after vacancy)
    const effectiveGrossIncome = annualRentalIncome * (1 - incomeDetails.vacancyRate / 100) + incomeDetails.otherIncome * 12;
    // Annual operating expenses
    const annualOperatingExpenses = expenseDetails.propertyTax + expenseDetails.insurance + expenseDetails.hoa * 12 + annualRentalIncome * expenseDetails.maintenance / 100 + annualRentalIncome * expenseDetails.capEx / 100 + annualRentalIncome * expenseDetails.propertyManagement / 100 + expenseDetails.utilities * 12;
    // Net operating income
    const netOperatingIncome = effectiveGrossIncome - annualOperatingExpenses;
    // Monthly NOI
    const monthlyNOI = netOperatingIncome / 12;
    // Monthly mortgage payment
    const monthlyMortgage = calculateMortgagePayment(loanAmount, financingDetails.interestRate, financingDetails.loanTerm);
    // Monthly cash flow
    const monthlyCashFlow = monthlyNOI - monthlyMortgage;
    // Annual cash flow
    const annualCashFlow = monthlyCashFlow * 12;
    // Cash on cash return
    const cashOnCashReturn = annualCashFlow / totalInvestment * 100;
    // Cap rate
    const capRate = netOperatingIncome / purchasePrice * 100;
    return {
      purchasePrice,
      loanAmount,
      downPayment,
      closingCosts,
      totalInvestment,
      annualRentalIncome,
      effectiveGrossIncome,
      annualOperatingExpenses,
      netOperatingIncome,
      monthlyNOI,
      monthlyMortgage,
      monthlyCashFlow,
      annualCashFlow,
      cashOnCashReturn,
      capRate
    };
  };
  const metrics = calculateMetrics();
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-800">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to assumptions
        </button>
        <div className="flex space-x-3">
          <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
            <PrinterIcon className="h-4 w-4 mr-2" />
            Print
          </button>
          <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-medium text-gray-800">Analysis summary</h2>
        <p className="text-gray-500 mt-1">{propertyDetails.address}</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Key metrics */}
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-sm font-medium text-gray-600 mb-2">
              Cash on cash return
            </div>
            <div className={`text-2xl font-mono font-medium ${metrics.cashOnCashReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.cashOnCashReturn.toFixed(2)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">Year 1 return</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-sm font-medium text-gray-600 mb-2">
              Cap rate
            </div>
            <div className={`text-2xl font-mono font-medium ${metrics.capRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.capRate.toFixed(2)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              NOI / Purchase price
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-sm font-medium text-gray-600 mb-2">
              Monthly cash flow
            </div>
            <div className={`text-2xl font-mono font-medium ${metrics.monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.round(metrics.monthlyCashFlow).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">After all expenses</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-sm font-medium text-gray-600 mb-2">
              5-Year IRR
            </div>
            <div className="text-2xl font-mono font-medium text-blue-600">
              {calculateIRR(metrics, growthAssumptions).toFixed(2)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Estimated return rate
            </div>
          </div>
        </div>
        <div className="mt-6">
          <MonthlyCashFlowCard monthlyNOI={metrics.monthlyNOI} monthlyMortgage={metrics.monthlyMortgage} />
        </div>
        <div className="mt-6">
          <TotalCashToCloseCard downPayment={metrics.downPayment} closingCosts={metrics.closingCosts} rehabCosts={financingDetails.rehabCosts} />
        </div>
        <div className="mt-8">
          <FinancialTables metrics={metrics} growthAssumptions={growthAssumptions} />
        </div>
      </div>
    </div>;
};
// Helper function to calculate mortgage payment
function calculateMortgagePayment(loanAmount: number, interestRate: number, loanTerm: number): number {
  const r = interestRate / 100 / 12; // Monthly interest rate
  const n = loanTerm * 12; // Total number of payments
  if (r === 0) return loanAmount / n;
  const payment = loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return payment;
}
// Add this function at the bottom of the file
function calculateIRR(metrics: any, growthAssumptions: any): number {
  const years = 5;
  const initialInvestment = -metrics.totalInvestment;
  const monthlyMortgage = metrics.monthlyMortgage;
  // Calculate future cash flows
  const cashFlows = [initialInvestment];
  let propertyValue = metrics.purchasePrice;
  let annualNOI = metrics.netOperatingIncome;
  let remainingLoanBalance = metrics.loanAmount;
  for (let year = 1; year <= years; year++) {
    // Compound NOI by rent growth (adjusted for expense growth)
    annualNOI *= 1 + (growthAssumptions.rentGrowth - growthAssumptions.expenseGrowth) / 100;
    // Compound property value
    propertyValue *= 1 + growthAssumptions.propertyAppreciation / 100;
    // Calculate principal portion of mortgage payments
    const annualMortgage = monthlyMortgage * 12;
    const annualInterest = remainingLoanBalance * (metrics.interestRate / 100);
    const principalPaydown = annualMortgage - annualInterest;
    remainingLoanBalance -= principalPaydown;
    // For each year, add operational cash flow
    let yearCashFlow = annualNOI - annualMortgage;
    // For the final year, add property sale proceeds
    if (year === years) {
      yearCashFlow += propertyValue - remainingLoanBalance;
    }
    cashFlows.push(yearCashFlow);
  }
  // Calculate IRR using Newton's method
  const irr = calculateIRRRate(cashFlows);
  return Math.min(Math.max(irr * 100, 0), 100); // Convert to percentage and cap between 0-100%
}
// Add helper function for IRR calculation
function calculateIRRRate(cashFlows: number[]): number {
  const maxIterations = 100;
  const tolerance = 0.0001;
  let guess = 0.1; // Initial guess at 10%
  for (let i = 0; i < maxIterations; i++) {
    const npv = cashFlows.reduce((acc, cf, t) => acc + cf / Math.pow(1 + guess, t), 0);
    if (Math.abs(npv) < tolerance) break;
    const derivativeNPV = cashFlows.reduce((acc, cf, t) => acc - t * cf / Math.pow(1 + guess, t + 1), 0);
    const nextGuess = guess - npv / derivativeNPV;
    if (Math.abs(nextGuess - guess) < tolerance) {
      guess = nextGuess;
      break;
    }
    guess = nextGuess;
  }
  return guess;
}