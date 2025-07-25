import Hero from "@/app/public/components/Hero";
import Footer from "@/app/public/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Globe, Star, ArrowRight, CheckCircle, Sparkles, Award, Palette, Gift } from "lucide-react";
import { motion } from "framer-motion";
import invitationCard1 from '@/assets/cards/1/487514921_978957041082580_145782463825346552_n.jpg';
import { Link } from "react-router-dom";

const Index = () => {
  const services = [
    {
      icon: Heart,
      title: "Wedding Invitations",
      description: "Browse beautiful pre-designed templates starting from ₹10",
      image: invitationCard1,
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
    <div className="min-h-screen">
      <Hero />
      
      {/* Services Section - Enhanced Premium Design */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
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
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ y: -15, scale: 1.02 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ 
                    duration: 0.7, 
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="group interactive-card w-full max-w-full"
                >
                  <Card className="card-premium h-full w-full max-w-full box-border">
                    <div className="aspect-[4/3] relative overflow-hidden">
                      {service.title === "Wedding Websites" ? (
                        <iframe
                          src="https://arunandvidya.matson.app/"
                          title="Arun & Vidya Wedding Website"
                          className="w-full h-full object-cover border-0 rounded-t-lg"
                          loading="lazy"
                          sandbox="allow-scripts allow-same-origin"
                        />
                      ) : (
                        <motion.img 
                          src={service.image} 
                          alt={service.title}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      {/* Floating icon */}
                      <motion.div 
                        className="absolute top-6 left-6"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <div className={`w-14 h-14 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                      </motion.div>
                      
                      {/* Premium badge */}
                      <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
                       
                        {service.comingSoon && (
                          <div className="bg-gray-800/80 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mt-1 animate-pulse">
                            Coming Soon
                          </div>
                        )}
                      </div>
                      
                      {/* Title overlay */}
                      <motion.div 
                        className="absolute bottom-6 left-6 right-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <h3 className="text-2xl font-serif font-semibold text-white mb-2">
                          {service.title}
                        </h3>
                      </motion.div>
                    </div>
                    
                    <div className="p-8 relative z-10">
                      <motion.p 
                        className="text-gray-600 mb-6 leading-relaxed text-lg"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        {service.description}
                      </motion.p>
                      
                      <div className="space-y-4 mb-8">
                        {service.features.map((feature, idx) => (
                          <motion.div 
                            key={idx} 
                            className="flex items-center gap-4"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ 
                              delay: 0.5 + index * 0.1 + idx * 0.05,
                              type: "spring" 
                            }}
                          >
                            <div className={`flex-shrink-0 w-6 h-6 bg-gradient-to-r ${service.gradient} rounded-full flex items-center justify-center`}>
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-gray-700 font-medium">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                      
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
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
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Matson Section - Enhanced */}
      <section className="py-28 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <motion.div 
            className="absolute top-32 left-20 w-96 h-96 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-32 right-20 w-80 h-80 bg-gradient-to-r from-accent/30 to-primary/30 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div 
            className="grid lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-8 bg-gradient-to-r from-primary/15 to-accent/15 text-primary border-primary/30 hover:from-primary/25 hover:to-accent/25 transition-all duration-300 px-4 py-2">
                <Star className="w-4 h-4 mr-2" />
                Trusted by 5000+ couples
              </Badge>
              
              <h2 className="text-5xl md:text-7xl font-serif font-medium mb-12 leading-tight">
                Why couples choose 
                <span className="text-gradient block mt-4">Matson</span>
              </h2>
              
              <div className="space-y-10">
                {[
                  {
                    icon: Palette,
                    title: "Authentic Kerala Designs", 
                    description: "Our templates celebrate Kerala's rich cultural heritage with modern elegance and traditional artistry.",
                    delay: 0.3
                  },
                  {
                    icon: Award,
                    title: "Affordable Excellence",
                    description: "Premium quality starting from just ₹10, with zero hidden costs and transparent pricing.",
                    delay: 0.4
                  },
                  {
                    icon: Globe,
                    title: "Digital Innovation",
                    description: "Modern tools and cutting-edge technology to make wedding planning effortless and enjoyable.",
                    delay: 0.5
                  }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start gap-6 group hover-lift p-6 rounded-2xl hover:bg-white/50 transition-all duration-300"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: item.delay }}
                    viewport={{ once: true }}
                  >
                    <motion.div 
                      className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <item.icon className="w-10 h-10 text-primary" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-serif text-2xl font-semibold mb-4 text-gray-900 group-hover:text-primary transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="relative overflow-hidden rounded-3xl">
                <motion.img 
                  src="https://images.unsplash.com/photo-1600298881974-6be191ceeda1?auto=format&fit=crop&w=800&q=80" 
                  alt="Happy couple planning wedding"
                  className="w-full shadow-2xl rounded-3xl transform transition-transform duration-700"
                  whileHover={{ scale: 1.05 }}
                />
                
                {/* Floating elements */}
                <motion.div 
                  className="absolute -bottom-12 -left-12 w-48 h-48 bg-gradient-to-r from-primary/40 to-accent/40 rounded-full blur-3xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.7, 0.4]
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-r from-accent/40 to-primary/40 rounded-full blur-2xl"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
                />
                
                {/* Glass overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-3xl"></div>
                
                {/* Stats overlay */}
                <motion.div 
                  className="absolute bottom-8 left-8 right-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  viewport={{ once: true }}
                >
                  <div className="glass-morphism rounded-2xl p-6">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">5000+</div>
                        <div className="text-sm text-gray-600">Happy Couples</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">500+</div>
                        <div className="text-sm text-gray-600">Designs</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

  
      {/* CTA Section - Enhanced */}
      <section className="py-28 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_200%] gradient-shift relative overflow-hidden">
        {/* Dynamic background elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-16 left-16 w-40 h-40 bg-white/15 rounded-full blur-xl"
            animate={{ 
              x: [0, 120, 0],
              y: [0, 80, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-16 right-16 w-32 h-32 bg-white/20 rounded-full blur-lg"
            animate={{ 
              x: [0, -100, 0],
              y: [0, -60, 0],
              scale: [1, 1.4, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 3 }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/10 rounded-full blur-md"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 12, repeat: Infinity }}
          />
        </div>
        
        <div className="container mx-auto px-4 text-center relative">
          <motion.div 
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-5xl md:text-7xl font-serif font-medium mb-10 text-white leading-tight"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Ready to start planning your 
              <span className="block mt-4 relative">
                <span className="relative z-10">dream wedding?</span>
                <motion.div 
                  className="absolute -bottom-4 left-0 right-0 h-4 bg-white/30 rounded-full"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 1.2, delay: 1 }}
                  viewport={{ once: true }}
                />
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-2xl text-white/90 mb-16 leading-relaxed font-light max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Join thousands of couples who have trusted Matson to make their wedding day absolutely perfect with our premium designs and expert support.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-8 justify-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-gray-100 text-xl px-12 py-6 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <Heart className="w-6 h-6 mr-3" />
                  Browse card templates
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary text-xl px-12 py-6 rounded-full font-semibold bg-transparent backdrop-blur-sm transition-all duration-300"
                >
                  <Globe className="w-6 h-6 mr-3" />
                  Browse website templates
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Trust indicators */}
            <motion.div 
              className="mt-16 flex flex-wrap justify-center items-center gap-8 text-white/80"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-300 fill-current" />
                <span className="font-medium">5000+ Happy Couples</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-300" />
                <span className="font-medium">Premium Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-300 fill-current" />
                <span className="font-medium">Kerala's #1 Choice</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;