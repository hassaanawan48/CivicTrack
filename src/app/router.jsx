import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import NotFound from "../pages/NotFound";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";

import CitizenDashboard from "../pages/citizen/CitizenDashboard";
import CreateComplaint from "../pages/citizen/CreateComplaint";

import AuthorityDashboard from "../pages/authority/AuthorityDashboard";
import ComplaintReview from "../pages/authority/ComplaintReview";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Citizen */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["citizen"]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/citizen" element={<CitizenDashboard />} />
        <Route path="/citizen/create" element={<CreateComplaint />} />
      </Route>

      {/* Authority/Admin */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["authority", "admin"]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AuthorityDashboard />} />
        <Route path="/admin/review/:id" element={<ComplaintReview />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;