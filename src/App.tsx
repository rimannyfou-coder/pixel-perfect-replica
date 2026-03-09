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
import ConsultationList from "@/pages/consultations/ConsultationList";
import ConsultationForm from "@/pages/consultations/ConsultationForm";
import ConsultationDetail from "@/pages/consultations/ConsultationDetail";
import FactureList from "@/pages/facturation/FactureList";
import FactureDetail from "@/pages/facturation/FactureDetail";
import ArticleList from "@/pages/inventaire/ArticleList";
import MouvementStockPage from "@/pages/inventaire/MouvementStockPage";
import RendezVousList from "@/pages/rendezvous/RendezVousList";
import Rapports from "@/pages/rapports/Rapports";
import Settings from "@/pages/settings/Settings";
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
            <Route path="/consultations" element={<PrivateRoute><ConsultationList /></PrivateRoute>} />
            <Route path="/consultations/new" element={<PrivateRoute><ConsultationForm /></PrivateRoute>} />
            <Route path="/consultations/:id" element={<PrivateRoute><ConsultationDetail /></PrivateRoute>} />
            <Route path="/facturation" element={<PrivateRoute><FactureList /></PrivateRoute>} />
            <Route path="/facturation/:id" element={<PrivateRoute><FactureDetail /></PrivateRoute>} />
            <Route path="/inventaire" element={<PrivateRoute><ArticleList /></PrivateRoute>} />
            <Route path="/inventaire/mouvements" element={<PrivateRoute><MouvementStockPage /></PrivateRoute>} />
            <Route path="/rendezvous" element={<PrivateRoute><RendezVousList /></PrivateRoute>} />
            <Route path="/rapports" element={<PrivateRoute><Rapports /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
