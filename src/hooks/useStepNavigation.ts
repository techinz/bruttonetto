import { useState } from 'react';
import type { CalculationStep, StepNavigationHook } from '../types/hooks/useStepNavigation';


export const useStepNavigation = (): StepNavigationHook => {
  const [currentStep, setCurrentStep] = useState<CalculationStep>('brutto');

  const goToNextStep = () => {
    switch (currentStep) {
      case 'brutto':
        setCurrentStep('social');
        break;
      case 'social':
        setCurrentStep('deductions');
        break;
      case 'deductions':
        setCurrentStep('results');
        break;
      default:
        break;
    }
  };

  const goToPreviousStep = () => {
    switch (currentStep) {
      case 'social':
        setCurrentStep('brutto');
        break;
      case 'deductions':
        setCurrentStep('social');
        break;
      case 'results':
        setCurrentStep('deductions');
        break;
      default:
        break;
    }
  };

  const goToStep = (step: CalculationStep) => {
    setCurrentStep(step);
  };

  return {
    currentStep,
    goToNextStep,
    goToPreviousStep,
    goToStep
  };
};