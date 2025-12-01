import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/organisms/Layout";

const Home = lazy(() => import("@/components/pages/Home"));
const Payments = lazy(() => import("@/components/pages/Payments"));
const SendMoney = lazy(() => import("@/components/pages/SendMoney"));
const BillPayments = lazy(() => import("@/components/pages/BillPayments"));
const ScanQR = lazy(() => import("@/components/pages/ScanQR"));
const Recharge = lazy(() => import("@/components/pages/Recharge"));
const History = lazy(() => import("@/components/pages/History"));
const Profile = lazy(() => import("@/components/pages/Profile"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
);

const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: "payments",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Payments />
      </Suspense>
    ),
  },
  {
    path: "payments/send",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <SendMoney />
      </Suspense>
    ),
  },
  {
    path: "payments/bills",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <BillPayments />
      </Suspense>
    ),
  },
  {
    path: "payments/scan",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ScanQR />
      </Suspense>
    ),
  },
  {
    path: "payments/recharge",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Recharge />
      </Suspense>
    ),
  },
  {
    path: "history",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <History />
      </Suspense>
    ),
  },
  {
    path: "profile",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Profile />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFound />
      </Suspense>
    ),
  },
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes],
  },
];

export const router = createBrowserRouter(routes);