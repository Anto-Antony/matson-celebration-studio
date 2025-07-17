import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Gallery from "./pages/Gallery";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Website from "./pages/website";
import Login from "./pages/Login";
import CompanyDashboard from "./pages/CompanyDashboard";
import PartnerDashboard from "./pages/PartnerDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<><About /><Footer /></>} />
              <Route path="/services" element={<><Services /><Footer /></>} />
              <Route path="/gallery" element={<><Gallery /><Footer /></>} />
              <Route path="/website" element={<><Website /><Footer /></>} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard/company" element={<CompanyDashboard />} />
              <Route path="/partner/:id" element={<PartnerDashboard />} />
              {/* <Route path="/testimonials" element={<><Testimonials /><Footer /></>} /> */}
              <Route path="/contact" element={<><Contact /><Footer /></>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
