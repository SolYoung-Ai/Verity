/**
 * 欢迎页：选择快速 / 深度模式，可载入示例数据。
 */
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Zap, Compass, Sparkles } from 'lucide-react';
import type { FFMode } from '../useFFPlan';
import { SITE } from '@/config/site';

interface Props {
  hasStored: boolean;
  onPick: (mode: FFMode) => void;
  onDemo: () => void;
}

export default function WelcomeStep({ hasStored, onPick, onDemo }: Props) {
  const reduced = useReducedMotion();
  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col justify-center px-4 py-12"
    >
      <div className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
        {SITE.name} · PLANNER
      </div>
      <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
        财务自由计算器
      </h1>
      <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
        算清你想过怎样的一生，以及需要多少财务底气。从生活需求、人生目标到未来现金流，规划属于你的财务自由数字。
      </p>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onPick('quick')}
          className="group rounded-xl border border-border bg-card p-6 text-left transition-colors duration-200 hover:border-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Zap className="h-5 w-5 text-[var(--verity-accent)]" />
          <h2 className="mt-3 text-base font-semibold">快速规划</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            只填核心数字：年龄、收支、资产与三档预算。约 3 分钟出结果。
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium">
            {hasStored ? '继续上次 / 快速开始' : '快速开始'}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </button>

        <button
          type="button"
          onClick={() => onPick('deep')}
          className="group rounded-xl border border-border bg-card p-6 text-left transition-colors duration-200 hover:border-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Compass className="h-5 w-5 text-[var(--verity-accent)]" />
          <h2 className="mt-3 text-base font-semibold">深度规划</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            33 项完整问卷：目标、债务、未来收入、优先级与假设，更贴近真实一生。
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium">
            深度开始
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </button>
      </div>

      <div className="mt-8 border-l-2 border-border pl-4 text-sm leading-relaxed text-muted-foreground">
        你的所有输入只保存在本机浏览器，不会上传。金额按今天实际购买力记账，结果是情景模拟，不是收益承诺。
      </div>

      <button
        type="button"
        onClick={onDemo}
        className="mt-6 inline-flex w-fit items-center gap-2 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
      >
        <Sparkles className="h-4 w-4" />
        不想先填？载入一份示例数据看看效果
      </button>
    </motion.section>
  );
}
