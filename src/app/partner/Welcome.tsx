import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Heart, User, FileText, Settings, Plus, TrendingUp, Calendar, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const Welcome = () => {
  const { user } = useAuth();

  // Enhanced stats with better data structure
  const stats = [
    {
      title: "Weddings Managed",
      value: 0,
      change: "+12%",
      changeType: "positive",
      icon: <Heart className="w-6 h-6 text-pink-500" />,
      color: "from-pink-50 to-rose-50 border-pink-200",
      link: "/partner/manage-clients",
    },
    {
      title: "Active Clients",
      value: 0,
      change: "+5%",
      changeType: "positive", 
      icon: <Users className="w-6 h-6 text-blue-500" />,
      color: "from-blue-50 to-indigo-50 border-blue-200",
      link: "/partner/manage-clients",
    },
    {
      title: "Reports Generated",
      value: 0,
      change: "+8%",
      changeType: "positive",
      icon: <FileText className="w-6 h-6 text-purple-500" />,
      color: "from-purple-50 to-violet-50 border-purple-200",
      link: "/partner/reports",
    },
  ];

  const actions = [
    {
      title: "Add New Wedding",
      description: "Start planning a new wedding event with our comprehensive form.",
      icon: <Plus className="w-6 h-6 text-green-500" />,
      color: "from-green-50 to-emerald-50 border-green-200",
      link: "/partner/wedding-details",
      badge: "Popular"
    },
    {
      title: "View Reports",
      description: "Check analytics, insights, and performance reports.",
      icon: <TrendingUp className="w-6 h-6 text-orange-500" />,
      color: "from-orange-50 to-amber-50 border-orange-200",
      link: "/partner/reports",
    },
    {
      title: "Manage Clients",
      description: "View and manage your client information and details.",
      icon: <Users className="w-6 h-6 text-blue-500" />,
      color: "from-blue-50 to-cyan-50 border-blue-200",
      link: "/partner/manage-clients",
    },
    {
      title: "Settings",
      description: "Update your account settings and preferences.",
      icon: <Settings className="w-6 h-6 text-gray-500" />,
      color: "from-gray-50 to-slate-50 border-gray-200",
      link: "/partner/settings",
    },
  ];

  const recentActivity = [
    {
      type: "wedding_created",
      title: "New wedding created",
      description: "Sarah & John's wedding details added",
      time: "2 hours ago",
      icon: <Heart className="w-4 h-4 text-pink-500" />
    },
    {
      type: "client_updated",
      title: "Client information updated",
      description: "Mike & Lisa's contact details modified",
      time: "1 day ago",
      icon: <User className="w-4 h-4 text-blue-500" />
    },
    {
      type: "report_generated",
      title: "Monthly report generated",
      description: "September 2024 performance summary",
      time: "3 days ago",
      icon: <FileText className="w-4 h-4 text-purple-500" />
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Welcome back, Partner!
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Here's an overview of your activity and quick actions to get started.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Link to={stat.link} key={stat.title} className="block group">
            <Card className={`bg-gradient-to-br ${stat.color} border-2 hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-white/80 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                      {stat.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">{stat.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                        <Badge variant="secondary" className={`text-xs ${
                          stat.changeType === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {stat.change}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                  View details →
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Calendar className="w-6 h-6 mr-3 text-purple-600" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {actions.map((action, index) => (
            <Link to={action.link} key={action.title} className="block group">
              <Card className={`bg-gradient-to-br ${action.color} border-2 hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white/80 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                        {action.icon}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-xl font-semibold text-gray-900">{action.title}</CardTitle>
                          {action.badge && (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                              {action.badge}
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-gray-600 mt-2 text-base">
                          {action.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                    <span>Get started</span>
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white/80 backdrop-blur-sm border-2 border-gray-200/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
              Recent Activity
            </CardTitle>
            <Badge variant="outline" className="text-xs">Live</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-gray-900">{activity.title}</h4>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-50 rounded-xl w-fit mx-auto mb-4">
                <Heart className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">No recent activity</p>
              <p className="text-sm text-gray-400">Your activity will appear here as you use the platform</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-2 border-gray-200/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Monthly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Weddings Created</span>
                  <span className="font-medium">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Client Satisfaction</span>
                  <span className="font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-2 border-gray-200/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="font-semibold text-purple-600">12 Weddings</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                <span className="text-sm text-gray-600">Active Clients</span>
                <span className="font-semibold text-blue-600">8 Couples</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Welcome; 