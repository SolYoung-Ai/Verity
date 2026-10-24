import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { ITestDef } from '@/data/types';
import { SITE } from '@/config/site';
import { cn } from '@/lib/utils';

/**
 * VERITY 统一测评卡片
 * - Header: 类别 Badge · 英文 module 标识 · 可选 NEW
 * - Title / Description (2-3 行)
 * - Spacer (flex-1)
 * - Footer: 测评类型 · 耗时 / CTA（hover 抽屉滑出辅助操作）
 *
 * Hover 动效（250-350ms）：
 *   - 卡片上移 4-6px、缩放 1.01、边框对比度提升、背景微变，不推动同行
 *   - 标题/描述轻微上移，CTA 箭头右移 4-6px
 *   - 底部预留高度滑出辅助操作「了解详情 →」（finance 为「开始规划 →」）
 *   - 外层高度稳定，不造成页面跳动
 *   - 键盘 focus 等同 hover；hover:none 移动端操作入口始终可见
 *   - prefers-reduced-motion 关闭位移/缩放，保留颜色反馈
 */
export default function TestCard({ test }: { test: ITestDef }) {
  const cat = SITE.categoryMeta[test.category];
  const isFinance = test.category === 'finance';

  const primaryCta = isFinance ? '开始规划' : '开始测试';
  const auxCta = isFinance ? '开始规划' : '了解详情';

  return (
    <Link
      to={`/test/${test.id}`}
      className="group block h-full outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl"
    >
      <article
        className={cn(
          // 布局与尺寸
          'relative flex h-full min-h-[248px] flex-col rounded-xl border p-5 sm:p-6',
          // 浅色：暖米白/浅中性；深色：深灰；细边框低对比度
          'border-border/70 bg-card/85',
          'dark:border-border dark:bg-card',
          // 过渡
          'transition-[transform,background-color,border-color,box-shadow] duration-300 ease-out',
          // Hover / Focus：上移 + 微缩放 + 边框对比提升 + 背景微变（不推同行）
          'motion-safe:hover:-translate-y-1.5 motion-safe:hover:scale-[1.01]',
          'motion-safe:focus-visible:-translate-y-1.5 motion-safe:focus-visible:scale-[1.01]',
          'hover:border-border hover:bg-card',
          'hover:shadow-[0_1px_0_0_var(--card-border),0_10px_30px_-20px_rgba(0,0,0,0.25)]',
          'dark:hover:shadow-[0_1px_0_0_var(--card-border),0_10px_30px_-20px_rgba(0,0,0,0.6)]',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <span
            className={cn(
              'inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-medium tracking-wide',
              cat.color,
            )}
          >
            {cat.label}
          </span>
          <div className="flex items-center gap-2">
            {test.isNew && (
              <span className="inline-flex items-center rounded-sm bg-accent/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent dark:bg-accent/15">
                New
              </span>
            )}
            {test.module && (
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {test.module}
              </span>
            )}
          </div>
        </div>

        {/* Title + Description */}
        <h3 className="mt-4 text-base font-semibold leading-snug tracking-tight text-foreground motion-safe:transition-transform motion-safe:duration-300 group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5">
          {test.name}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground motion-safe:transition-transform motion-safe:duration-300 group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5">
          {test.desc}
        </p>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="mt-5 border-t border-border/60 pt-3 dark:border-border/70">
          <div className="flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
            <span className="truncate">{test.trust}</span>
            <span className="shrink-0">{test.time}</span>
          </div>

          {/* CTA drawer：外层固定高度，hover 上滑露出辅助操作 */}
          <div className="relative mt-1.5 h-5 overflow-hidden [@media(hover:none)]:h-auto [@media(hover:none)]:overflow-visible">
            <div className="motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out group-hover:-translate-y-5 group-focus-visible:-translate-y-5 [@media(hover:none)]:transform-none">
              <div className="flex h-5 items-center gap-1 text-[12px] font-medium text-foreground">
                <span>{primaryCta}</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1" />
              </div>
              <div className="flex h-5 items-center gap-1 text-[12px] font-medium text-foreground">
                <span>{auxCta}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
