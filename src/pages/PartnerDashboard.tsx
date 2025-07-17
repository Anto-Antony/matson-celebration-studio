import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, ShoppingCart, Calendar, Star, Eye, Download } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const templates = [
  {
    id: 1,
    name: 'Kerala Traditional',
    price: 5000,
    category: 'Traditional',
    preview: '/api/placeholder/400/300',
    features: ['Responsive Design', 'Gallery', 'RSVP', 'Music Player'],
    rating: 4.8,
    reviews: 24
  },
  {
    id: 2,
    name: 'Modern Elegance',
    price: 7500,
    category: 'Modern',
    preview: '/api/placeholder/400/300',
    features: ['Animation Effects', 'Video Background', 'Guest Book', 'Timeline'],
    rating: 4.9,
    reviews: 18
  },
  {
    id: 3,
    name: 'Royal Heritage',
    price: 6000,
    category: 'Heritage',
    preview: '/api/placeholder/400/300',
    features: ['Cultural Themes', 'Multi-language', 'Photo Album', 'Events'],
    rating: 4.7,
    reviews: 31
  },
  {
    id: 4,
    name: 'Minimalist Chic',
    price: 4500,
    category: 'Minimalist',
    preview: '/api/placeholder/400/300',
    features: ['Clean Design', 'Fast Loading', 'SEO Optimized', 'Mobile First'],
    rating: 4.6,
    reviews: 15
  }
];

const purchaseHistory = [
  {
    id: 1,
    template: 'Kerala Traditional',
    customer: 'Nithin & Keziah',
    date: '2024-07-15',
    amount: 5000,
    status: 'Delivered'
  },
  {
    id: 2,
    template: 'Modern Elegance',
    customer: 'Rafael & Kirste',
    date: '2024-07-12',
    amount: 7500,
    status: 'In Progress'
  },
  {
    id: 3,
    template: 'Royal Heritage',
    customer: 'Duke & Elaine',
    date: '2024-07-10',
    amount: 6000,
    status: 'Delivered'
  }
];

const PartnerDashboard = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const partnerName = id?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Partner';
  const categories = ['All', 'Traditional', 'Modern', 'Heritage', 'Minimalist'];
  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
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

            {/* Templates Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template, idx) => (
                <Card 
                  key={template.id} 
                  className="card-premium group"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 to-accent/5 rounded-t-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="backdrop-blur-sm">
                        {template.category}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button size="sm" className="w-full btn-kerala">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-serif font-medium group-hover:text-primary transition-colors">
                        {template.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{template.rating}</span>
                        <span className="text-muted-foreground">({template.reviews})</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex flex-wrap gap-1">
                        {template.features.slice(0, 3).map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-primary">
                        ₹{template.price.toLocaleString()}
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" className="btn-kerala">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Use
                        </Button>
                      </div>
                    </div>
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