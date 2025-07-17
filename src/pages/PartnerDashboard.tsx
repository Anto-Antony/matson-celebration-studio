
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, ShoppingCart, Calendar, Star, Eye, Download } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';

const PartnerDashboard = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [purchaseHistory, setPurchaseHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      const { data, error } = await supabase
        .from('purchase_history')
        .select('*')
        .order('date', { ascending: false });
      if (!error && data) {
        setPurchaseHistory(data);
      }
    };
    fetchPurchaseHistory();
  }, []);

  const templates = [
    {
      id: 1,
      name: 'Nithin & Keziah',
      price: 5000,
      category: 'Traditional',
      preview: 'https://nithinandkeziah.matson.app/',
      features: ['Responsive Design', 'Gallery', 'RSVP', 'Music Player'],
      rating: 4.8,
      reviews: 24
    },
    {
      id: 2,
      name: 'Rafael & Kirste',
      price: 7500,
      category: 'Modern',
      preview: 'https://rafaelandkirste.matson.app/',
      features: ['Animation Effects', 'Video Background', 'Guest Book', 'Timeline'],
      rating: 4.9,
      reviews: 18
    },
    {
      id: 3,
      name: 'Duke & Elaine',
      price: 6000,
      category: 'Heritage',
      preview: 'https://dukeandelaine.matson.app/',
      features: ['Cultural Themes', 'Multi-language', 'Photo Album', 'Events'],
      rating: 4.7,
      reviews: 31
    },
    {
      id: 4,
      name: 'Arun & Vidya',
      price: 4500,
      category: 'Minimalist',
      preview: 'https://arunandvidya.matson.app/',
      features: ['Clean Design', 'Fast Loading', 'SEO Optimized', 'Mobile First'],
      rating: 4.6,
      reviews: 15
    }
  ];

  const partnerName = id?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Partner';
  const categories = ['All', 'Traditional', 'Modern', 'Heritage', 'Minimalist'];
  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background flex flex-col">
     
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="glass-morphism p-6 rounded-2xl">
            <div className="flex items-center gap-4 mb-4">
              <Heart className="w-8 h-8 text-primary pulse-glow" />
              <div>
                <h1 className="text-3xl font-serif font-medium text-gradient">
                  Welcome, {partnerName}!
                </h1>
                <p className="text-muted-foreground">
                  Manage your wedding templates and track your business
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-primary/5 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold text-primary">₹18,500</p>
              </div>
              <div className="bg-primary/5 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Templates Sold</p>
                <p className="text-2xl font-bold text-primary">3</p>
              </div>
              <div className="bg-primary/5 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Rating</p>
                <p className="text-2xl font-bold text-primary">4.8★</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="templates">Wedding Templates</TabsTrigger>
            <TabsTrigger value="history">Purchase History</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-6">
            {/* Category Filter */}
            <Card className="card-premium p-6">
              <h3 className="text-xl font-serif font-medium mb-4">Browse Templates</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="transition-smooth"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Templates Gallery (Website Style) */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTemplates.map((template, idx) => (
                <Card key={template.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md flex flex-col">
                  <div className="aspect-[4/3] bg-muted/20 flex items-center justify-center relative overflow-hidden">
                    {/* If you have a thumbnail, use <img src={template.preview} ... /> instead of iframe */}
                    <iframe
                      src={template.preview}
                      title={template.name}
                      className="w-full h-full object-cover border-0 rounded-t-lg"
                      loading="lazy"
                      sandbox="allow-scripts allow-same-origin"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-serif font-medium mb-2">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 truncate">{template.preview.replace('/api/placeholder/', '')}</p>
                    <Button
                      asChild
                      className="w-full rounded-full mt-auto"
                    >
                      <a href={template.preview} target="_blank" rel="noopener noreferrer">
                        Visit Website
                      </a>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="card-premium">
              <div className="p-6 border-b">
                <h3 className="text-xl font-serif font-medium">Purchase History</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Track all your template purchases and deliveries
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {purchaseHistory.map((purchase) => (
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
                          <Badge variant={purchase.status === 'Delivered' ? 'default' : 'secondary'}>
                            {purchase.status}
                          </Badge>
                        </div>
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
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default PartnerDashboard;