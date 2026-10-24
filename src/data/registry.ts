// 测试注册表：汇总全部 25 套测试
// EXPORTS: ALL_TESTS, getTest
import type { ITestDef, TestResult } from '@/data/types';
import { BIGFIVE_TEST, PF16_TEST, HEXACO_TEST, EPQ_TEST, ATTACHMENT_TEST, EQ_TEST } from './tests/academic';
import { MBTI_TEST, ENNEAGRAM_TEST, DISC_TEST, KEIRSEY_TEST, GALLUP_TEST } from './tests/popular';
import { COLOR_TEST, ANIMAL_TEST } from './tests/fun';
import { RIASEC_TEST, TEMPERAMENT_TEST, SES_TEST, SAS_TEST, SDS_TEST } from './tests/academic2';
import {
  FPA_TEST,
  PDP_TEST,
  BELBIN_TEST,
  LOVE_LANGUAGE_TEST,
  PROCRAST_TEST,
  AQ_TEST,
  LOT_TEST,
} from './tests/popular2';

/**
 * 财务自由计算器 —— 特殊占位条目。
 * 它不在普通 TestPage 运行，而是由 app.tsx 的专用路由 /test/financial-freedom 接管，
 * 进入 src/pages/FinancialFreedom/ 独立流程。这里仅用于在首页 / 全部测试页露出卡片。
 */
const FF_PLANNER: ITestDef = {
  id: 'financial-freedom',
  name: '财务自由计算器',
  category: 'finance',
  desc: '算清你想过怎样的一生，以及需要多少财务底气。从生活需求、人生目标到未来现金流，规划属于你的财务自由数字。',
  time: '7-10 分钟',
  trust: '财务规划工具',
  icon: 'TrendingUp',
  module: 'FINANCIAL PLANNER',
  isNew: true,
  kind: 'dimension',
  questions: [],
  compute: (): TestResult => ({
    kind: 'dimension',
    summary: '财务自由计算器在独立流程中运行',
    dimensions: [],
    tags: [],
    disclaimer: '本工具基于个人输入与情景假设进行模拟，不构成投资建议。',
  }),
};

export const ALL_TESTS: ITestDef[] = [
  FF_PLANNER,
  BIGFIVE_TEST,
  PF16_TEST,
  HEXACO_TEST,
  EPQ_TEST,
  ATTACHMENT_TEST,
  EQ_TEST,
  MBTI_TEST,
  ENNEAGRAM_TEST,
  DISC_TEST,
  KEIRSEY_TEST,
  GALLUP_TEST,
  COLOR_TEST,
  ANIMAL_TEST,
  RIASEC_TEST,
  TEMPERAMENT_TEST,
  SES_TEST,
  SAS_TEST,
  SDS_TEST,
  FPA_TEST,
  PDP_TEST,
  BELBIN_TEST,
  LOVE_LANGUAGE_TEST,
  PROCRAST_TEST,
  AQ_TEST,
  LOT_TEST,
];

export function getTest(id: string): ITestDef | undefined {
  return ALL_TESTS.find((t) => t.id === id);
}
