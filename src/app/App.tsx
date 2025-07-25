import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "@/app/public/components/Footer";
import Index from "@/app/public/Index";
import About from "@/app/public/About";
import Services from "@/app/public/Services";
import Gallery from "@/app/public/Gallery";
import Testimonials from "@/app/public/Testimonials";
import Contact from "@/app/public/Contact";
import NotFound from "@/app/public/NotFound";
import Website from "@/app/public/website";


// Admin imports
import AdminLogin from "./admin/login/page";
import AdminLayout from "./admin/layout";
import CreateUser from "./admin/create-user/page";
import ManageCoupleUsers from "./admin/manage-couple-users/page";
import ManagePartnerUsers from "./admin/manage-partner-users/page";
import Welcome from "./admin/page";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-background flex flex-col">
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<><About /><Footer /></>} />
              <Route path="/services" element={<><Services /><Footer /></>} />
              <Route path="/gallery" element={<><Gallery /><Footer /></>} />
              <Route path="/website" element={<><Website /><Footer /></>} />
              {/* <Route path="/testimonials" element={<><Testimonials /><Footer /></>} /> */}
              {/* Admin Login Route */}
              <Route path="/admin/login" element={<AdminLogin />} />
              {/* Admin Dashboard Routes */}
              <Route path="/admin" element={
                <AdminLayout>
                  <Welcome />
                </AdminLayout>
              } />
              <Route path="/admin/create-user" element={
                <AdminLayout>
                  <CreateUser />
                </AdminLayout>
              } />
              <Route path="/admin/manage-couple-users" element={
                <AdminLayout>
                  <ManageCoupleUsers />
                </AdminLayout>
              } />
              <Route path="/admin/manage-partner-users" element={
                <AdminLayout>
                  <ManagePartnerUsers />
                </AdminLayout>
              } />
              <Route path="/contact" element={<><Contact /><Footer /></>} />
              {/* Uncomment and implement these routes after completing the components */}
              {/**
              <Route path="/admin/*" element={<AdminLayout />} />
              <Route path="/partner/*" element={<PartnerLayout />} />
              <Route path="/wedding/*" element={<WeddingLayout />} />
              */}
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
