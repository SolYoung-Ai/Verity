/**
 * 01 定义自由：人生优先级（多选≤3）、理想工作状态、你心中的自由。
 */
import { FieldShell, OptionCards, MultiChips } from '../fields';
import { StepHeading, StepBody, type StepProps } from './common';
import {
  LIFE_PRIORITY_OPTIONS,
  PREFERRED_WORK_OPTIONS,
  FREEDOM_DEF_OPTIONS,
} from '../options';

export default function StepPersona({ plan, update }: StepProps) {
  return (
    <div>
      <StepHeading
        eyebrow="01 · 定义自由"
        title="你想要的自由，长什么样？"
        desc="这些问题不直接决定数字，但会影响报告里对你的画像与下一步建议。"
      />
      <StepBody>
        <FieldShell label="人生优先级" hint="最多选 3 项">
          <MultiChips
            options={LIFE_PRIORITY_OPTIONS}
            values={plan.lifePriorities}
            max={3}
            onChange={(v) =>
              update({ lifePriorities: v, topLifePriorities: v.slice(0, 1) })
            }
          />
        </FieldShell>

        <FieldShell label="实现自由后，你理想的工作状态是？">
          <OptionCards
            options={PREFERRED_WORK_OPTIONS}
            value={plan.preferredWorkStyle}
            onChange={(v) => update({ preferredWorkStyle: v })}
          />
        </FieldShell>

        <FieldShell label="你心中「财务自由」最接近哪一种？">
          <OptionCards
            options={FREEDOM_DEF_OPTIONS}
            value={plan.freedomDefinition}
            onChange={(v) => update({ freedomDefinition: v })}
          />
        </FieldShell>
      </StepBody>
    </div>
  );
}
