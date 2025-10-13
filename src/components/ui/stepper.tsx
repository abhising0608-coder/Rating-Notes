'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  label: string;
  description?: string;
  isCompleted?: boolean;
  isOptional?: boolean;
}

interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  initialStep?: number;
  activeStep: number;
  steps: Step[];
}

const StepperContext = React.createContext<{
  activeStep: number;
  steps: Step[];
}>({
  activeStep: 0,
  steps: [],
});

const useStepper = () => React.useContext(StepperContext);

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ className, children, initialStep = 0, activeStep, steps, ...props }, ref) => {
    const contextValue = React.useMemo(() => ({ activeStep, steps }), [activeStep, steps]);

    return (
      <StepperContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn('flex items-center justify-between p-4', className)}
          {...props}
        >
          {children}
        </div>
      </StepperContext.Provider>
    );
  }
);
Stepper.displayName = 'Stepper';

const Step = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { label: string, index?: number }
>(({ className, label, ...props }, ref) => {
    const { activeStep, steps } = useStepper();
    const index = React.Children.toArray(props.children).findIndex(c => (c as React.ReactElement).props.label === label);
    const currentIndex = props.index ?? index;

    const isCompleted = currentIndex < activeStep;
    const isActive = currentIndex === activeStep;

  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-2', className, {
        'text-primary': isActive,
        'text-muted-foreground': !isActive && !isCompleted,
        'text-green-600': isCompleted
      })}
      {...props}
    >
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full border-2 font-semibold',
          {
            'border-primary text-primary': isActive,
            'border-gray-300': !isActive && !isCompleted,
            'border-green-600 bg-green-600 text-white': isCompleted,
          }
        )}
      >
        {isCompleted ? <Check className="h-5 w-5" /> : currentIndex + 1}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
});
Step.displayName = 'Step';


export { Stepper, Step, useStepper };
