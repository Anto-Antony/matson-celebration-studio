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
import AuthGuard from "@/components/AuthGuard";
import { useNavigate } from "react-router-dom";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

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
  wedding_template: z.string().min(1, "Please select a template"),
});

type WeddingFormValues = z.infer<typeof weddingDetailsSchema>;

const weddingTemplates = [
  {
    id: "joenithya",
    name: "Joe & Nithya Template",
    url: "https://joenithya.matson.app/",
    description: "Elegant and modern design with romantic elements",
    features: [
      "Responsive Design",
      "Photo Gallery",
      "RSVP System",
      "Event Timeline",
    ],
    color: "bg-gradient-to-br from-pink-100 to-rose-200",
    icon: "💕",
  },
  {
    id: "joesantra",
    name: "Joe & Santra Template",
    url: "https://joesantra.matson.app/",
    description: "Classic and sophisticated layout",
    features: [
      "Elegant Typography",
      "Story Section",
      "Guest Book",
      "Map Integration",
    ],
    color: "bg-gradient-to-br from-blue-100 to-indigo-200",
    icon: "💎",
  },
  {
    id: "nithinnithya",
    name: "Nithin & Nithya Template",
    url: "https://nithinnithya.matson.app/",
    description: "Contemporary design with beautiful typography",
    features: [
      "Modern Layout",
      "Video Background",
      "Countdown Timer",
      "Social Sharing",
    ],
    color: "bg-gradient-to-br from-purple-100 to-violet-200",
    icon: "✨",
  },
  {
    id: "template4",
    name: "Template 4",
    url: "https://template4.matson.app/",
    description: "Minimalist and clean design approach",
    features: [
      "Clean Design",
      "Fast Loading",
      "Easy Customization",
      "Mobile First",
    ],
    color: "bg-gradient-to-br from-gray-100 to-slate-200",
    icon: "🎯",
  },
  {
    id: "nithinandkeziah",
    name: "Nithin & Keziah Template",
    url: "https://nithinandkeziah.matson.app/",
    description: "Romantic and intimate wedding theme",
    features: [
      "Romantic Theme",
      "Music Player",
      "Photo Slideshow",
      "Contact Forms",
    ],
    color: "bg-gradient-to-br from-red-100 to-pink-200",
    icon: "🌹",
  },
];

export default function WeddingDetails() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const form = useForm<WeddingFormValues>({
    resolver: zodResolver(weddingDetailsSchema),
    defaultValues: {
      bride_full_name: "",
      groom_full_name: "",
      couple_email: "",
      couple_phone: "",
      wedding_template: "",
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
          wedding_template: data.wedding_template,
          // other fields omitted as per schema/defaults
        },
      ]);
      

      if (error) throw new Error(error.message);

      toast.success("Wedding details saved successfully!");
      form.reset();
      setCurrentStep(1);
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
      navigate("/");
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      form.trigger([
        "bride_full_name",
        "groom_full_name",
        "couple_email",
        "couple_phone",
      ]).then((isValid) => {
        if (isValid) {
          setCurrentStep(2);
        } else {
          toast.error("Please fill in all required fields correctly");
        }
      });
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  // When user selects template, update form value with template's URL
  const handleTemplateSelect = (templateId: string) => {
    const template = weddingTemplates.find((t) => t.id === templateId);
    if (!template) return;

    form.setValue("wedding_template", template.url);
  };

  const selectedTemplateUrl = form.watch("wedding_template");
  const selectedTemplateData = weddingTemplates.find(
    (t) => t.url === selectedTemplateUrl
  );

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

          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div
                className={`flex items-center space-x-2 ${
                  currentStep >= 1 ? "text-[#6B2D3C]" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 1
                      ? "bg-[#6B2D3C] text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {currentStep > 1 ? <Check className="w-4 h-4" /> : "1"}
                </div>
                <span className="font-medium">Client Details</span>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400" />
              <div
                className={`flex items-center space-x-2 ${
                  currentStep >= 2 ? "text-[#6B2D3C]" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 2
                      ? "bg-[#6B2D3C] text-white"
                      : "bg-gray-200"
                  }`}
                >
                  2
                </div>
                <span className="font-medium">Template Selection</span>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {currentStep === 1 && (
                <Card className="border-[#D4AF37] shadow-lg max-w-2xl mx-auto">
                  <CardHeader>
                    <CardTitle className="text-2xl text-center text-[#6B2D3C]">
                      Step 1: Client Information
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
                        type="button"
                        onClick={nextStep}
                        className="bg-[#6B2D3C] hover:bg-[#4A1F2A] text-white min-w-[200px]"
                        disabled={loading}
                      >
                        Next Step
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <Card className="border-[#D4AF37] shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-2xl text-center text-[#6B2D3C]">
                        Step 2: Template Selection
                      </CardTitle>
                      <CardDescription className="text-center text-[#333333]">
                        Choose a wedding website template for your clients
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {weddingTemplates.map((template) => (
                          <Card
                            key={template.id}
                            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                              selectedTemplateData?.id === template.id
                                ? "ring-2 ring-[#6B2D3C] border-[#6B2D3C]"
                                : "border-gray-200 hover:border-[#D4AF37]"
                            }`}
                            onClick={() => handleTemplateSelect(template.id)}
                          >
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg text-[#6B2D3C]">
                                {template.name}
                              </CardTitle>
                              <CardDescription>{template.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div
                                className={`${template.color} rounded-lg p-6 text-center h-48 flex flex-col items-center justify-center`}
                              >
                                <div className="text-4xl mb-3">{template.icon}</div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                  {template.name}
                                </h3>
                                <p className="text-sm text-gray-600">{template.description}</p>
                              </div>

                              <div className="space-y-2">
                                <h4 className="font-medium text-sm text-[#6B2D3C]">
                                  Features:
                                </h4>
                                <ul className="text-xs text-gray-600 space-y-1">
                                  {template.features.map((feature, index) => (
                                    <li key={index} className="flex items-center">
                                      <Check className="w-3 h-3 mr-2 text-green-500" />
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {selectedTemplateData?.id === template.id && (
                                <div className="flex items-center justify-center pt-2">
                                  <div className="bg-[#6B2D3C] text-white px-3 py-1 rounded-full text-sm">
                                    Selected
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-8">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevStep}
                          className="border-[#D4AF37] text-[#6B2D3C] hover:bg-[#F9E4E6]"
                          disabled={loading}
                        >
                          <ChevronLeft className="w-4 h-4 mr-2" />
                          Previous Step
                        </Button>

                        <Button
                          type="submit"
                          disabled={loading || !selectedTemplateData}
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
                </div>
              )}
            </form>
          </Form>
        </div>
      </div>
    </AuthGuard>
  );
}
