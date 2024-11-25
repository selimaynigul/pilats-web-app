/* // routes/routes.tsx

import React, { lazy, Suspense } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import MainLayout from "../components/layouts/MainLayout";
import AuthLayout from "../components/layouts/AuthLayout";
import AdminLayout from "../components/layouts/AdminLayout";
import AuthGuard from "../components/guards/AuthGuard";
import AdminGuard from "../components/guards/AdminGuard";
import LoadingScreen from "../components/LoadingScreen";

// Lazy load pages to improve initial load performance
const DashboardPage = lazy(() => import("../pages/Dashboard/DashboardPage"));
const ProfilePage = lazy(() => import("../pages/Profile/ProfilePage"));
const LoginPage = lazy(() => import("../pages/Auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/Auth/RegisterPage"));
const InternshipList = lazy(() => import("../pages/Internship/InternshipList"));
const InternshipDetail = lazy(
  () => import("../pages/Internship/InternshipDetail")
);

const routes: RouteObject[] = [
  {
    path: "/auth",
    element: <AuthLayout />, // Layout for authentication pages
    children: [
      {
        path: "login",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <RegisterPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/",
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ), // Authenticated routes under MainLayout
    children: [
      { path: "/", element: <Navigate to="/dashboard" replace /> },
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: "profile",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <ProfilePage />
          </Suspense>
        ),
      },
      {
        path: "internships",
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <InternshipList />
              </Suspense>
            ),
          },
          {
            path: ":internshipId",
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <InternshipDetail />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <AdminGuard>
        <AdminLayout />
      </AdminGuard>
    ), // Admin-specific routes
    children: [
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      // Other admin routes can be added here
    ],
  },
  { path: "*", element: <Navigate to="/404" replace /> }, // Redirect unknown paths to 404
];

export default routes;
 */

export {};
