import { useState } from 'react';
import TestCard from '@/components/TestCard';
import { ALL_TESTS } from '@/data/registry';
import type { TestCategory } from '@/data/types';
import { cn } from '@/lib/utils';

const FILTERS: { key: TestCategory | 'all'; label: string; en: string }[] = [
  { key: 'all', label: '全部', en: 'ALL' },
  { key: 'academic', label: '学术量表', en: 'ASSESSMENT' },
  { key: 'popular', label: '流行测评', en: 'PERSONALITY' },
  { key: 'fun', label: '娱乐测试', en: 'EXPLORATION' },
  { key: 'finance', label: '财务规划', en: 'PLANNER' },
];

export default function TestsPage() {
  const [f, setF] = useState<TestCategory | 'all'>('all');
  const [kw, setKw] = useState('');
  const base = f === 'all' ? ALL_TESTS : ALL_TESTS.filter((t) => t.category === f);
  const kwTrim = kw.trim().toLowerCase();
  const list = kwTrim
    ? base.filter(
        (t) =>
          t.name.toLowerCase().includes(kwTrim) ||
          t.desc.toLowerCase().includes(kwTrim) ||
          (t.module ?? '').toLowerCase().includes(kwTrim),
      )
    : base;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Header */}
      <div className="border-b border-border/60 pb-8">
        <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Catalog
        </div>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-foreground">
          全部测试
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          共 {ALL_TESTS.length} 套人格与行为测评，按可信度分级。学术量表具备实证基础，流行测评仅供自我参考，娱乐测试请勿当真。
        </p>
      </div>

      {/* Filters + Search */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((x) => (
            <button
              key={x.key}
              type="button"
              onClick={() => setF(x.key)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-xs transition-colors',
                f === x.key
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border/70 bg-card text-muted-foreground hover:border-border hover:text-foreground',
              )}
            >
              {x.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={kw}
          onChange={(e) => setKw(e.target.value)}
          placeholder="搜索测试，如 MBTI、大五、九型…"
          className="ml-auto h-9 w-full max-w-xs rounded-full border border-border/70 bg-card px-4 text-sm outline-none transition focus:border-foreground"
        />
      </div>

      {kwTrim && (
        <p className="mt-4 text-xs text-muted-foreground">
          搜索「{kwTrim}」共找到 {list.length} 套测试
        </p>
      )}

      {/* Grid */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((t) => (
          <TestCard key={t.id} test={t} />
        ))}
      </div>

      {list.length === 0 && (
        <p className="mt-16 text-center text-sm text-muted-foreground">
          没有找到匹配的测试，换个关键词试试。
        </p>
      )}
    </div>
  );
}
