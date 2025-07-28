import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Edit, Settings, Users, Calendar, Image, MessageSquare, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWeddingAuth } from '../templates/[slag]/contexts/WeddingAuthContext';
import { useWedding } from '../templates/[slag]/contexts/WeddingContext';
import { useToast } from '@/hooks/use-toast';

const WeddingDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoggedIn, logout } = useWeddingAuth();
  const { weddingData, editable } = useWedding();

  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate('/wedding/login');
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your wedding account",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out",
        variant: "destructive",
      });
    }
  };

  const dashboardItems = [
    {
      title: "Edit Wedding Details",
      description: "Update your wedding information, venue, and schedule",
      icon: Edit,
      href: `/wedding/${user?.id}`,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Manage Gallery",
      description: "Upload and organize your wedding photos",
      icon: Image,
      href: `/wedding/${user?.id}#gallery`,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Guest Messages",
      description: "View and manage guest wishes and messages",
      icon: MessageSquare,
      href: `/wedding/${user?.id}#wishes`,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Guest Management",
      description: "Manage your guest list and RSVPs",
      icon: Users,
      href: "#",
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "Wedding Timeline",
      description: "Plan and organize your wedding schedule",
      icon: Calendar,
      href: `/wedding/${user?.id}#schedule`,
      color: "from-pink-500 to-pink-600"
    },
    {
      title: "Settings",
      description: "Customize your wedding website settings",
      icon: Settings,
      href: "#",
      color: "from-gray-500 to-gray-600"
    }
  ];

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Wedding Dashboard
                </h1>
                <p className="text-gray-600">
                  Welcome back, {user.bride_name || user.groom_name || 'User'}!
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Wedding Info Card */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-purple-600" />
              <span>Your Wedding</span>
            </CardTitle>
            <CardDescription>
              {weddingData.couple.brideName} & {weddingData.couple.groomName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Bride</p>
                <p className="font-semibold text-lg">{weddingData.couple.brideName}</p>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <p className="text-sm text-gray-600">Groom</p>
                <p className="font-semibold text-lg">{weddingData.couple.groomName}</p>
              </div>
              <div className="text-center p-4 bg-rose-50 rounded-lg">
                <p className="text-sm text-gray-600">Template</p>
                <p className="font-semibold text-lg">{weddingData.template || 'Model 1'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Card 
                key={index} 
                className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer"
                onClick={() => navigate(item.href)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`bg-gradient-to-r ${item.color} p-2 rounded-lg`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Quick access to your most important wedding tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button 
                  variant="outline" 
                  className="flex items-center space-x-2"
                  onClick={() => navigate(`/wedding/${user.id}`)}
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Wedding Page</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center space-x-2"
                  onClick={() => navigate(`/wedding/${user.id}#gallery`)}
                >
                  <Image className="w-4 h-4" />
                  <span>Manage Gallery</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center space-x-2"
                  onClick={() => navigate(`/wedding/${user.id}#wishes`)}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>View Messages</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WeddingDashboard; 