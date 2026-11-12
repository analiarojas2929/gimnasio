
import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import App from "./App.jsx";
import { authService } from "./services/authService.js";

const DashboardLayout = lazy(() => import("./layouts/DashboardLayout.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const UserDashboard = lazy(() => import("./pages/UserDashboard.jsx"));
const MyRoutines = lazy(() => import("./pages/MyRoutines.jsx"));
const WeightTracker = lazy(() => import("./pages/WeightTracker.jsx"));
const MyProgress = lazy(() => import("./pages/MyProgress.jsx"));
const WorkoutCalendar = lazy(() => import("./pages/WorkoutCalendar.jsx"));
const MyProfile = lazy(() => import("./pages/MyProfile.jsx"));

function RequireDemoSession({ children }) {
  return authService.getCurrentUser()
    ? children
    : <Navigate to="/login" replace />;
}

export default function PortalApp() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-ink text-sm text-white/55">
            Cargando FitZone...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<App />} />

          <Route path="/admin" element={<App />} />

          <Route path="/login" element={<Login />} />

          <Route path="/registro" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <RequireDemoSession>
                <DashboardLayout />
              </RequireDemoSession>
            }
          >
            <Route index element={<UserDashboard />} />
            <Route path="rutinas" element={<MyRoutines />} />
            <Route path="peso" element={<WeightTracker />} />
            <Route path="progreso" element={<MyProgress />} />
            <Route path="calendario" element={<WorkoutCalendar />} />
            <Route path="perfil" element={<MyProfile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
