import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Jobs from "@/pages/Jobs";
import JobDetails from "@/pages/JobDetails";
import Apply from "@/pages/Apply";
import NotFound from "@/pages/NotFound";
import CandidateDashboard from "@/pages/candidate/Dashboard";
import MyApplications from "@/pages/candidate/MyApplications";
import Profile from "@/pages/candidate/Profile";
import AdminDashboard from "@/pages/admin/Dashboard";
import CreateJob from "@/pages/admin/CreateJob";
import ManageJobs from "@/pages/admin/ManageJobs";
import EditJob from "@/pages/admin/EditJob";
import Applicants from "@/pages/admin/Applicants";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/jobs/:id" element={<JobDetails />} />

      <Route
        path="/jobs/:id/apply"
        element={
          <ProtectedRoute role="USER">
            <Apply />
          </ProtectedRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute role="USER">
            <DashboardLayout variant="candidate" />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<CandidateDashboard />} />
        <Route path="/dashboard/applications" element={<MyApplications />} />
        <Route path="/dashboard/profile" element={<Profile />} />
      </Route>

      <Route
        element={
          <ProtectedRoute role="ADMIN">
            <DashboardLayout variant="admin" />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/jobs/new" element={<CreateJob />} />
        <Route path="/admin/jobs" element={<ManageJobs />} />
        <Route path="/admin/jobs/:id/edit" element={<EditJob />} />
        <Route path="/admin/jobs/:id/applicants" element={<Applicants />} />
      </Route>

      <Route path="/admin-home" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
