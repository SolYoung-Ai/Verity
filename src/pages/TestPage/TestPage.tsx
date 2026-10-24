import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { getTest } from '@/data/registry';
import { saveAttempt } from '@/lib/history';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { IOption } from '@/data/types';
import { AssessmentIntro } from '@/components/assessment/AssessmentIntro';
import { AssessmentProgress } from '@/components/assessment/AssessmentProgress';
import { QuestionRenderer } from '@/components/assessment/QuestionRenderer';
import { toast } from 'sonner';

type Step = 'intro' | 'quiz';

export default function TestPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const test = id ? getTest(id) : undefined;
  const [step, setStep] = useState<Step>('intro');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(IOption | null)[]>(() =>
    test ? new Array(test.questions.length).fill(null) : [],
  );
  const reduced = useReducedMotion();
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  if (!test) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-muted-foreground">未找到该测试。</p>
        <Link to="/tests" className="mt-2 inline-block text-sm text-primary underline">
          返回测试列表
        </Link>
      </div>
    );
  }

  const total = test.questions.length;
  const q = test.questions[current];
  const answered = answers.filter(Boolean).length;
  const sel = answers[current];

  const pick = (o: IOption) => {
    setAnswers((prev) => prev.map((x, i) => (i === current ? o : x)));
    // 选择后轻量反馈，250ms 后自动进入下一题（最后一题不自动跳）
    if (current < total - 1) {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(() => setCurrent((c) => c + 1), 250);
    }
  };

  const confirmExit = () => {
    if (window.confirm('确定要退出本次测评吗？当前作答不会保存。')) {
      navigate('/tests');
    }
  };

  const submit = () => {
    if (answered < total) {
      const next = answers.findIndex((x) => !x);
      toast.error(`还有 ${total - answered} 题未作答`);
      if (next >= 0) setCurrent(next);
      return;
    }
    const result = test.compute(answers as IOption[]);
    const attempt = {
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}`,
      testId: test.id,
      testName: test.name,
      result,
      at: Date.now(),
    };
    saveAttempt(attempt);
    navigate(`/result/${test.id}/${attempt.id}`);
  };

  const enter = reduced ? { opacity: 0 } : { opacity: 0, x: 16 };
  const exit = reduced ? { opacity: 0 } : { opacity: 0, x: -16 };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {step === 'intro' ? (
        <AssessmentIntro test={test} onStart={() => setStep('quiz')} />
      ) : (
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-2xl flex-col px-4">
          {/* 顶部栏：VERITY + 测试名 + 退出 */}
          <header className="flex items-center justify-between border-b border-border py-4">
            <div className="flex min-w-0 items-baseline gap-3">
              <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                VERITY
              </span>
              <span className="truncate text-sm text-foreground">{test.name}</span>
            </div>
            <button
              type="button"
              onClick={confirmExit}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="退出本次测评"
            >
              <X className="h-4 w-4" aria-hidden />
              退出
            </button>
          </header>

          {/* 细进度线 */}
          <AssessmentProgress
            value={((current + 1) / total) * 100}
            current={current}
            total={total}
            className="pt-5"
          />

          {/* 题目区：AnimatePresence 淡入 + 轻微横移 */}
          <div className="flex-1 py-10 md:py-14">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current}
                initial={enter}
                animate={{ opacity: 1, x: 0 }}
                exit={exit}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <QuestionRenderer
                  question={q}
                  index={current}
                  total={total}
                  selected={sel}
                  onSelect={pick}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 底部导航 */}
          <footer className="flex items-center justify-between gap-3 border-t border-border py-5">
            <button
              type="button"
              disabled={current === 0}
              onClick={() => setCurrent((c) => c - 1)}
              className="inline-flex h-10 items-center gap-1 rounded-full border border-border px-4 text-sm text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              上一题
            </button>

            <span className="text-xs tabular-nums text-muted-foreground" aria-hidden>
              已答 {answered}/{total}
            </span>

            {current < total - 1 ? (
              <button
                type="button"
                disabled={!sel}
                onClick={() => setCurrent((c) => c + 1)}
                className="inline-flex h-10 items-center gap-1 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                下一题
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            ) : (
              <button
                type="button"
                disabled={answered < total}
                onClick={submit}
                className="inline-flex h-10 items-center gap-1 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                提交答卷
              </button>
            )}
          </footer>
        </div>
      )}
    </div>
  );
}
