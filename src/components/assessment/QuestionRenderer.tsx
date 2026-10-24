// 题目渲染：编辑式大字号题干 + 单选选项列表（radio group）
// EXPORTS: QuestionRenderer
import type { IOption, IQuestion } from '@/data/types';
import { OptionRow } from './OptionRow';

interface Props {
  question: IQuestion;
  index: number; // 0-based
  total: number;
  selected?: IOption | null;
  onSelect: (o: IOption) => void;
}

export function QuestionRenderer({ question, index, total, selected, onSelect }: Props) {
  return (
    <div>
      <h2 className="text-xl font-medium leading-snug tracking-tight md:text-2xl">
        <span className="mr-2 text-sm font-normal tabular-nums text-muted-foreground">
          {String(index + 1).padStart(2, '0')}
        </span>
        {question.q}
      </h2>
      <div
        role="radiogroup"
        aria-label={`第 ${index + 1} 题选项，共 ${total} 题`}
        className="mt-6 space-y-2.5"
      >
        {question.opts.map((o, i) => (
          <OptionRow
            key={i}
            option={o}
            selected={selected === o}
            onSelect={() => onSelect(o)}
          />
        ))}
      </div>
    </div>
  );
}
