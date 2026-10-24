/**
 * 财务自由问卷共用输入控件：编辑式细边框 + 暖米白，克制动效。
 * 金额输入带币种符号；单选为卡片；多选 chip；子表行内增删改。
 */
import type { ReactNode } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { currencySymbol } from '@/financial-freedom/formatters';
import type { Currency } from '@/financial-freedom/types';

/* ---------- 外层字段壳 ---------- */
export function FieldShell({
  label,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

/* ---------- 数字金额输入 ---------- */
export function MoneyInput({
  value,
  onChange,
  currency = 'CNY',
  placeholder = '0',
  className,
}: {
  value: number;
  onChange: (n: number) => void;
  currency?: Currency;
  placeholder?: string;
  className?: string;
}) {
  const sym = currencySymbol(currency);
  return (
    <div
      className={cn(
        'flex items-center rounded-md border border-input bg-transparent px-3 transition-colors focus-within:border-foreground/40',
        className,
      )}
    >
      <span className="mr-2 text-sm text-muted-foreground">{sym}</span>
      <input
        type="number"
        inputMode="decimal"
        min={0}
        value={value === 0 ? '' : value}
        placeholder={placeholder}
        onChange={(e) => {
          const n = parseFloat(e.target.value);
          onChange(Number.isFinite(n) && n > 0 ? n : 0);
        }}
        className="h-11 w-full bg-transparent text-sm tabular-nums outline-none placeholder:text-muted-foreground/60"
      />
    </div>
  );
}

/* ---------- 年龄整数输入 ---------- */
export function AgeInput({
  value,
  onChange,
  placeholder = '0',
  className,
}: {
  value: number;
  onChange: (n: number) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      type="number"
      inputMode="numeric"
      min={0}
      max={120}
      value={value === 0 ? '' : value}
      placeholder={placeholder}
      onChange={(e) => {
        const n = parseInt(e.target.value, 10);
        onChange(Number.isFinite(n) && n > 0 ? n : 0);
      }}
      className={cn(
        'h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm tabular-nums outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-foreground/40',
        className,
      )}
    />
  );
}

/* ---------- 单选卡片组 ---------- */
export interface OptionItem<T extends string> {
  value: T;
  label: string;
  desc?: string;
}

export function OptionCards<T extends string>({
  options,
  value,
  onChange,
  columns = 1,
}: {
  options: OptionItem<T>[];
  value: T;
  onChange: (v: T) => void;
  columns?: 1 | 2;
}) {
  return (
    <div className={cn('grid gap-2', columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1')}>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              selected
                ? 'border-foreground bg-foreground/[0.04]'
                : 'border-border bg-transparent hover:border-foreground/30',
            )}
          >
            <span>
              <span className="block text-sm font-medium">{opt.label}</span>
              {opt.desc && <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{opt.desc}</span>}
            </span>
            <span
              aria-hidden
              className={cn(
                'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors',
                selected ? 'border-foreground bg-foreground text-background' : 'border-border',
              )}
            >
              {selected && <span className="h-1.5 w-1.5 rounded-full bg-background" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- 多选 chip（最多 max） ---------- */
export function MultiChips({
  options,
  values,
  onChange,
  max = 3,
}: {
  options: OptionItem<string>[];
  values: string[];
  onChange: (v: string[]) => void;
  max?: number;
}) {
  const toggle = (v: string) => {
    if (values.includes(v)) {
      onChange(values.filter((x) => x !== v));
    } else if (values.length < max) {
      onChange([...values, v]);
    }
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const selected = values.includes(opt.value);
        const disabled = !selected && values.length >= max;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            aria-pressed={selected}
            disabled={disabled}
            title={opt.desc}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-200',
              selected
                ? 'border-foreground bg-foreground text-background'
                : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground',
              disabled && 'cursor-not-allowed opacity-40',
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- 通用子表 ---------- */
export function SubTable<T>({
  rows,
  getId,
  renderRow,
  onAdd,
  onRemove,
  onRowChange,
  emptyText,
  addLabel,
}: {
  rows: T[];
  getId: (row: T) => string;
  renderRow: (ctx: { row: T; index: number; onChange: (patch: Partial<T>) => void }) => ReactNode;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onRowChange: (id: string, patch: Partial<T>) => void;
  emptyText: string;
  addLabel: string;
}) {
  return (
    <div className="space-y-3">
      {rows.length === 0 && (
        <div className="rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
          {emptyText}
        </div>
      )}
      {rows.map((row, i) => {
        const id = getId(row);
        return (
          <div
            key={id}
            className="relative space-y-3 rounded-md border border-border p-3.5"
            data-row-index={i}
          >
            {renderRow({ row, index: i, onChange: (patch) => onRowChange(id, patch) })}
            <button
              type="button"
              onClick={() => onRemove(id)}
              className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-destructive"
              aria-label="删除这一条"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
      >
        <Plus className="h-4 w-4" />
        {addLabel}
      </button>
    </div>
  );
}

/* 生成唯一 id */
export function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}
