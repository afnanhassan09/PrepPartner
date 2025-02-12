import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Layout from "./components/Layout";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Auth from "./pages/Auth";
import InterviewPage from "./pages/interview";
import DashboardLayout from "./components/DashboardLayout";
const queryClient = new QueryClient();

// Update the DashboardLayout wrapper
const DashboardLayoutWrapper = () => (
  <DashboardLayout>
    <Outlet />
  </DashboardLayout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes with standard layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/auth" element={<Auth />} />
          </Route>

          {/* Dashboard routes with dashboard layout */}
          <Route element={<DashboardLayoutWrapper />}>
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/dashboard" element={<NotFound />} />
            <Route path="/history" element={<NotFound />} />
            <Route path="/settings" element={<NotFound />} />
            <Route path="/profile" element={<NotFound />} />
    
            {/* Add more dashboard routes here */}
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
