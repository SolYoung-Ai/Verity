import { useParams, Link } from 'react-router-dom';
import { getTest } from '@/data/registry';
import { loadAttempts } from '@/lib/history';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResultLayout, ResultSection } from '@/components/assessment/ResultLayout';
import { RefreshCcw, ArrowLeft, Info, Check, TriangleAlert, Handshake, ShieldAlert, Wrench } from 'lucide-react';
import type { IDimensionPoint, TestResult, ITypePoint } from '@/data/types';
import { cn } from '@/lib/utils';

function pick(level: IDimensionPoint['level'], a?: string, b?: string, c?: string): string | undefined {
  return level === 'low' ? a : level === 'high' ? c : b;
}

function Field({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span>
      <div>
        <div className="text-xs font-medium text-muted-foreground">{label}</div>
        <div className="mt-0.5 text-sm leading-relaxed">{value}</div>
      </div>
    </div>
  );
}

function DimensionSection({ d, testId }: { d: IDimensionPoint; testId: string }) {
  const test = getTest(testId);
  const meta = test?.dimensionMeta?.find((m) => m.key === d.key);
  const overview = meta ? pick(d.level, meta.low, meta.mid, meta.high) : undefined;
  const adv = meta ? pick(d.level, meta.advLow, meta.advMid, meta.advHigh) : undefined;
  const risk = meta ? pick(d.level, meta.riskLow, meta.riskMid, meta.riskHigh) : undefined;
  const match = meta ? pick(d.level, meta.matchLow, meta.matchMid, meta.matchHigh) : undefined;
  const pit = meta ? pick(d.level, meta.pitLow, meta.pitMid, meta.pitHigh) : undefined;
  const tip = meta ? pick(d.level, meta.tipLow, meta.tipMid, meta.tipHigh) : undefined;
  const color = d.level === 'high' ? 'text-emerald-600' : d.level === 'low' ? 'text-amber-600' : 'text-sky-600';

  return (
    <ResultSection>
      <div className="flex items-baseline justify-between">
        <h3 className="text-base font-medium tracking-tight">{d.label}</h3>
        <span className={cn('text-sm font-semibold tabular-nums', color)}>{d.percent}%</span>
      </div>
      <div className="mt-3 h-[2px] w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-foreground"
          style={{ width: `${d.percent}%` }}
          role="progressbar"
          aria-valuenow={d.percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${d.label} 得分`}
        />
      </div>
      {overview && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{overview}</p>}
      <div className="mt-4 space-y-3">
        <Field icon={<Check className="h-4 w-4" />} label="优势" value={adv} />
        <Field icon={<TriangleAlert className="h-4 w-4" />} label="潜在短板" value={risk} />
        <Field icon={<Handshake className="h-4 w-4" />} label="适合的相处模式" value={match} />
        <Field icon={<ShieldAlert className="h-4 w-4" />} label="容易踩坑的场景" value={pit} />
        <Field icon={<Wrench className="h-4 w-4" />} label="自我调整建议" value={tip} />
      </div>
    </ResultSection>
  );
}

function TypePrimarySection({ result, testId }: { result: TestResult; testId: string }) {
  const test = getTest(testId);
  const meta = result.primaryKey && test?.typesMeta ? test.typesMeta[result.primaryKey] : undefined;
  if (!meta) return null;
  return (
    <ResultSection eyebrow="你的主导类型">
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{meta.name}</h2>
      {meta.desc && (
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{meta.desc}</p>
      )}
      <div className="mt-5 space-y-3">
        <Field icon={<Check className="h-4 w-4" />} label="优势" value={meta.adv} />
        <Field icon={<TriangleAlert className="h-4 w-4" />} label="潜在短板" value={meta.risk} />
        <Field icon={<Handshake className="h-4 w-4" />} label="适合的相处模式" value={meta.match} />
        <Field icon={<ShieldAlert className="h-4 w-4" />} label="容易踩坑的场景" value={meta.pit} />
        <Field icon={<Wrench className="h-4 w-4" />} label="自我调整建议" value={meta.tip} />
      </div>
    </ResultSection>
  );
}

function TypeRanksSection({ types }: { types: ITypePoint[] }) {
  const max = types.length ? types[0].score : 1;
  return (
    <ResultSection title="各类型得分排序">
      <div className="space-y-4">
        {types.map((t, i) => (
          <div key={t.key} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className={cn(i === 0 ? 'font-semibold' : 'text-muted-foreground')}>
                {t.name}
              </span>
              <span className="text-xs tabular-nums text-muted-foreground">{t.score}</span>
            </div>
            <div className="h-[2px] w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-foreground"
                style={{ width: max ? `${(t.score / max) * 100}%` : '0%' }}
                role="progressbar"
                aria-valuenow={max ? Math.round((t.score / max) * 100) : 0}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${t.name} 得分`}
              />
            </div>
          </div>
        ))}
      </div>
    </ResultSection>
  );
}

