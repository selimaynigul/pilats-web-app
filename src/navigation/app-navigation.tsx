import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage, LoginPage } from "pages";

const AppNavigation = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppNavigation;
