import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Users, ShoppingCart, TrendingUp, IndianRupee, Calendar, Eye } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const partners = [
  {
    id: 1,
    name: 'Divine Moments Photography',
    email: 'contact@divinemoments.com',
    joinDate: '2024-01-15',
    status: 'Active',
    templates: 12,
    revenue: 45000,
    performance: 'Excellent'
  },
  {
    id: 2,
    name: 'Kerala Wedding Planners',
    email: 'info@keralawedding.com',
    joinDate: '2024-02-20',
    status: 'Active',
    templates: 8,
    revenue: 32000,
    performance: 'Good'
  },
  {
    id: 3,
    name: 'Spice Route Events',
    email: 'hello@spiceroute.com',
    joinDate: '2024-03-10',
    status: 'Active',
    templates: 15,
    revenue: 58000,
    performance: 'Excellent'
  }
];

const purchases = [
  {
    id: 1,
    template: 'Kerala Traditional',
    customer: 'Nithin & Keziah',
    amount: 5000,
    date: '2024-07-15',
    status: 'Completed'
  },
  {
    id: 2,
    template: 'Modern Elegance',
    customer: 'Rafael & Kirste',
    amount: 7500,
    date: '2024-07-12',
    status: 'Completed'
  },
  {
    id: 3,
    template: 'Royal Heritage',
    customer: 'Duke & Elaine',
    amount: 6000,
    date: '2024-07-10',
    status: 'Processing'
  }
];

const CompanyDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="glass-morphism p-6 rounded-2xl">
            <h1 className="text-3xl font-serif font-medium mb-2 text-gradient">
              Matson Company Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your partners and track business performance
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="card-premium p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-primary" />
              <Badge variant="secondary">Active</Badge>
            </div>
            <h3 className="text-2xl font-bold mb-1">12</h3>
            <p className="text-sm text-muted-foreground">Total Partners</p>
          </Card>

          <Card className="card-premium p-6">
            <div className="flex items-center justify-between mb-4">
              <ShoppingCart className="w-8 h-8 text-primary" />
              <Badge variant="secondary">This Month</Badge>
            </div>
            <h3 className="text-2xl font-bold mb-1">47</h3>
            <p className="text-sm text-muted-foreground">Template Sales</p>
          </Card>

          <Card className="card-premium p-6">
            <div className="flex items-center justify-between mb-4">
              <IndianRupee className="w-8 h-8 text-primary" />
              <Badge variant="secondary">Revenue</Badge>
            </div>
            <h3 className="text-2xl font-bold mb-1">₹1,35,000</h3>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </Card>

          <Card className="card-premium p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-primary" />
              <Badge variant="secondary">Growth</Badge>
            </div>
            <h3 className="text-2xl font-bold mb-1">23%</h3>
            <p className="text-sm text-muted-foreground">Monthly Growth</p>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="partners">Partners</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="card-premium p-6">
                <h3 className="text-xl font-serif font-medium mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {purchases.slice(0, 3).map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{purchase.template}</p>
                        <p className="text-sm text-muted-foreground">{purchase.customer}</p>
                      </div>
                      <Badge variant={purchase.status === 'Completed' ? 'default' : 'secondary'}>
                        ₹{purchase.amount.toLocaleString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="card-premium p-6">
                <h3 className="text-xl font-serif font-medium mb-4">Top Partners</h3>
                <div className="space-y-4">
                  {partners.slice(0, 3).map((partner) => (
                    <div key={partner.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{partner.name}</p>
                        <p className="text-sm text-muted-foreground">{partner.templates} templates</p>
                      </div>
                      <Badge variant={partner.performance === 'Excellent' ? 'default' : 'secondary'}>
                        ₹{partner.revenue.toLocaleString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="partners" className="space-y-6">
            <Card className="card-premium">
              <div className="p-6 border-b">
                <h3 className="text-xl font-serif font-medium">Partners Management</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your partners and track their performance
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {partners.map((partner) => (
                    <div key={partner.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{partner.name}</h4>
                            <p className="text-sm text-muted-foreground">{partner.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <p className="font-medium">{partner.templates}</p>
                          <p className="text-muted-foreground">Templates</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">₹{partner.revenue.toLocaleString()}</p>
                          <p className="text-muted-foreground">Revenue</p>
                        </div>
                        <Badge variant={partner.status === 'Active' ? 'default' : 'secondary'}>
                          {partner.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="purchases" className="space-y-6">
            <Card className="card-premium">
              <div className="p-6 border-b">
                <h3 className="text-xl font-serif font-medium">Product Purchases</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  All template purchases made through the official website
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {purchases.map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{purchase.template}</h4>
                          <p className="text-sm text-muted-foreground">Customer: {purchase.customer}</p>
                          <p className="text-xs text-muted-foreground">{purchase.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">₹{purchase.amount.toLocaleString()}</p>
                          <Badge variant={purchase.status === 'Completed' ? 'default' : 'secondary'}>
                            {purchase.status}
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default CompanyDashboard;