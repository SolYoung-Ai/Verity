/**
 * compareScenarios：三套默认情景（保守/基准/乐观）横向对比。
 */
import type { FFPlan, LifeStyle, Scenario } from './types';
import { DEFAULT_SCENARIOS } from './defaults';
import { simulateLifecycle, type YearRow } from './projection';
import { findRequiredCapital } from './findRequiredCapital';
import { estimateFinancialFreedomAge } from './estimateFreedomAge';

export interface ScenarioComparisonEntry {
  scenario: Scenario;
  requiredCapital: number;
  requiredCapitalFeasible: boolean;
  freedomAge: number | null;
  endingAssets: number;
  minEndAssets: number;
  depleted: boolean;
  yearly: YearRow[];
}

export type ScenarioComparison = Record<string, ScenarioComparisonEntry>;

export function compareScenarios(
  plan: FFPlan,
  lifeStyle: LifeStyle,
  scenarios: Scenario[] = DEFAULT_SCENARIOS,
): ScenarioComparison {
  const out: ScenarioComparison = {};
  for (const scenario of scenarios) {
    const sim = simulateLifecycle(plan, scenario, lifeStyle);
    const req = findRequiredCapital(plan, scenario, lifeStyle);
    const freedom = estimateFinancialFreedomAge(plan, scenario, lifeStyle);
    out[scenario.id] = {
      scenario,
      requiredCapital: req.capital,
      requiredCapitalFeasible: req.feasible,
      freedomAge: freedom.age,
      endingAssets: sim.yearly.length > 0 ? sim.yearly[sim.yearly.length - 1].endAssets : 0,
      minEndAssets: sim.minEndAssets,
      depleted: sim.depleted,
      yearly: sim.yearly,
    };
  }
  return out;
}
