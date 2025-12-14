import { Check } from "lucide-react";

interface WizardProgressProps {
  step: number;
  onStepClick: (step: number) => void;
}

export default function WizardProgress({ step, onStepClick }: WizardProgressProps) {
  const steps = [
    { id: 0, title: "Category" },
    { id: 1, title: "Service" },
    { id: 2, title: "Details" },
  ];

  return (
    <div className="flex items-center justify-between relative w-full mb-4 sm:mb-8">
      {/* Progress line - centered with the circles */}
      <div className="absolute left-0 right-0 top-4 sm:top-5 h-0.5 bg-muted -z-10 mx-4" />

      {steps.map((s) => {
        const isActive = step === s.id;
        const isCompleted = step > s.id;

        return (
          <button
            key={s.id}
            onClick={() => isCompleted && onStepClick(s.id)} // Only allow clicking completed steps to go back
            disabled={!isCompleted && !isActive}
            className={`flex flex-col items-center relative group bg-background px-2 ${isCompleted || isActive ? "cursor-pointer" : "cursor-not-allowed"
              }`}
            aria-current={isActive ? "step" : undefined}
          >
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 sm:mb-2 transition-all border-2 font-semibold text-xs sm:text-sm z-10 ${isCompleted
                ? "bg-primary border-primary text-primary-foreground"
                : isActive
                  ? "bg-background border-primary text-primary ring-2 sm:ring-4 ring-primary/20"
                  : "bg-background border-muted text-muted-foreground"
                }`}
            >
              {isCompleted ? (
                <Check className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <span>{s.id + 1}</span>
              )}
            </div>
            <span
              className={`text-xs sm:text-sm font-medium transition-colors ${isActive
                ? "text-primary"
                : isCompleted
                  ? "text-foreground"
                  : "text-muted-foreground"
                }`}
            >
              {s.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}
