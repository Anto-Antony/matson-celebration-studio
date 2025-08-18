import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Globe, Gift, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedBackground from "../animations/AnimatedBackground";
import { fadeInUp, scaleIn, staggerContainer } from "../animations/MotionVariants";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface InvitationCard {
  id: string;
  card_name: string;
  description: string;
  image_path: Array<{ url: string }>;
  price: number;
}

const ServicesSection = () => {
  const [invitationImage, setInvitationImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInvitationCard = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('invitation_card')
          .select('card_name, description, image_path, price')
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching invitation card:', error);
          toast({
            title: "Error",
            description: "Failed to load invitation card data",
            variant: "destructive",
          });
          return;
        }

        if (data && data.image_path && Array.isArray(data.image_path) && data.image_path.length > 0) {
          // Extract the first image URL from the image_path array
          const firstImageUrl = data.image_path[0]?.url || "";
          setInvitationImage(firstImageUrl);
        }
      } catch (error) {
        console.error('Error fetching invitation card:', error);
        toast({
          title: "Error",
          description: "Failed to load invitation card data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvitationCard();
  }, [toast]);

  const services = [
    {
      icon: Heart,
      title: "Wedding Invitations",
      description: "Browse beautiful pre-designed templates starting from ₹10",
      image: invitationImage || "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
      features: ["Professional templates", "Kerala cultural designs", "Premium materials", "Fast delivery"],
      gradient: "from-rose-500 to-pink-600"
    },
    {
      icon: Globe,
      title: "Wedding Websites",
      description: "Create stunning wedding websites with our easy builder",
      image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80", 
      features: ["Customizable website","Photo galleries", "Mobile responsive", "Custom domains"],
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      icon: Gift,
      title: "Wedding Registry",
      description: "The gifts you want, the way you want them.",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      features: ["Personal planner", "Vendor coordination", "Timeline management", "Budget planning"],
      gradient: "from-emerald-500 to-teal-600",
      comingSoon: true
    }
  ];

  return (
    <section id="services" className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      <AnimatedBackground variant="services" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div 
          className="text-center mb-20"
          {...fadeInUp}
        >
          <motion.div {...scaleIn}>
            <Badge className="mb-6 bg-gradient-to-r from-primary/10 to-accent/10 text-primary border-primary/20 hover:from-primary/20 hover:to-accent/20 transition-all duration-300">
              <Sparkles className="w-4 h-4 mr-2" />
              Premium Wedding Solutions
            </Badge>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-serif font-medium mb-8 leading-tight">
            Everything you need for your 
            <span className="text-gradient block mt-2">perfect day</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            From invitation cards to wedding websites, Matson provides all the premium tools to make your wedding planning seamless, beautiful, and unforgettable.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                {...staggerContainer}
                transition={{ 
                  duration: 0.7,
                  delay: index * 0.2,
                  ease: "easeOut"
                }}
                className="group interactive-card w-full max-w-full"
              >
                <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:bg-white/90 relative">
                  {service.comingSoon && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg">
                        Coming Soon
                      </Badge>
                    </div>
                  )}
                  
                  <div className="relative h-64 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-90`}></div>
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500"></div>
                    
                    <div className="absolute top-6 left-6">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold font-serif group-hover:text-primary transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Key Features:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center space-x-3 text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        {service.title === "Wedding Invitations" ? (
                          <Link to="/gallery">
                            <Button className={`w-full rounded-full btn-kerala bg-gradient-to-r ${service.gradient} text-white shadow-lg hover:shadow-xl transition-all duration-300 py-6`}>
                              <span className="flex items-center justify-center gap-2">
                                Explore {service.title}
                                <ArrowRight className="w-5 h-5" />
                              </span>
                            </Button>
                          </Link>
                        ) : service.title === "Wedding Websites" ? (
                          <Link to="/website">
                            <Button className={`w-full rounded-full btn-kerala bg-gradient-to-r ${service.gradient} text-white shadow-lg hover:shadow-xl transition-all duration-300 py-6`}>
                              <span className="flex items-center justify-center gap-2">
                                Explore {service.title}
                                <ArrowRight className="w-5 h-5" />
                              </span>
                            </Button>
                          </Link>
                        ) : (
                          <Button className={`w-full rounded-full btn-kerala bg-gradient-to-r ${service.gradient} text-white shadow-lg hover:shadow-xl transition-all duration-300 py-6`}>
                            <span className="flex items-center justify-center gap-2">
                              Explore {service.title}
                              <ArrowRight className="w-5 h-5" />
                            </span>
                          </Button>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
