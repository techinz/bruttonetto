export type CalculationStep = 'brutto' | 'social' | 'deductions' | 'results';

export interface StepNavigationHook {
    currentStep: CalculationStep;
    goToNextStep: () => void;
    goToPreviousStep: () => void;
    goToStep: (step: CalculationStep) => void;
}
