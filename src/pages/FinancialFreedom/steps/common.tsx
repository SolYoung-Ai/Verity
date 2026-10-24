/**
 * 步骤共用 props 与小节标题。
 */
import type { ReactNode } from 'react';
import type { FFPlan, FinancialAssets } from '@/financial-freedom/types';

export interface StepProps {
  plan: FFPlan;
  update: (patch: Partial<FFPlan>) => void;
  updateAsset: (key: keyof FinancialAssets, value: number) => void;
}

export function StepHeading({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return (
    <div className="mb-8">
      <div className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
        {eyebrow}
      </div>
      <h2 className="mt-1.5 text-2xl font-semibold tracking-tight">{title}</h2>
      {desc && <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{desc}</p>}
    </div>
  );
}

export function StepBody({ children }: { children: ReactNode }) {
  return <div className="space-y-8">{children}</div>;
}
