import { Link } from 'react-router-dom';
import TestCard from '@/components/TestCard';
import { ALL_TESTS } from '@/data/registry';
import { SITE } from '@/config/site';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const hot = ALL_TESTS.slice(0, 6);
  const cats = ['academic', 'popular', 'fun'] as const;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      {/* Hero — 编辑式品牌排版 */}
      <section className="border-b border-border/60 pb-12">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Personality &amp; Life Planning
        </div>
        <h1 className="mt-4 font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
          {SITE.name}.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {SITE.tagline}。以克制的编辑式设计，把心理学量表、流行人格框架与生活规划工具放回你自己的判断里。
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            to="/tests"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            浏览全部测试
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <span className="text-xs text-muted-foreground">
            共 {ALL_TESTS.length} 套测评 · 按可信度分级
          </span>
        </div>
      </section>

      {/* 热门测试 */}
      <section className="mt-12">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Featured
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">热门测试</h2>
          </div>
          <Link
            to="/tests"
            className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            查看全部
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hot.map((t) => (
            <TestCard key={t.id} test={t} />
          ))}
        </div>
      </section>

      {/* 分类说明 */}
      <section className="mt-16">
        <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Taxonomy
        </div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">分类说明</h2>
        <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border/70 bg-border/60 md:grid-cols-3">
          {cats.map((c) => (
            <div key={c} className="bg-card p-6 dark:bg-card">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{SITE.categoryMeta[c].label}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {SITE.categoryMeta[c].en}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {SITE.categoryMeta[c].desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
