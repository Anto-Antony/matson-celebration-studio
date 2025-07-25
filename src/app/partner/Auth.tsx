import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AuthGuard from "@/components/AuthGuard";
import { Link } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [weddingTemplate, setWeddingTemplate] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw new Error(`Login failed: ${error.message}`);
        toast.success("Successfully logged in!");
      } else {
        // Client-side validation
        if (step === 1) {
            if (name.length < 2) throw new Error("Partner name must be at least 2 characters");
            if (!email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)) {
              throw new Error("Please enter a valid email address");
            }
            if (phoneNumber.length < 8) throw new Error("Phone number must include country code and be at least 8 characters");
            if (location.length < 2) throw new Error("Location must be at least 2 characters");
            setStep(2);
            setLoading(false);
            return;
        }

        if (step === 2) {
          if (weddingTemplate.length < 2) throw new Error("Wedding template URL must be at least 2 characters");
        }


        const { data: signUpData, error } = await signUp(email, password);
        if (error) throw new Error(`Signup failed: ${error.message} (Code: ${error.code || 'N/A'})`);
        if (!signUpData.user?.id) throw new Error("Signup failed: No user ID returned");

        console.log("Signup successful, user ID:", signUpData.user.id);

        const { error: profileError } = await supabase
          .from("partner_profile")
          .insert([
            {
              partner_id: signUpData.user.id,
              name,
              email,
              phone_number: phoneNumber,
              location,
              wedding_template: weddingTemplate,
            },
          ]);

        if (profileError) throw new Error(`Profile insertion failed: ${profileError.message} (Code: ${profileError.code || 'N/A'})`);

        toast.success("Partner registration successful!");
      }
    } catch (error: { message: string; code?: string; details?: string; stack?: string }) {
      console.error("Auth error:", {
        message: error.message,
        code: error.code,
        details: error.details || "No additional details",
        stack: error.stack,
      });
      toast.error(error.message || "An error occurred during authentication");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black">Matson Wedding</h1>
            <p className="text-black mt-2">Partner portal for client wedding website</p>
          </div>
          
          <Card className="rounded-lg shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-center text-black">
                {isLogin ? "Partner Login" : `Partner Registration - Step ${step}`}
              </CardTitle>
              <CardDescription className="text-center text-black">
                {isLogin 
                  ? "Sign in to manage client wedding details" 
                  : (step === 1 ? "Sign up to start managing client weddings" : "Please provide the wedding template URL")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {isLogin && (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-black">
                        Partner Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="your@email.com"
                        className="border-[#e83385]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium text-black">
                        Password
                      </label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="border-[#e83385]"
                      />
                    </div>
                  </>
                )}
                {!isLogin && step === 1 && (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-black">
                        Partner Name
                      </label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={!isLogin}
                        placeholder="Your full name"
                        className="border-[#e83385]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-black">
                        Partner Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="your@email.com"
                        className="border-[#e83385]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium text-black">
                        Password
                      </label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="border-[#e83385]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phoneNumber" className="text-sm font-medium text-black">
                        Partner Phone Number
                      </label>
                      <Input
                        id="phoneNumber"
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required={!isLogin}
                        placeholder="+1234567890"
                        className="border-[#e83385]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-medium text-black">
                        Partner Location
                      </label>
                      <Input
                        id="location"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required={!isLogin}
                        placeholder="City, Country"
                        className="border-[#e83385]"
                      />
                    </div>
                  </>
                )}
                {!isLogin && step === 2 && (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="weddingTemplate" className="text-sm font-medium text-black">
                        Wedding Template URL
                      </label>
                      <Input
                        id="weddingTemplate"
                        type="text"
                        value={weddingTemplate}
                        onChange={(e) => setWeddingTemplate(e.target.value)}
                        required
                        placeholder="https://example.com/template"
                        className="border-[#e83385]"
                      />
                    </div>
                  </>
                )}
                <Button 
                  type="submit" 
                  className="w-full bg-[#e83385] hover:bg-[#c72b73] text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-dashed border-white"></span>
                      {isLogin ? "Logging in..." : "Registering..."}
                    </span>
                  ) : (
                    isLogin ? "Sign In" : (step === 1 ? "Next" : "Register as Partner")
                  )}
                </Button>
                {!isLogin && step === 2 && (
                  <Button 
                    type="button" 
                    className="w-full mt-2 bg-gray-300 hover:bg-gray-400 text-black"
                    onClick={() => setStep(1)}
                  >
                    Previous
                  </Button>
                )}
              </form>
            </CardContent>
            <CardFooter className="flex flex-col">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setStep(1);
                  setName("");
                  setEmail("");
                  setPassword("");
                  setPhoneNumber("");
                  setLocation("");
                  setWeddingTemplate("");
                }}
                className="text-sm text-[#e83385] hover:underline"
              >
                {isLogin ? "Need a partner account? Register" : "Already a partner? Sign In"}
              </button>
              <Link to="/" className="text-sm text-black hover:underline mt-4">
                Back to Home
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}