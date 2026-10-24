/**
 * 财务自由计算器主容器：
 * welcome（选模式 / 示例）→ wizard（分步问卷）→ results。
 * 所有数字由 src/financial-freedom 计算引擎实时算出。
 */
import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react';
import { useFFPlan, type FFMode } from './useFFPlan';
import WelcomeStep from './steps/WelcomeStep';
import StepPersona from './steps/StepPersona';
import StepFinances from './steps/StepFinances';
import StepBudgets from './steps/StepBudgets';
import StepGoals from './steps/StepGoals';
import StepFutureIncome from './steps/StepFutureIncome';
import StepAssumptions from './steps/StepAssumptions';
import StepReview from './steps/StepReview';
import ResultsPage from './ResultsPage';
import { validatePlan } from '@/financial-freedom/validation';
import { AssessmentProgress } from '@/components/assessment/AssessmentProgress';
import { cn } from '@/lib/utils';

type Stage = 'welcome' | 'wizard' | 'results';

export default function FinancialFreedomPage() {
  const ff = useFFPlan();
  const { plan } = ff;
  const [stage, setStage] = useState<Stage>('welcome');
  const [stepIdx, setStepIdx] = useState(0);
  const reduced = useReducedMotion();

  /* 深度模式 7 步；快速模式 3 步（财务 / 预算 / 确认） */
  const steps = useMemo(() => {
    if (ff.mode === 'deep') {
      return [
        { key: 'persona', label: '定义自由', el: <StepPersona plan={plan} update={ff.update} updateAsset={ff.updateAsset} /> },
        { key: 'finances', label: '当前财务', el: <StepFinances plan={plan} update={ff.update} updateAsset={ff.updateAsset} /> },
        { key: 'budgets', label: '三种生活', el: <StepBudgets plan={plan} update={ff.update} updateAsset={ff.updateAsset} /> },
        { key: 'goals', label: '人生目标', el: <StepGoals plan={plan} update={ff.update} updateAsset={ff.updateAsset} /> },
        { key: 'future', label: '未来收入', el: <StepFutureIncome plan={plan} update={ff.update} updateAsset={ff.updateAsset} /> },
        { key: 'assumptions', label: '规划假设', el: <StepAssumptions plan={plan} update={ff.update} updateAsset={ff.updateAsset} /> },
        { key: 'review', label: '确认', el: <StepReview plan={plan} update={ff.update} updateAsset={ff.updateAsset} validation={validatePlan(plan)} /> },
      ];
    }
    return [
      { key: 'finances', label: '当前财务', el: <StepFinances plan={plan} update={ff.update} updateAsset={ff.updateAsset} /> },
      { key: 'budgets', label: '三种生活', el: <StepBudgets plan={plan} update={ff.update} updateAsset={ff.updateAsset} /> },
      { key: 'review', label: '确认', el: <StepReview plan={plan} update={ff.update} updateAsset={ff.updateAsset} validation={validatePlan(plan)} /> },
    ];
  }, [ff.mode, plan, ff.update, ff.updateAsset]);

  const validation = useMemo(() => validatePlan(plan), [plan]);

  const startMode = (mode: FFMode) => {
    ff.setMode(mode);
    setStepIdx(0);
    setStage('wizard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const useDemo = () => {
    ff.loadDemo();
    setStage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const coreReady =
    plan.currentAge > 0 &&
    plan.targetAge > plan.currentAge &&
    plan.planningEndAge > plan.targetAge &&
    plan.comfortableMonthlyBudget > 0;

  const goNext = () => {
    if (stepIdx < steps.length - 1) {
      setStepIdx((i) => i + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (coreReady) {
      setStage('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const goBack = () => {
    if (stepIdx > 0) setStepIdx((i) => i - 1);
    else setStage('welcome');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ---------- 欢迎页 ---------- */
  if (stage === 'welcome') {
    return <WelcomeStep hasStored={ff.restored} onPick={startMode} onDemo={useDemo} />;
  }

  /* ---------- 结果页 ---------- */
  if (stage === 'results') {
    return (
      <ResultsPage
        plan={plan}
        onRestart={() => {
          ff.clearStorage();
          setStage('welcome');
          setStepIdx(0);
        }}
        onBackEdit={() => setStage('wizard')}
      />
    );
  }

  /* ---------- 向导 ---------- */
  const current = steps[stepIdx];
  const isLast = stepIdx === steps.length - 1;

  return (
    <motion.main
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="mx-auto w-full max-w-2xl px-4 py-8 md:py-12 print:hidden"
    >
      <AssessmentProgress value={((stepIdx + 1) / steps.length) * 100} current={stepIdx} total={steps.length} />

      {ff.demoMode && (
        <div className="mt-4 flex items-start gap-2 rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-xs text-accent-foreground">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          当前使用演示数据，并非你的个人财务结果。
        </div>
      )}

      <div className="mt-8">{current.el}</div>

      {isLast && !coreReady && (
        <p className="mt-6 rounded-md border border-destructive/40 px-3 py-2 text-sm text-destructive">
          请先在「当前财务」填好：当前年龄、目标自由年龄（需大于当前年龄），并在「三种生活」至少填好舒适月预算，才能生成结果。
        </p>
      )}

      <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {stepIdx === 0 ? '返回' : '上一步'}
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={isLast && !coreReady}
          className={cn(
            'inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-85',
            isLast && !coreReady && 'cursor-not-allowed opacity-40',
          )}
        >
          {isLast ? '生成我的数字' : '下一步'}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.main>
  );
}
