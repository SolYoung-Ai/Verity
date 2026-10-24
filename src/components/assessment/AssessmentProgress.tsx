// 答题进度：顶部细进度线 + 第 N/总题数（编辑式细边框，不用粗进度条）
// EXPORTS: AssessmentProgress
import { cn } from '@/lib/utils';

interface Props {
  /** 0 - 100 */
  value: number;
  current: number; // 0-based 当前题号
  total: number;
  className?: string;
}

export function AssessmentProgress({ value, current, total, className }: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn('w-full', className)}>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clamped)}
        aria-label={`答题进度，第 ${current + 1} 题，共 ${total} 题`}
        className="h-[2px] w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-foreground transition-[width] duration-300 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <div className="mt-2 text-right text-xs tabular-nums text-muted-foreground" aria-hidden>
        {current + 1} / {total}
      </div>
    </div>
  );
}
