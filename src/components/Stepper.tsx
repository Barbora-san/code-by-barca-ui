import type { ReactNode } from "react";
import { CheckIcon } from "./Icons";
import { cn } from "../lib/cn";

export type StepperStep = string | { label: ReactNode; description?: ReactNode };

export interface StepperProps {
  steps: StepperStep[];
  /** Index aktuálního kroku (od 0). */
  currentStep: number;
  /** Když zadáš, dají se kliknutím vybrat už dokončené kroky. */
  onStepClick?: (index: number) => void;
  className?: string;
}

export function Stepper({ steps, currentStep, onStepClick, className }: StepperProps) {
  return (
    <ol className={cn("cbb-stepper", className)}>
      {steps.map((s, i) => {
        const step = typeof s === "string" ? { label: s } : s;
        const state = i < currentStep ? "done" : i === currentStep ? "current" : "todo";
        const clickable = onStepClick && i <= currentStep;
        const inner = (
          <>
            <span className="cbb-stepper__dot">{state === "done" ? <CheckIcon size={14} strokeWidth={3} /> : i + 1}</span>
            <span className="cbb-stepper__text">
              <span className="cbb-stepper__label">{step.label}</span>
              {step.description && <span className="cbb-stepper__desc">{step.description}</span>}
            </span>
          </>
        );
        return (
          <li key={i} className={cn("cbb-stepper__step", `is-${state}`)} aria-current={state === "current" ? "step" : undefined}>
            {clickable ? (
              <button type="button" className="cbb-stepper__btn" onClick={() => onStepClick(i)}>
                {inner}
              </button>
            ) : (
              <div className="cbb-stepper__btn">{inner}</div>
            )}
            {i < steps.length - 1 && <span className="cbb-stepper__line" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}
