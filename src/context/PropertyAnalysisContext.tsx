import React, { useState, createContext, useContext } from 'react';
interface PropertyDetails {
  propertyUrl: string;
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  investmentStrategy: string;
  investmentGoal: string;
}
interface RentUnit {
  id: string;
  description: string;
  amount: number;
  hasTenant: boolean;
}
interface IncomeDetails {
  rentUnits: RentUnit[];
  vacancyRate: number;
  otherIncome: number;
  tenantPlacementFee: number;
}
interface ExpenseDetails {
  propertyTax: number;
  insurance: number;
  hoa: number;
  maintenanceLevel: 'low' | 'medium' | 'high';
  capExLevel: 'low' | 'medium' | 'high';
  propertyManagement: number;
  utilities: number;
}
interface FinancingDetails {
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  closingCosts: number;
  rehabCosts: number;
}
interface GrowthAssumptions {
  rentGrowth: number;
  expenseGrowth: number;
  propertyAppreciation: number;
  holdingPeriod: number;
}
interface PropertyAnalysisContextType {
  propertyDetails: PropertyDetails;
  incomeDetails: IncomeDetails;
  expenseDetails: ExpenseDetails;
  financingDetails: FinancingDetails;
  growthAssumptions: GrowthAssumptions;
  updatePropertyDetails: (details: Partial<PropertyDetails>) => void;
  updateIncomeDetails: (details: Partial<IncomeDetails>) => void;
  updateExpenseDetails: (details: Partial<ExpenseDetails>) => void;
  updateFinancingDetails: (details: Partial<FinancingDetails>) => void;
  updateGrowthAssumptions: (details: Partial<GrowthAssumptions>) => void;
}
const defaultPropertyDetails: PropertyDetails = {
  propertyUrl: '',
  address: '',
  price: 0,
  beds: 0,
  baths: 0,
  sqft: 0,
  investmentStrategy: 'buy_and_hold',
  investmentGoal: 'cash_flow'
};
const defaultIncomeDetails: IncomeDetails = {
  rentUnits: [{
    id: '1',
    description: 'Main unit',
    amount: 0,
    hasTenant: false
  }],
  vacancyRate: 5,
  otherIncome: 0,
  tenantPlacementFee: 0
};
const defaultExpenseDetails: ExpenseDetails = {
  propertyTax: 0,
  insurance: 0,
  hoa: 0,
  maintenanceLevel: 'medium',
  capExLevel: 'medium',
  propertyManagement: 8,
  utilities: 0
};
const defaultFinancingDetails: FinancingDetails = {
  downPayment: 20,
  interestRate: 7,
  loanTerm: 30,
  closingCosts: 3,
  rehabCosts: 0
};
const defaultGrowthAssumptions: GrowthAssumptions = {
  rentGrowth: 2,
  expenseGrowth: 2,
  propertyAppreciation: 3,
  holdingPeriod: 5
};
const PropertyAnalysisContext = createContext<PropertyAnalysisContextType | undefined>(undefined);
export const PropertyAnalysisProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails>(defaultPropertyDetails);
  const [incomeDetails, setIncomeDetails] = useState<IncomeDetails>(defaultIncomeDetails);
  const [expenseDetails, setExpenseDetails] = useState<ExpenseDetails>(defaultExpenseDetails);
  const [financingDetails, setFinancingDetails] = useState<FinancingDetails>(defaultFinancingDetails);
  const [growthAssumptions, setGrowthAssumptions] = useState<GrowthAssumptions>(defaultGrowthAssumptions);
  const updatePropertyDetails = (details: Partial<PropertyDetails>) => {
    setPropertyDetails(prev => ({
      ...prev,
      ...details
    }));
  };
  const updateIncomeDetails = (details: Partial<IncomeDetails>) => {
    setIncomeDetails(prev => ({
      ...prev,
      ...details
    }));
  };
  const updateExpenseDetails = (details: Partial<ExpenseDetails>) => {
    setExpenseDetails(prev => ({
      ...prev,
      ...details
    }));
  };
  const updateFinancingDetails = (details: Partial<FinancingDetails>) => {
    setFinancingDetails(prev => ({
      ...prev,
      ...details
    }));
  };
  const updateGrowthAssumptions = (details: Partial<GrowthAssumptions>) => {
    setGrowthAssumptions(prev => ({
      ...prev,
      ...details
    }));
  };
  return <PropertyAnalysisContext.Provider value={{
    propertyDetails,
    incomeDetails,
    expenseDetails,
    financingDetails,
    growthAssumptions,
    updatePropertyDetails,
    updateIncomeDetails,
    updateExpenseDetails,
    updateFinancingDetails,
    updateGrowthAssumptions
  }}>
      {children}
    </PropertyAnalysisContext.Provider>;
};
export const usePropertyAnalysis = () => {
  const context = useContext(PropertyAnalysisContext);
  if (context === undefined) {
    throw new Error('usePropertyAnalysis must be used within a PropertyAnalysisProvider');
  }
  return context;
};