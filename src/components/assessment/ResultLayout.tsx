// 结果页统一外壳：大标题「你的测评结果」+ 测试名 + 分隔线章节 + 页脚
// EXPORTS: ResultLayout, ResultSection
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { SITE } from '@/config/site';
import type { ITestDef } from '@/data/types';
import { cn } from '@/lib/utils';

interface Props {
  test: ITestDef;
  badges?: ReactNode;
  summary?: string;
  children: ReactNode;
}

export function ResultLayout({ test, badges, summary, children }: Props) {
  const reduced = useReducedMotion();
  const cat = SITE.categoryMeta[test.category];
  const moduleEn = cat?.en ?? 'REPORT';

  return (
    <motion.main
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="mx-auto w-full max-w-3xl px-4 py-10 md:py-16"
    >
      <div className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
        {SITE.name} · {moduleEn}
      </div>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">你的测评结果</h1>
      <p className="mt-2 text-lg text-muted-foreground">{test.name}</p>

      {badges && <div className="mt-5 flex flex-wrap gap-2">{badges}</div>}
      {summary && (
        <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">{summary}</p>
      )}

      <div className="mt-12">{children}</div>

      <p className="mt-16 text-center text-xs text-muted-foreground">
        {SITE.name} · {SITE.copyright}
      </p>
    </motion.main>
  );
}

// 章节容器：相邻章节用分隔线区分，不再是卡片堆叠
export function ResultSection({
  title,
  eyebrow,
  children,
  className,
}: {
  title?: ReactNode;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('border-t border-border py-8 first:border-t-0 first:pt-0', className)}>
      {eyebrow && (
        <div className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
          {eyebrow}
        </div>
      )}
      {title && <h2 className="mt-1.5 text-lg font-medium tracking-tight">{title}</h2>}
      <div className="mt-4">{children}</div>
    </section>
  );
}
