import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Layout, PageLoader } from "./Layout";

// Feature-based lazy imports
const HomePage = lazy(() => import("@/features/home/pages/HomePage"));
const WizardPage = lazy(() => import("@/features/leads/pages/WizardPage"));
const PaymentPage = lazy(() => import("@/features/payment/pages/PaymentPage"));
const AdminLogin = lazy(() => import("@/features/admin/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("@/features/admin/pages/AdminDashboard"));
const AdminSettings = lazy(() => import("@/features/admin/pages/AdminSettings"));
const ForgotPassword = lazy(() => import("@/features/admin/pages/ForgotPassword"));
const VerifyOtp = lazy(() => import("@/features/admin/pages/VerifyOtp"));
const ResetPassword = lazy(() => import("@/features/admin/pages/ResetPassword"));

// Simple pages (now in features)
const Success = lazy(() => import("@/features/payment/pages/SuccessPage"));
const NotFound = lazy(() => import("@/features/home/pages/NotFoundPage"));

export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Layout>
                <HomePage />
            </Layout>
        ),
    },
    {
        path: "/wizard",
        element: (
            <Layout>
                <WizardPage />
            </Layout>
        ),
    },
    {
        path: "/payment",
        element: (
            <Layout>
                <PaymentPage />
            </Layout>
        ),
    },
    {
        path: "/success",
        element: (
            <Layout>
                <Success />
            </Layout>
        ),
    },
    {
        path: "/admin/login",
        element: (
            <Suspense fallback={<PageLoader />}>
                <AdminLogin />
            </Suspense>
        ),
    },
    {
        path: "/admin/forgot-password",
        element: (
            <Suspense fallback={<PageLoader />}>
                <ForgotPassword />
            </Suspense>
        ),
    },
    {
        path: "/admin/verify-otp",
        element: (
            <Suspense fallback={<PageLoader />}>
                <VerifyOtp />
            </Suspense>
        ),
    },
    {
        path: "/admin/reset-password",
        element: (
            <Suspense fallback={<PageLoader />}>
                <ResetPassword />
            </Suspense>
        ),
    },
    {
        path: "/admin",
        element: <Navigate to="/admin/dashboard" replace />,
    },
    {
        path: "/admin/dashboard",
        element: (
            <Suspense fallback={<PageLoader />}>
                <AdminDashboard />
            </Suspense>
        ),
    },
    {
        path: "/admin/settings",
        element: (
            <Suspense fallback={<PageLoader />}>
                <AdminSettings />
            </Suspense>
        ),
    },
    {
        path: "*",
        element: (
            <Layout>
                <NotFound />
            </Layout>
        ),
    },
]);
