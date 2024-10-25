import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage, LoginPage, CompaniesPage, TestPage, UsersPage } from "pages";
import AppLayout from "components/Layout";

const AppNavigation = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
};

export default AppNavigation;
