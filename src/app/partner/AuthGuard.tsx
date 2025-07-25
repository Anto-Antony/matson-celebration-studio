
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type AuthGuardProps = {
  children: React.ReactNode;
  requireAuth?: boolean;
};

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    
    if (requireAuth && !user) {
      toast.error("Please log in to access this page");
      navigate("/auth");
    } else if (!requireAuth && user) {
      navigate("/wedding-details");
    }
  }, [user, loading, navigate, requireAuth]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-pink-400"></div>
      </div>
    );
  }

  if ((requireAuth && !user) || (!requireAuth && user)) {
    return null;
  }

  return <>{children}</>;
}
