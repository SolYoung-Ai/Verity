/**
 * useFFPlan：管理财务自由计算器的 FFPlan 状态。
 * - 自动持久化到 localStorage（key: verity-ff-plan）
 * - 进入页面时自动恢复上次填写
 * - 提供 update / updateAsset 局部更新
 * - loadDemo() 载入示例数据并打开 demo 横幅
 * - reset() 清空并确认后清除本地缓存
 */
import { useCallback, useEffect, useState } from 'react';
import type { FFPlan, FinancialAssets } from '@/financial-freedom/types';
import { createDemoPlan, DEFAULT_CURRENCY, DEFAULT_EMERGENCY_MONTHS } from '@/financial-freedom/defaults';

export const FF_STORAGE_KEY = 'verity-ff-plan';

export type FFMode = 'quick' | 'deep';

/** 空白计划：金额与数组全部为空 / 0，选择项默认 unknown。不替用户假设任何数字。 */
export function createBlankPlan(): FFPlan {
  return {
    currentAge: 0,
    targetAge: 0,
    planningEndAge: 90,
    householdType: 'unknown',
    monthlyNetIncome: 0,
    additionalIncomeSources: [],
    monthlyCurrentSpending: 0,
    expenseCategories: [],
    financialAssets: {
      cash: 0,
      investable: 0,
      retirement: 0,
      restricted: 0,
      emergencyFund: 0,
      primaryHomeValue: 0,
      other: 0,
    },
    debts: [],
    monthlyLongTermContribution: 0,
    annualInvestmentContribution: 0,
    basicMonthlyBudget: 0,
    comfortableMonthlyBudget: 0,
    idealMonthlyBudget: 0,
    lifeGoals: [],
    futureIncomeSources: [],
    contributionGrowth: 'inflation',
    emergencyMonths: DEFAULT_EMERGENCY_MONTHS,
    initialWR: 0.03,
    currency: DEFAULT_CURRENCY,
    lifePriorities: [],
    preferredWorkStyle: 'unknown',
    freedomDefinition: 'unknown',
    topLifePriorities: [],
  };
}

interface PersistedShape {
  plan: FFPlan;
  mode: FFMode;
}

function readStored(): PersistedShape | null {
  try {
    const raw = window.localStorage.getItem(FF_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedShape;
    if (!parsed || !parsed.plan || typeof parsed.plan.currentAge !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}

export interface UseFFPlan {
  plan: FFPlan;
  mode: FFMode;
  /** 是否已从本地缓存恢复过（用于决定欢迎页是否显示「继续上次」） */
  restored: boolean;
  demoMode: boolean;
  setMode: (m: FFMode) => void;
  update: (patch: Partial<FFPlan>) => void;
  updateAsset: (key: keyof FinancialAssets, value: number) => void;
  loadDemo: () => void;
  reset: () => void;
  clearStorage: () => void;
}

export function useFFPlan(): UseFFPlan {
  const [state, setState] = useState<PersistedShape>(() => {
    const stored = readStored();
    return stored ?? { plan: createBlankPlan(), mode: 'quick' };
  });
  const [restored] = useState<boolean>(() => readStored() !== null);

  useEffect(() => {
    try {
      window.localStorage.setItem(FF_STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* 存储满 / 隐私模式下静默失败 */
    }
  }, [state]);

  const setMode = useCallback((mode: FFMode) => {
    setState((s) => ({ ...s, mode }));
  }, []);

  const update = useCallback((patch: Partial<FFPlan>) => {
    setState((s) => ({ ...s, plan: { ...s.plan, ...patch } }));
  }, []);

  const updateAsset = useCallback((key: keyof FinancialAssets, value: number) => {
    setState((s) => ({
      ...s,
      plan: { ...s.plan, financialAssets: { ...s.plan.financialAssets, [key]: value } },
    }));
  }, []);

  const loadDemo = useCallback(() => {
    setState({ plan: createDemoPlan(), mode: 'deep' });
  }, []);

  const reset = useCallback(() => {
    setState({ plan: createBlankPlan(), mode: 'quick' });
  }, []);

  const clearStorage = useCallback(() => {
    try {
      window.localStorage.removeItem(FF_STORAGE_KEY);
    } catch {
      /* noop */
    }
    setState({ plan: createBlankPlan(), mode: 'quick' });
  }, []);

  return {
    plan: state.plan,
    mode: state.mode,
    restored,
    demoMode: state.plan.demoMode === true,
    setMode,
    update,
    updateAsset,
    loadDemo,
    reset,
    clearStorage,
  };
}
