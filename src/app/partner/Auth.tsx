import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AuthGuard from "./auth/AuthGuard";
import { Link } from "react-router-dom";
import { Heart, Sparkles, ArrowLeft, ArrowRight, Mail, Lock, User, Phone, MapPin, Globe, Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { data: signInData, error } = await signIn(email, password);
        if (error) throw new Error(`Login failed: ${error.message}`);
        if (!signInData.user) throw new Error("Login failed: No user returned");

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", signInData.user.id)
          .single();

        if (profileError) throw new Error(`Failed to fetch user role: ${profileError.message}`);
        if (profile.role !== "partner" && profile.role !== "admin") {
          await supabase.auth.signOut();
          throw new Error("not a partner or admin");
        }

        const { data: partnerProfile, error: partnerProfileError } = await supabase
          .from("partner_profile")
          .select("verified")
          .eq("partner_id", signInData.user.id)
          .single();

        if (partnerProfileError) throw new Error(`Failed to fetch partner profile: ${partnerProfileError.message}`);
        if (!partnerProfile.verified) {
          await supabase.auth.signOut();
          throw new Error("not verified");
        }

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
        if (error) throw new Error(`Signup failed: ${error.message}`);
        if (!signUpData.user?.id) throw new Error("Signup failed: No user ID returned");

        console.log("Signup successful, user ID:", signUpData.user.id);

        // Insert into partner_profile table
        const { error: profileError } = await supabase
          .from("partner_profile")
          .insert([
            {
              partner_id: signUpData.user.id,
              name,
              email,
              phone_number: phoneNumber,
              location,
            },
          ]);

        if (profileError) throw new Error(`Profile insertion failed: ${profileError.message}`);

        // Insert into the new profiles table with role 'partner'
        const { error: profilesError } = await supabase
          .from("profiles")
          .insert([
            {
              id: signUpData.user.id,
              role: "partner",
            },
          ]);

        if (profilesError) throw new Error(`Profiles insertion failed: ${profilesError.message}`);

        toast.success("Partner registration successful!");
      }
    } catch (error: any) {
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg mr-3">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Matson Wedding
              </h1>
            </div>
            <p className="text-gray-600">Partner portal for client wedding website</p>
          </div>
          
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-gray-200/50 shadow-xl">
            <CardHeader className="pb-6">
              <div className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {isLogin ? "Welcome Back" : `Partner Registration`}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {isLogin 
                    ? "Sign in to manage client wedding details" 
                    : (step === 1 ? "Step 1: Basic Information" : "Step 2: Template Details")}
                </CardDescription>
                {!isLogin && (
                  <div className="flex items-center justify-center mt-4 space-x-2">
                    <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                    <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {isLogin && (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-500" />
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="your@email.com"
                        className="bg-white/50 border-gray-200 focus:bg-white focus:border-purple-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center">
                        <Lock className="w-4 h-4 mr-2 text-gray-500" />
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder="••••••••"
                          className="bg-white/50 border-gray-200 focus:bg-white focus:border-purple-500 transition-colors pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-100"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
                
                {!isLogin && step === 1 && (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-500" />
                        Full Name
                      </label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Your full name"
                        className="bg-white/50 border-gray-200 focus:bg-white focus:border-purple-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-500" />
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="your@email.com"
                        className="bg-white/50 border-gray-200 focus:bg-white focus:border-purple-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700 flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-500" />
                        Phone Number
                      </label>
                      <Input
                        id="phoneNumber"
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        placeholder="+1234567890"
                        className="bg-white/50 border-gray-200 focus:bg-white focus:border-purple-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-medium text-gray-700 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                        Location
                      </label>
                      <Input
                        id="location"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        placeholder="City, Country"
                        className="bg-white/50 border-gray-200 focus:bg-white focus:border-purple-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center">
                        <Lock className="w-4 h-4 mr-2 text-gray-500" />
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder="••••••••"
                          className="bg-white/50 border-gray-200 focus:bg-white focus:border-purple-500 transition-colors pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-100"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
                
                {!isLogin && step === 2 && (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="weddingTemplate" className="text-sm font-medium text-gray-700 flex items-center">
                        <Globe className="w-4 h-4 mr-2 text-gray-500" />
                        Wedding Template URL
                      </label>
                      <Input
                        id="weddingTemplate"
                        type="text"
                        value={weddingTemplate}
                        onChange={(e) => setWeddingTemplate(e.target.value)}
                        required
                        placeholder="https://example.com/template"
                        className="bg-white/50 border-gray-200 focus:bg-white focus:border-purple-500 transition-colors"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Provide the URL of your preferred wedding template
                      </p>
                    </div>
                  </>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      {isLogin ? "Signing in..." : (step === 1 ? "Processing..." : "Creating account...")}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      {isLogin ? "Sign In" : (step === 1 ? "Continue" : "Create Account")}
                      {!isLogin && step === 1 && <ArrowRight className="w-4 h-4 ml-2" />}
                    </span>
                  )}
                </Button>
                
                {!isLogin && step === 2 && (
                  <Button 
                    type="button" 
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Step 1
                  </Button>
                )}
              </form>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <div className="w-full border-t border-gray-200 pt-4">
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
                    setShowPassword(false);
                  }}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  {isLogin ? "Need a partner account? Register here" : "Already have an account? Sign in"}
                </button>
              </div>
              
              <Link 
                to="/" 
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Main Site
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}