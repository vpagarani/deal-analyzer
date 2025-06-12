import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { PropertyAnalysisProvider } from './context/PropertyAnalysisContext';
import { PropertyDetails } from './components/steps/PropertyDetails';
import { IncomeInputs } from './components/steps/IncomeInputs';
import { ExpenseInputs } from './components/steps/ExpenseInputs';
import { FinancingTerms } from './components/steps/FinancingTerms';
import { GrowthAssumptions } from './components/steps/GrowthAssumptions';
import { ResultsDashboard } from './components/steps/ResultsDashboard';
import { Stepper } from './components/Stepper';
export function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [{
    id: 1,
    title: 'Property Details'
  }, {
    id: 2,
    title: 'Income Inputs'
  }, {
    id: 3,
    title: 'Expense Inputs'
  }, {
    id: 4,
    title: 'Financing Terms'
  }, {
    id: 5,
    title: 'Growth Assumptions'
  }, {
    id: 6,
    title: 'Results'
  }];
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PropertyDetails onNext={() => setCurrentStep(2)} />;
      case 2:
        return <IncomeInputs onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />;
      case 3:
        return <ExpenseInputs onNext={() => setCurrentStep(4)} onBack={() => setCurrentStep(2)} />;
      case 4:
        return <FinancingTerms onNext={() => setCurrentStep(5)} onBack={() => setCurrentStep(3)} />;
      case 5:
        return <GrowthAssumptions onNext={() => setCurrentStep(6)} onBack={() => setCurrentStep(4)} />;
      case 6:
        return <ResultsDashboard onBack={() => setCurrentStep(5)} />;
      default:
        return <PropertyDetails onNext={() => setCurrentStep(2)} />;
    }
  };
  return <PropertyAnalysisProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">
          <Stepper steps={steps} currentStep={currentStep} onStepClick={step => setCurrentStep(step)} />
          <div className="mt-8 transition-all duration-300">{renderStep()}</div>
        </main>
      </div>
    </PropertyAnalysisProvider>;
}