function MbtiSection({ result }: { result: TestResult }) {
  const m = result.mbti;
  if (!m) return null;
  return (
    <ResultSection eyebrow="你的人格类型">
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{m.code}</h2>
      <div className="mt-3 space-y-1.5">
        {m.letterDesc.map((line, i) => (
          <p key={i} className="text-sm leading-relaxed text-muted-foreground">
            {line}
          </p>
        ))}
      </div>
      <div className="mt-5 space-y-3">
        <Field icon={<Check className="h-4 w-4" />} label="核心优势" value={m.adv} />
        <Field icon={<TriangleAlert className="h-4 w-4" />} label="潜在短板" value={m.risk} />
        <Field icon={<Handshake className="h-4 w-4" />} label="适合的相处模式" value={m.match} />
        <Field icon={<ShieldAlert className="h-4 w-4" />} label="压力状态与踩坑场景" value={m.pit} />
        <Field icon={<Wrench className="h-4 w-4" />} label="成长发展建议" value={m.tip} />
      </div>
    </ResultSection>
  );
}

function AttachmentSection({ result }: { result: TestResult }) {
  const a = result.attachment;
  if (!a) return null;
  return (
    <ResultSection eyebrow="你的依恋类型">
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{a.type}</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.desc}</p>
      <div className="mt-5 space-y-3">
        <Field icon={<Check className="h-4 w-4" />} label="优势" value={a.adv} />
        <Field icon={<TriangleAlert className="h-4 w-4" />} label="潜在短板" value={a.risk} />
        <Field icon={<Handshake className="h-4 w-4" />} label="适合的相处模式" value={a.match} />
        <Field icon={<ShieldAlert className="h-4 w-4" />} label="容易踩坑的场景" value={a.pit} />
        <Field icon={<Wrench className="h-4 w-4" />} label="改善实操建议" value={a.tip} />
      </div>
    </ResultSection>
  );
}

function Body({ result, testId }: { result: TestResult; testId: string }) {
  if (result.kind === 'dimension') {
    return (
      <>
        {result.dimensions?.map((d) => (
          <DimensionSection key={d.key} d={d} testId={testId} />
        ))}
      </>
    );
  }
  if (result.kind === 'mbti') return <MbtiSection result={result} />;
  if (result.kind === 'attachment') return <AttachmentSection result={result} />;
  return (
    <>
      <TypePrimarySection result={result} testId={testId} />
      {result.types && result.types.length > 1 && <TypeRanksSection types={result.types} />}
    </>
  );
}

export default function ResultPage() {
  const { id, attemptId } = useParams();
  const test = id ? getTest(id) : undefined;
  const attempts = loadAttempts();
  const attempt = attemptId ? attempts.find((a) => a.id === attemptId) : attempts[0];

  if (!test || !attempt) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-muted-foreground">未找到该份报告（历史记录保存在本机浏览器，清除缓存会丢失）。</p>
        <Link to="/tests" className="mt-2 inline-block text-sm text-primary underline">
          去重新测试
        </Link>
      </div>
    );
  }

  const { result } = attempt;

  return (
    <ResultLayout
      test={test}
      summary={result.summary}
      badges={
        <>
          <Badge variant="outline">{test.trust}</Badge>
          {result.primaryName && <Badge className="bg-primary/10 text-primary">{result.primaryName}</Badge>}
        </>
      }
    >
      <Body result={result} testId={test.id} />

      <ResultSection>
        <div className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>{result.disclaimer}</span>
        </div>
      </ResultSection>

      <ResultSection>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild>
            <Link to={`/test/${test.id}`}>
              <RefreshCcw className="h-4 w-4" />
              重新测试
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/tests">
              <ArrowLeft className="h-4 w-4" />
              返回测试列表
            </Link>
          </Button>
        </div>
      </ResultSection>

      {attempts.length > 0 && (
        <ResultSection title="我的历史记录（本机保存）">
          <div className="space-y-2">
            {attempts.map((a) => (
              <Link
                key={a.id}
                to={`/result/${a.testId}/${a.id}`}
                className={cn(
                  'flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors',
                  a.id === attempt.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40',
                )}
              >
                <span>{a.testName}</span>
                <span className="text-xs text-muted-foreground">
                  {a.result.primaryName ?? '已完成'} · {new Date(a.at).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        </ResultSection>
      )}
    </ResultLayout>
  );
}
