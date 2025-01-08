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
      <Route element={<AppLayout />}>
        {/* Home Page (accessible to all authenticated users) */}

        <Route
          path="/"
          element={
            <AuthGuard requiredRoles={["COMPANY_ADMIN", "ADMIN"]}>
              <HomePage />
            </AuthGuard>
          }
        />

        <Route
          path="/role-management"
          element={
            <AuthGuard requiredRoles={["ADMIN"]}>
              <RoleManagementPage />
            </AuthGuard>
          }
        />

        {/* Company Admin-only Routes */}
        <Route
          path="/companies"
          element={
            <AuthGuard requiredRoles={["COMPANY_ADMIN", "ADMIN"]}>
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
          path="/classes"
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
