import { Routes, Route, Navigate } from "react-router-dom";
import {
  HomePage,
  LoginPage,
  CompaniesPage,
  CompanyDetailsPage,
  TestPage,
  UsersPage,
  ClassesPage,
  TrainersPage,
  TrainerDetailsPage,
  PackagesPage,
  UserDetailsPage,
  UnauthorizedPage,
  RoleManagementPage,
  ReportsPage,
} from "pages";
import AppLayout from "components/layout/Layout";
import AuthGuard from "components/guards/AuthGuard";

const AppNavigation = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<LoginPage />} />

      {/* Protected Routes within the App Layout */}
      <Route
        element={
          <AuthGuard requiredRoles={["COMPANY_ADMIN", "ADMIN", "BRANCH_ADMIN"]}>
            <AppLayout />
          </AuthGuard>
        }
      >
        {/* Home Page (accessible to all authenticated users) */}

        <Route
          path="/"
          element={
            <AuthGuard
              requiredRoles={["COMPANY_ADMIN", "ADMIN", "BRANCH_ADMIN"]}
            >
              <HomePage />
            </AuthGuard>
          }
        />

        <Route
          path="/role-management"
          element={
            <AuthGuard requiredRoles={["ADMIN", "COMPANY_ADMIN"]}>
              <RoleManagementPage />
            </AuthGuard>
          }
        />

        {/* Company Admin-only Routes */}
        <Route
          path="/companies"
          element={
            <AuthGuard requiredRoles={["ADMIN"]}>
              <CompaniesPage />
            </AuthGuard>
          }
        />

        <Route
          path="/companies/:id"
          element={
            <AuthGuard
              requiredRoles={["ADMIN", "COMPANY_ADMIN", "BRANCH_ADMIN"]}
            >
              <CompanyDetailsPage />
            </AuthGuard>
          }
        />

        <Route
          path="/users"
          element={
            <AuthGuard
              requiredRoles={["ADMIN", "BRANCH_ADMIN", "COMPANY_ADMIN"]}
            >
              <UsersPage />
            </AuthGuard>
          }
        />

        <Route
          path="/users/:id"
          element={
            <AuthGuard
              requiredRoles={["ADMIN", "COMPANY_ADMIN", "BRANCH_ADMIN"]}
            >
              <UserDetailsPage />
            </AuthGuard>
          }
        />

        <Route
          path="/sessions/:date?"
          element={
            <AuthGuard
              requiredRoles={["ADMIN", "COMPANY_ADMIN", "BRANCH_ADMIN"]}
            >
              <ClassesPage />
            </AuthGuard>
          }
        />

        <Route
          path="/trainers"
          element={
            <AuthGuard
              requiredRoles={["ADMIN", "COMPANY_ADMIN", "BRANCH_ADMIN"]}
            >
              <TrainersPage />
            </AuthGuard>
          }
        />

        <Route
          path="/trainers/:id"
          element={
            <AuthGuard
              requiredRoles={["ADMIN", "COMPANY_ADMIN", "BRANCH_ADMIN"]}
            >
              <TrainerDetailsPage />
            </AuthGuard>
          }
        />

        <Route
          path="/packages"
          element={
            <AuthGuard
              requiredRoles={["ADMIN", "COMPANY_ADMIN", "BRANCH_ADMIN"]}
            >
              <PackagesPage />
            </AuthGuard>
          }
        />

        <Route
          path="/reports"
          element={
            <AuthGuard
              requiredRoles={["ADMIN", "COMPANY_ADMIN", "BRANCH_ADMIN"]}
            >
              <ReportsPage />
            </AuthGuard>
          }
        />
        {/* Test Page (publicly accessible or add roles as needed) */}
        <Route path="/test" element={<TestPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Redirect for non-existent routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
};

export default AppNavigation;