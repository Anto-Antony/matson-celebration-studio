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

// Remove the old partners array and use only the new structure
type Partner = {
  id: number;
  companyName: string;
  email: string;
  password: string;
  address: string;
  contactPerson: string;
  phoneNumber: string;
  website?: string;
  logo?: string;
  industryType?: string;
  description?: string;
  socialMediaLinks?: string;
  preferredCommunication?: string;
};

type Purchase = {
  id: number;
  template: string;
  customer: string;
  amount: number;
  date: string;
  status: string;
  source: string;
};


const CompanyDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddForm, setShowAddForm] = useState(false);
  // Add companyName and password to the newPartner state
  const [newPartner, setNewPartner] = useState({
    companyName: '',
    email: '',
    password: '',
    address: '',
    contactPerson: '',
    phoneNumber: '',
    website: '',
    logo: '',
    industryType: '',
    description: '',
    socialMediaLinks: '',
    preferredCommunication: '',
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

  const handleAddPartner = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Insert into Supabase
    const { data, error } = await supabase.from('partners').insert([
      {
        companyName: newPartner.companyName,
        email: newPartner.email,
        password: newPartner.password,
        address: newPartner.address,
        contactPerson: newPartner.contactPerson,
        phoneNumber: newPartner.phoneNumber,
        website: newPartner.website || null,
        logo: newPartner.logo || null,
        industryType: newPartner.industryType || null,
        description: newPartner.description || null,
        socialMediaLinks: newPartner.socialMediaLinks || null,
        preferredCommunication: newPartner.preferredCommunication || null,
      }
    ]).select();
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    const inserted = (data as Database['public']['Tables']['partners']['Row'][] | null);
    setPartnersList([
      ...partnersList,
      { ...newPartner, id: inserted && inserted[0] && inserted[0].id ? inserted[0].id : Date.now() }
    ]);
    setShowAddForm(false);
    // Reset newPartner state after save
    setNewPartner({
      companyName: '',
      email: '',
      password: '',
      address: '',
      contactPerson: '',
      phoneNumber: '',
      website: '',
      logo: '',
      industryType: '',
      description: '',
      socialMediaLinks: '',
      preferredCommunication: '',
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
            <h3 className="text-2xl font-bold mb-1">₹{purchases.reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString()}</h3>
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
                  {partnersList.slice(0, 3).map((partner) => (
                    <div key={partner.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{partner.companyName}</p>
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
                    <input required className="input" placeholder="Company Name" value={newPartner.companyName} onChange={e => setNewPartner({ ...newPartner, companyName: e.target.value })} />
                    <input required className="input" placeholder="Email" type="email" value={newPartner.email} onChange={e => setNewPartner({ ...newPartner, email: e.target.value })} />
                    <input required className="input" placeholder="Password" type="password" value={newPartner.password} onChange={e => setNewPartner({ ...newPartner, password: e.target.value })} />
                    <input required className="input" placeholder="Address" value={newPartner.address} onChange={e => setNewPartner({ ...newPartner, address: e.target.value })} />
                    <input required className="input" placeholder="Contact Person" value={newPartner.contactPerson} onChange={e => setNewPartner({ ...newPartner, contactPerson: e.target.value })} />
                    <input required className="input" placeholder="Phone Number" value={newPartner.phoneNumber} onChange={e => setNewPartner({ ...newPartner, phoneNumber: e.target.value })} />
                    <input className="input" placeholder="Website (optional)" value={newPartner.website} onChange={e => setNewPartner({ ...newPartner, website: e.target.value })} />
                    <input className="input" placeholder="Logo URL (optional)" value={newPartner.logo} onChange={e => setNewPartner({ ...newPartner, logo: e.target.value })} />
                    <input className="input" placeholder="Industry Type (optional)" value={newPartner.industryType} onChange={e => setNewPartner({ ...newPartner, industryType: e.target.value })} />
                    <input className="input" placeholder="Description (optional)" value={newPartner.description} onChange={e => setNewPartner({ ...newPartner, description: e.target.value })} />
                    <input className="input" placeholder="Social Media Links (optional)" value={newPartner.socialMediaLinks} onChange={e => setNewPartner({ ...newPartner, socialMediaLinks: e.target.value })} />
                    <input className="input" placeholder="Preferred Communication (optional)" value={newPartner.preferredCommunication} onChange={e => setNewPartner({ ...newPartner, preferredCommunication: e.target.value })} />
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
                            <h4 className="font-medium">{partner.companyName}</h4>
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