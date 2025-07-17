import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Users, ShoppingCart, TrendingUp, IndianRupee, Calendar, Eye } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Update Partner type to match database schema
type Partner = {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  company_name?: string;
  status?: string;
  created_at: string;
  updated_at: string;
};

type Purchase = {
  id: string;
  partner_id?: string;
  customer_id?: string;
  template_id: string;
  purchase_type: string;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
};


const CompanyDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddForm, setShowAddForm] = useState(false);
  // Add name and password to the newPartner state
  const [newPartner, setNewPartner] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [partnersList, setPartnersList] = useState<Partner[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch partners from Supabase
  useEffect(() => {
    const fetchPartners = async () => {
      const { data, error } = await supabase.from('partners').select('*');
      if (error) {
        setError(error.message);
      } else if (data) {
        setPartnersList(data as Partner[]);
      }
    };
    fetchPartners();
  }, []);

  // Fetch purchases from Supabase
  useEffect(() => {
    const fetchPurchases = async () => {
      const { data, error } = await supabase.from('purchases').select('*');
      if (error) {
        setError(error.message);
      } else if (data) {
        setPurchases(data as Purchase[]);
      }
    };
    fetchPurchases();
  }, []);

  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Insert into Supabase
    const { data, error } = await supabase.from('partners').insert([newPartner]).select();
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data) {
      setPartnersList([...partnersList, ...(data as Partner[])]);
    }
    setShowAddForm(false);
    // Reset newPartner state after save
    setNewPartner({
      name: '',
      email: '',
      password: '',
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      
      
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
            <h3 className="text-2xl font-bold mb-1">{partnersList.length}</h3>
            <p className="text-sm text-muted-foreground">Total Partners</p>
          </Card>

          <Card className="card-premium p-6">
            <div className="flex items-center justify-between mb-4">
              <ShoppingCart className="w-8 h-8 text-primary" />
              <Badge variant="secondary">This Month</Badge>
            </div>
            <h3 className="text-2xl font-bold mb-1">{purchases.length}</h3>
            <p className="text-sm text-muted-foreground">Template Sales</p>
          </Card>

          <Card className="card-premium p-6">
            <div className="flex items-center justify-between mb-4">
              <IndianRupee className="w-8 h-8 text-primary" />
              <Badge variant="secondary">Revenue</Badge>
            </div>
            <h3 className="text-2xl font-bold mb-1">₹{purchases.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</h3>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </Card>

          <Card className="card-premium p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-primary" />
              <Badge variant="secondary">Growth</Badge>
            </div>
            <h3 className="text-2xl font-bold mb-1">--</h3>
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
                        <p className="font-medium">Template {purchase.template_id}</p>
                        <p className="text-sm text-muted-foreground">Customer {purchase.customer_id}</p>
                      </div>
                      <Badge variant={purchase.status === 'completed' ? 'default' : 'secondary'}>
                        ₹{purchase.amount.toLocaleString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="card-premium p-6">
                <h3 className="text-xl font-serif font-medium mb-4">Top Partners</h3>
                <div className="space-y-4">
                  {partnersList.slice(0, 3).map((partner) => (
                    <div key={partner.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{partner.name}</p>
                        <p className="text-sm text-muted-foreground">{partner.email}</p>
                      </div>
                      <Badge variant="secondary">
                        --
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="partners" className="space-y-6">
            <Card className="card-premium">
              <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-serif font-medium">Partners Management</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage your partners and track their performance
                  </p>
                </div>
                <Button onClick={() => setShowAddForm((v) => !v)} variant="outline">
                  {showAddForm ? 'Cancel' : 'Add Partner'}
                </Button>
              </div>
              {showAddForm && (
                <form className="p-6 space-y-4" onSubmit={handleAddPartner}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Partner Name" value={newPartner.name} onChange={e => setNewPartner({ ...newPartner, name: e.target.value })} />
                    <input required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Email" type="email" value={newPartner.email} onChange={e => setNewPartner({ ...newPartner, email: e.target.value })} />
                    <input required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Password" type="password" value={newPartner.password} onChange={e => setNewPartner({ ...newPartner, password: e.target.value })} />
                  </div>
                  {error && <div className="text-red-500">{error}</div>}
                  <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Partner'}</Button>
                </form>
              )}
              <div className="p-6">
                <div className="space-y-4">
                  {partnersList.map((partner) => (
                    <div key={partner.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{partner.name}</h4>
                            <p className="text-sm text-muted-foreground">{partner.email}</p>
                            <p className="text-xs text-muted-foreground">Password: {partner.password}</p>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
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
                          <h4 className="font-medium">Template {purchase.template_id}</h4>
                          <p className="text-sm text-muted-foreground">Customer: {purchase.customer_id}</p>
                          <p className="text-xs text-muted-foreground">{purchase.created_at}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">₹{purchase.amount.toLocaleString()}</p>
                          <Badge variant={purchase.status === 'completed' ? 'default' : 'secondary'}>
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