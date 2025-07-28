
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Sparkles, Shield, Palette, Users, Clock, Star } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  
  const features = [
    {
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      title: "Easy Planning",
      description: "Organize all your wedding details in one place with our intuitive interface.",
      color: "from-pink-50 to-rose-50 border-pink-200"
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      title: "Secure Storage",
      description: "Your wedding information is safely stored and accessible anytime, anywhere.",
      color: "from-blue-50 to-indigo-50 border-blue-200"
    },
    {
      icon: <Palette className="w-8 h-8 text-purple-500" />,
      title: "Beautiful Design",
      description: "Create stunning wedding experiences with our elegant, customizable templates.",
      color: "from-purple-50 to-violet-50 border-purple-200"
    }
  ];

  const stats = [
    { label: "Happy Couples", value: "500+", icon: <Heart className="w-5 h-5" /> },
    { label: "Weddings Created", value: "1000+", icon: <Sparkles className="w-5 h-5" /> },
    { label: "Partner Satisfaction", value: "98%", icon: <Star className="w-5 h-5" /> }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200">
              <Sparkles className="w-4 h-4 mr-2" />
              Wedding Planning Made Simple
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                Wedding Bells
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your perfect wedding planning companion. Create, manage, and share your special day with ease and elegance.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              {user ? (
                <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <Link to="/partner/wedding-details">
                    <Heart className="w-5 h-5 mr-2" />
                    Manage Wedding Details
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <Link to="/partner/auth">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Get Started
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-6 text-lg transition-all duration-300">
                    <a href="#features">
                      <Users className="w-5 h-5 mr-2" />
                      Learn More
                    </a>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl text-purple-600 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
        
      {/* Features Section */}
      <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Matson Wedding Studio?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the perfect blend of technology and romance with our comprehensive wedding planning platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className={`bg-gradient-to-br ${feature.color} border-2 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group`}>
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-white/80 rounded-2xl shadow-sm group-hover:shadow-md transition-shadow duration-300">
                    {feature.icon}
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 text-center text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-16 mt-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Create Your Perfect Wedding?</h3>
          <p className="text-xl text-purple-100 mb-8">
            Join hundreds of happy couples who have already planned their dream weddings with us.
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg shadow-lg">
            <Link to={user ? "/partner/wedding-details" : "/partner/auth"}>
              {user ? "Start Planning Now" : "Begin Your Journey"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
