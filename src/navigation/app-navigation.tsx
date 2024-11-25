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
            <CompaniesPage />
            /*   <AuthGuard requiredRoles={["companyAdmin", "mainAdmin"]}>
            </AuthGuard> */
          }
        />

        {/* Main Admin-only Routes */}
        <Route
          path="/users"
          element={
            <UsersPage />
            /*  <AuthGuard requiredRoles={["mainAdmin"]}>
            </AuthGuard> */
          }
        />

        {/* Classes (accessible to mainAdmin and branchAdmin) */}
        <Route
          path="/classes"
          element={
            <ClassesPage />
            /* <AuthGuard requiredRoles={["mainAdmin", "branchAdmin"]}>
            </AuthGuard>*/
          }
        />

        {/* Trainers (accessible to mainAdmin and branchAdmin) */}
        <Route
          path="/trainers"
          element={
            <TrainersPage />
            /*  <AuthGuard requiredRoles={["mainAdmin", "branchAdmin"]}>
            </AuthGuard>*/
          }
        />

        <Route path="/trainers/:id" element={<TrainerDetailsPage />} />

        {/* Packages (accessible to mainAdmin and branchAdmin) */}
        <Route
          path="/packages"
          element={
            /*  <AuthGuard requiredRoles={["mainAdmin", "branchAdmin"]}>
          </AuthGuard>*/
            <PackagesPage />
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
