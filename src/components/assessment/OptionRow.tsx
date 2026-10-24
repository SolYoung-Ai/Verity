// 单选项：统一高度 / 选中态 / hover / focus，可键盘聚焦，role=radio + aria-checked
// EXPORTS: OptionRow
import { Check } from 'lucide-react';
import type { IOption } from '@/data/types';
import { cn } from '@/lib/utils';

interface Props {
  option: IOption;
  selected: boolean;
  onSelect: () => void;
}

export function OptionRow({ option, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        'flex min-h-[3.25rem] w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-[15px] leading-relaxed transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        selected
          ? 'border-foreground bg-foreground/[0.04] text-foreground'
          : 'border-border bg-transparent text-muted-foreground hover:border-foreground/30 hover:text-foreground',
      )}
    >
      <span>{option.text}</span>
      <span
        aria-hidden
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors',
          selected ? 'border-foreground bg-foreground text-background' : 'border-border',
        )}
      >
        {selected && <Check className="h-3 w-3" />}
      </span>
    </button>
  );
}
