import React, { Fragment } from 'react';
import { CheckIcon } from 'lucide-react';
interface Step {
  id: number;
  title: string;
}
interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
}
export const Stepper = ({
  steps,
  currentStep,
  onStepClick
}: StepperProps) => {
  return <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;
        return <Fragment key={step.id}>
              {/* Step circle */}
              <button onClick={() => isCompleted ? onStepClick(step.id) : null} className={`
                  flex items-center justify-center w-8 h-8 rounded-full transition-all
                  ${isCompleted ? 'bg-blue-600 cursor-pointer' : isCurrent ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-gray-200'}
                `}>
                {isCompleted ? <CheckIcon className="h-5 w-5 text-white" /> : <span className={`text-sm font-medium ${isCurrent ? 'text-white' : 'text-gray-600'}`}>
                    {step.id}
                  </span>}
              </button>
              {/* Connector line */}
              {index < steps.length - 1 && <div className="flex-1 mx-2">
                  <div className={`h-1 ${index < currentStep - 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                </div>}
            </Fragment>;
      })}
      </div>
      {/* Step labels */}
      <div className="flex items-center justify-between mt-2">
        {steps.map(step => <div key={`label-${step.id}`} className={`text-xs font-medium text-center ${step.id === currentStep ? 'text-blue-600' : 'text-gray-500'}`} style={{
        width: `${100 / steps.length}%`
      }}>
            {step.title}
          </div>)}
      </div>
    </div>;
};