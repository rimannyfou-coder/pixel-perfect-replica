import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PrivateRoute } from "@/components/PrivateRoute";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import PasswordReset from "@/pages/auth/PasswordReset";
import Dashboard from "@/pages/dashboard/Dashboard";
import PatientList from "@/pages/patients/PatientList";
import PatientForm from "@/pages/patients/PatientForm";
import PatientDetail from "@/pages/patients/PatientDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/patients" element={<PrivateRoute><PatientList /></PrivateRoute>} />
            <Route path="/patients/new" element={<PrivateRoute><PatientForm /></PrivateRoute>} />
            <Route path="/patients/:id" element={<PrivateRoute><PatientDetail /></PrivateRoute>} />
            <Route path="/patients/:id/edit" element={<PrivateRoute><PatientForm /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
