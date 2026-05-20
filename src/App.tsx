import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/index";
import Explore from "./pages/Explore.tsx";
import ServiceDetail from "./pages/ServiceDetail.tsx";
import JoyMap from "./pages/JoyMap.tsx";
import ProviderDashboard from "./pages/ProviderDashboard.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import Calendar from "./pages/Calendar.tsx";
import PaymentSuccess from "./pages/PaymentSuccess.tsx";
import Profile from "./pages/Profile.tsx";
import Corporate from "./pages/Corporate.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import RequireAuth from "@/features/auth/components/RequireAuth";
import { useAuthMe } from "@/features/auth/hooks/useAuthMe";
import { queryClient } from "@/shared/lib/query-client";

const SessionBootstrap = () => {
  useAuthMe();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SessionBootstrap />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/corporate" element={<Corporate />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route
            path="/joy-map"
            element={
              <RequireAuth roles={["CUSTOMER"]}>
                <JoyMap />
              </RequireAuth>
            }
          />
          <Route
            path="/provider"
            element={
              <RequireAuth roles={["PROVIDER"]}>
                <ProviderDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAuth roles={["MANAGER", "ADMIN"]}>
                <AdminDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/calendar"
            element={
              <RequireAuth>
                <Calendar />
              </RequireAuth>
            }
          />
          <Route
            path="/payments/success"
            element={
              <RequireAuth>
                <PaymentSuccess />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
