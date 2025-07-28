import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { lazy, Suspense } from "react";
import PublicLayout from "@/app/public/layout";
import Index from "@/app/public/Index";
import NotFound from "@/app/public/NotFound";

// Lazy load heavy components
const About = lazy(() => import("./public/About"));
const Gallery = lazy(() => import("./public/Gallery"));
const Contact = lazy(() => import("./public/Contact"));
const Website = lazy(() => import("./public/website"));

// Import login page directly for now
import PublicLogin from "./public/login/page";

// Wedding imports (lazy loaded)
const WeddingLogin = lazy(() => import("./wedding/login/page"));
const WeddingRegister = lazy(() => import("./wedding/register/page"));
const WeddingDashboard = lazy(() => import("./wedding/dashboard/page"));
const WeddingLayout = lazy(() => import("./wedding/layout"));

// Admin imports (lazy loaded)
const AdminLogin = lazy(() => import("./admin/login/page"));
const AdminLayout = lazy(() => import("./admin/layout"));
const CreateUser = lazy(() => import("./admin/create-user/page"));
const ManageCoupleUsers = lazy(() => import("./admin/manage-couple-users/page"));
const ManagePartnerUsers = lazy(() => import("./admin/manage-partner-users/page"));
const Welcome = lazy(() => import("./admin/page"));

// Partner imports (lazy loaded)
const PartnerAuth = lazy(() => import("./partner/Auth"));
const PartnerLayout = lazy(() => import("./partner/Layout"));
const PartnerIndex = lazy(() => import("./partner/Index"));
const PartnerWeddingDetails = lazy(() => import("./partner/WeddingDetails"));
const PartnerNotFound = lazy(() => import("./partner/NotFound"));
const PartnerWelcome = lazy(() => import("./partner/Welcome"));
const PartnerManageClients = lazy(() => import("./partner/ManageClients"));

const queryClient = new QueryClient();

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-pink-400"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="min-h-screen bg-background flex flex-col">
            <main className="flex-1">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* Public Routes with Navbar */}
                  <Route path="/" element={
                    <PublicLayout>
                      <Index />
                    </PublicLayout>
                  } />
                  <Route path="/about" element={
                    <PublicLayout>
                      <About />
                    </PublicLayout>
                  } />
                  <Route path="/gallery" element={
                    <PublicLayout>
                      <Gallery />
                    </PublicLayout>
                  } />
                  
                  <Route path="/contact" element={
                    <PublicLayout>
                      <Contact />
                    </PublicLayout>
                  } />
                  <Route path="/website" element={
                    <PublicLayout>
                      <Website />
                    </PublicLayout>
                  } />
                  <Route path="/login" element={<PublicLogin />} />
                  
                  {/* Wedding Routes */}
                  <Route path="/wedding/login" element={<WeddingLogin />} />
                  <Route path="/wedding/register" element={<WeddingRegister />} />
                  <Route path="/wedding/dashboard" element={
                    <WeddingLayout>
                      <WeddingDashboard />
                    </WeddingLayout>
                  } />
                  
                  {/* Partner Routes */}
                  <Route path="/partner" element={
                    <PartnerLayout>
                      <PartnerWelcome />
                    </PartnerLayout>
                  } />
                  <Route path="/partner/auth" element={<PartnerAuth />} />
                  <Route path="/partner/dashboard" element={
                    <PartnerLayout>
                      <PartnerWelcome />
                    </PartnerLayout>
                  } />
                  <Route path="/partner/wedding-details" element={
                    <PartnerLayout>
                      <PartnerWeddingDetails />
                    </PartnerLayout>
                  } />
                  <Route path="/partner/manage-clients" element={
                    <PartnerLayout>
                      <PartnerManageClients />
                    </PartnerLayout>
                  } />
                  
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
                  
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;