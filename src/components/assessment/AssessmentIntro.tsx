// 测评开始页：测试名 / 英文 module 标识 / 说明 / 耗时 / 本地保存提示 / 开始按钮
// EXPORTS: AssessmentIntro
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Clock, ListChecks, ShieldCheck } from 'lucide-react';
import { SITE } from '@/config/site';
import type { ITestDef } from '@/data/types';

interface Props {
  test: ITestDef;
  onStart: () => void;
}

export function AssessmentIntro({ test, onStart }: Props) {
  const reduced = useReducedMotion();
  const cat = SITE.categoryMeta[test.category];
  const moduleEn = cat?.en ?? 'ASSESSMENT';

  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col justify-center px-4 py-12"
      aria-label={`${test.name} 测评说明`}
    >
      <div className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
        {SITE.name} · {moduleEn}
      </div>

      <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
        {test.name}
      </h1>

      <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">{test.desc}</p>

      <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" aria-hidden />
          <dt className="sr-only">预计耗时</dt>
          <dd>{test.time}</dd>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <ListChecks className="h-4 w-4" aria-hidden />
          <dt className="sr-only">题目数量</dt>
          <dd>共 {test.questions.length} 题</dd>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <ShieldCheck className="h-4 w-4" aria-hidden />
          <dt className="sr-only">测评性质</dt>
          <dd>{test.trust}</dd>
        </div>
      </dl>

      <div className="mt-8 max-w-xl border-l-2 border-border pl-4 text-sm leading-relaxed text-muted-foreground">
        你的作答与结果仅保存在本机浏览器，不会上传或与他人共享；清除浏览器数据后将无法找回。
      </div>

      <div className="mt-10">
        <button
          type="button"
          onClick={onStart}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-7 text-sm font-medium text-background transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={`开始 ${test.name}`}
        >
          开始测评
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </motion.section>
  );
}
