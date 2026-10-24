import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import HomePage from '@/pages/HomePage/HomePage';
import TestsPage from '@/pages/TestsPage/TestsPage';
import TestPage from '@/pages/TestPage/TestPage';
import ResultPage from '@/pages/ResultPage/ResultPage';
import AboutPage from '@/pages/AboutPage/AboutPage';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';
import FinancialFreedomPage from '@/pages/FinancialFreedom/FinancialFreedomPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="tests" element={<TestsPage />} />
        {/* 专用路由必须放在 test/:id 之前，确保优先匹配 */}
        <Route path="test/financial-freedom" element={<FinancialFreedomPage />} />
        <Route path="test/:id" element={<TestPage />} />
        <Route path="result/:id/:attemptId" element={<ResultPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
