import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AuthGuard from "./auth/AuthGuard";
import { useNavigate } from "react-router-dom";
import ManageClients from "./ManageClients";

export const weddingDetailsSchema = z.object({
  bride_full_name: z
    .string()
    .min(2, "Bride's name is required"),
  groom_full_name: z
    .string()
    .min(2, "Groom's name is required"),
  couple_email: z
    .string()
    .email("A valid email is required"),
  couple_phone: z
    .string()
    .min(8, "WhatsApp number should be at least 8 digits"),
});

type WeddingFormValues = z.infer<typeof weddingDetailsSchema>;

export default function WeddingDetails() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<WeddingFormValues>({
    resolver: zodResolver(weddingDetailsSchema),
    defaultValues: {
      bride_full_name: "",
      groom_full_name: "",
      couple_email: "",
      couple_phone: "",
    },
  });

  const onSubmit = async (data: WeddingFormValues) => {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    setLoading(true);
    try {
      // Insert wedding details with required fields including partner_id
      const { error } = await supabase.from("partner_side_wedding_details").insert([
        {
          partner_id: user.id,
          bride_full_name: data.bride_full_name.trim(),
          groom_full_name: data.groom_full_name.trim(),
          couple_email: data.couple_email.trim(),
          couple_phone: data.couple_phone.trim(),
        },
      ]);
      
      if (error) throw new Error(error.message);

      toast.success("Wedding details saved successfully!");
      form.reset();
    } catch (error: any) {
      console.error("Error saving wedding details:", error);
      toast.error(error.message || "Failed to save wedding details");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error(error.message || "Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/partner/auth");
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-b from-[#F9E4E6] to-[#FDF7F8] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[#6B2D3C]">
              Matson Wedding Client Information
            </h1>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="border-[#D4AF37] text-[#6B2D3C] hover:bg-[#F9E4E6]"
              disabled={loading}
            >
              Sign Out
            </Button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card className="border-[#D4AF37] shadow-lg max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-2xl text-center text-[#6B2D3C]">
                    Client Information
                  </CardTitle>
                  <CardDescription className="text-center text-[#333333]">
                    Enter the client's wedding contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="bride_full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#333333]">
                            Bride's Full Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Jane Doe"
                              {...field}
                              className="border-[#D4AF37]"
                              disabled={loading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="groom_full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#333333]">
                            Groom's Full Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              {...field}
                              className="border-[#D4AF37]"
                              disabled={loading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="couple_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#333333]">
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="couple@example.com"
                              type="email"
                              {...field}
                              className="border-[#D4AF37]"
                              disabled={loading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="couple_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#333333]">
                            WhatsApp Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="+1234567890"
                              {...field}
                              className="border-[#D4AF37]"
                              disabled={loading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-[#6B2D3C] hover:bg-[#4A1F2A] text-white min-w-[200px]"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-dashed border-white"></span>
                          Saving...
                        </span>
                      ) : (
                        "Save Client Details"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>
      </div>
    </AuthGuard>
  );
}
