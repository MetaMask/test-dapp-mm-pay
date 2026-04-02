import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

type StepProgressProps = {
  currentStep: number;
  isComplete: boolean;
  actionName: string;
};

function stepRowTextClass(isDone: boolean, isActive: boolean): string {
  if (isDone) {
    return 'text-green-400';
  }
  if (isActive) {
    return 'text-orange-400';
  }
  return 'text-pay-fg-section';
}

function StepRowIcon({
  isDone,
  isActive,
}: {
  isDone: boolean;
  isActive: boolean;
}) {
  if (isDone) {
    return <CheckCircle2 className="h-5 w-5 text-green-400" />;
  }
  if (isActive) {
    return <Loader2 className="h-5 w-5 animate-spin text-orange-400" />;
  }
  return <Circle className="h-5 w-5 text-pay-border-strong" />;
}

function getSteps(actionName: string) {
  return [
    'User selecting token',
    'Transaction submitted',
    'Orchestration in progress',
    `${actionName} funded`,
  ];
}

export function StepProgress({
  currentStep,
  isComplete,
  actionName,
}: StepProgressProps) {
  const steps = getSteps(actionName);

  return (
    <AnimatePresence mode="wait">
      {currentStep > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3 overflow-hidden"
        >
          {steps.map((step, index) => {
            const isActive = currentStep === index + 1;
            const isDone =
              currentStep > index + 1 ||
              (isComplete && index === steps.length - 1);

            return (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="flex-shrink-0">
                  <StepRowIcon isDone={isDone} isActive={isActive} />
                </div>
                <span
                  className={`text-sm ${stepRowTextClass(isDone, isActive)}`}
                >
                  {step}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
