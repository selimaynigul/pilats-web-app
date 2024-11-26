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
            <AuthGuard requiredRoles={["companyAdmin", "mainAdmin"]}>
              <CompaniesPage />
            </AuthGuard>
          }
        />

        {/* Main Admin-only Routes */}
        <Route
          path="/users"
          element={
            <AuthGuard requiredRoles={["mainAdmin"]}>
              <UsersPage />
            </AuthGuard>
          }
        />

        {/* Classes (accessible to mainAdmin and branchAdmin) */}
        <Route
          path="/classes"
          element={
            <AuthGuard requiredRoles={["mainAdmin", "branchAdmin"]}>
              <ClassesPage />
            </AuthGuard>
          }
        />

        {/* Trainers (accessible to mainAdmin and branchAdmin) */}
        <Route
          path="/trainers"
          element={
            <AuthGuard requiredRoles={["mainAdmin", "branchAdmin"]}>
              <TrainersPage />
            </AuthGuard>
          }
        />

        <Route path="/trainers/:id" element={<TrainerDetailsPage />} />

        {/* Packages (accessible to mainAdmin and branchAdmin) */}
        <Route
          path="/packages"
          element={
            <AuthGuard requiredRoles={["mainAdmin", "branchAdmin"]}>
              <PackagesPage />
            </AuthGuard>
          }
        />

        {/* Test Page (publicly accessible or add roles as needed) */}
        <Route path="/test" element={<TestPage />} />

        {/* Redirect for non-existent routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
};

export default AppNavigation;
