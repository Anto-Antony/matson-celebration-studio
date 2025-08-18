import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { lazy, Suspense } from "react";
import { WeddingProvider } from "./wedding/contexts/WeddingProvider";
import AuthGuard from "./partner/auth/AuthGuard";
import PublicLayout from "@/app/public/layout";
import Index from "@/app/public/Index";
import NotFound from "@/app/public/NotFound";

// Lazy load heavy components
const Gallery = lazy(() => import("./public/Gallery"));
const Website = lazy(() => import("./public/website"));
const WeddingEdit = lazy(() => import("./wedding/edit/page"));
const PartnerReports = lazy(() => import("./partner/Reports"));

// Import login page directly for now
import PublicLogin from "./public/login/page";

// Wedding imports (lazy loaded)
const WeddingLayout = lazy(() => import("./wedding/layout"));

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

// Wedding routes with WeddingProvider
const WeddingRoutes = () => (
  <WeddingProvider>
    <Routes>
      <Route
        path="/edit"
        element={
          <WeddingLayout>
            <WeddingEdit />
          </WeddingLayout>
        }
      />
      {/* Add other wedding routes here */}
    </Routes>
  </WeddingProvider>
);

// Public routes without any provider
const PublicRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <PublicLayout>
          <Index />
        </PublicLayout>
      }
    />
    <Route
      path="/gallery"
      element={
        <PublicLayout>
          <Gallery />
        </PublicLayout>
      }
    />
    <Route
      path="/website"
      element={
        <PublicLayout>
          <Website />
        </PublicLayout>
      }
    />
    <Route
      path="/login"
      element={
        <PublicLayout>
          <PublicLogin />
        </PublicLayout>
      }
    />
  </Routes>
);

// Partner routes with AuthGuard for role-based access
const PartnerRoutes = () => {
  return (
    <Routes>
      {/* Public auth route */}
      <Route
        path="/auth"
        element={
          <AuthGuard requireAuth={false}>
            <PartnerAuth />
          </AuthGuard>
        }
      />

      {/* Protected routes - only accessible to partners */}
      <Route
        path="/"
        element={
          <AuthGuard requiredRole="partner">
            <PartnerLayout>
              <PartnerWelcome />
            </PartnerLayout>
          </AuthGuard>
        }
      />

      <Route
        path="/dashboard"
        element={
          <AuthGuard requiredRole="partner">
            <PartnerLayout>
              <PartnerWelcome />
            </PartnerLayout>
          </AuthGuard>
        }
      />

      <Route
        path="/wedding-details"
        element={
          <AuthGuard requiredRole="partner">
            <PartnerLayout>
              <PartnerWeddingDetails />
            </PartnerLayout>
          </AuthGuard>
        }
      />

      <Route
        path="/manage-clients"
        element={
          <AuthGuard requiredRole="partner">
            <PartnerLayout>
              <PartnerManageClients />
            </PartnerLayout>
          </AuthGuard>
        }
      />

      <Route
        path="/reports"
        element={
          <AuthGuard requiredRole="partner">
            <PartnerLayout>
              <PartnerReports />
            </PartnerLayout>
          </AuthGuard>
        }
      />

      {/* Catch-all route */}
      <Route
        path="*"
        element={
          <AuthGuard requiredRole="partner">
            <PartnerLayout>
              <PartnerNotFound />
            </PartnerLayout>
          </AuthGuard>
        }
      />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className="min-h-screen bg-background flex flex-col">
            <main className="flex-1">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/*" element={<PublicRoutes />} />

                  {/* Wedding Routes */}
                  <Route path="/wedding/*" element={<WeddingRoutes />} />

                  {/* Partner Routes */}
                  <Route path="/partner/*" element={<PartnerRoutes />} />

                  {/* 404 - Not Found */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
