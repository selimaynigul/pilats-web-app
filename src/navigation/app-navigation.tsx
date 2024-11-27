import { Routes, Route, Navigate } from "react-router-dom";
import {
  HomePage,
  LoginPage,
  CompaniesPage,
  TestPage,
  UsersPage,
  ClassesPage,
  TrainersPage,
  TrainerDetailsPage,
  PackagesPage,
} from "pages";
import AppLayout from "components/layout/Layout";
import AuthGuard from "components/guards/AuthGuard";

const AppNavigation = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes within the App Layout */}
      <Route element={<AppLayout />}>
        {/* Home Page (accessible to all authenticated users) */}
        <Route path="/" element={<HomePage />} />

        {/* Company Admin-only Routes */}
        <Route
          path="/companies"
          element={
            <AuthGuard requiredRoles={["COMPANY_ADMIN", "ADMIN"]}>
              <CompaniesPage />
            </AuthGuard>
          }
        />

        {/* Main Admin-only Routes */}
        <Route
          path="/users"
          element={
            <AuthGuard requiredRoles={["ADMIN"]}>
              <UsersPage />
            </AuthGuard>
          }
        />

        {/* Classes (accessible to ADMIN and BRANCH_ADMIN) */}
        <Route
          path="/classes"
          element={
            <AuthGuard requiredRoles={["ADMIN", "BRANCH_ADMIN"]}>
              <ClassesPage />
            </AuthGuard>
          }
        />

        {/* Trainers (accessible to ADMIN and BRANCH_ADMIN) */}
        <Route
          path="/trainers"
          element={
            <AuthGuard requiredRoles={["ADMIN", "BRANCH_ADMIN"]}>
              <TrainersPage />
            </AuthGuard>
          }
        />

        <Route path="/trainers/:id" element={<TrainerDetailsPage />} />

        {/* Packages (accessible to ADMIN and BRANCH_ADMIN) */}
        <Route
          path="/packages"
          element={
            <AuthGuard requiredRoles={["ADMIN", "BRANCH_ADMIN"]}>
              <PackagesPage />
            </AuthGuard>
          }
        />

        {/* Test Page (publicly accessible or add roles as needed) */}
        <Route path="/test" element={<TestPage />} />
        <Route path="/unauthorized" element={<TestPage />} />

        {/* Redirect for non-existent routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
};

export default AppNavigation;
