import WizardProgress from "@/features/leads/components/WizardProgress";
import StepCategory from "@/features/leads/components/StepCategory";
import StepService from "@/features/leads/components/StepService";
import StepDetails from "@/features/leads/components/StepDetails";
import { Card } from "@/shared/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import type { WizardState, Category, WizardDetails } from "@/types/wizard";

interface WizardUIProps {
  step: number;
  direction: number;
  wizard: {
    state: WizardState;
    setCategory: (category: Category) => void;
    setService: (service: string) => void;
    setDetails: (details: Partial<WizardDetails>) => void;
    reset: () => void;
  };
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
  onStepClick: (step: number) => void;
  isSubmitting: boolean;
}

export default function WizardUI({
  step,
  direction,
  wizard,
  onNext,
  onBack,
  onSubmit,
  onStepClick,
  isSubmitting
}: WizardUIProps) {
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  return (
    <div className="max-w-4xl mx-auto">
      <WizardProgress step={step} onStepClick={onStepClick} />

      <div className="relative mt-4 sm:mt-8">
        <Card className="p-4 sm:p-6 lg:p-12 border border-border/50 shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden min-h-[400px] sm:min-h-[500px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="h-full"
            >
              {step === 0 && <StepCategory wizard={wizard} onNext={onNext} />}
              {step === 1 && (
                <StepService wizard={wizard} onNext={onNext} onBack={onBack} />
              )}
              {step === 2 && (
                <StepDetails
                  wizard={wizard}
                  onBack={onBack}
                  onSubmit={onSubmit}
                  isSubmitting={isSubmitting}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}
