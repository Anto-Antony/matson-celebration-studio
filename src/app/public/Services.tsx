import { Palette, Globe, Calendar, Users, Star, Sparkles, Heart, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Services = () => {
  const cardFeatures = [
    'Pre-designed professional templates',
    'Zero design fees on starter collections',
    'Premium matte and parchment options',
    'Eco-friendly materials available',
    'Custom boxed gift packaging',
    'Multi-religious design templates',
    'Fast 3-5 day delivery'
  ];

  const websiteFeatures = [
    'Drag-and-drop customization',
    'Kerala cultural motifs and themes',
    'Love story timeline builder',
    'Event schedule management',
    'Photo gallery with lightbox',
    'Guest RSVP tracking system',
    'Vendor directory integration',
    'Mobile-responsive design'
  ];

  const planningFeatures = [
    'Venue discovery and booking',
    'Vendor matchmaking system',
    'Budget planning and tracking',
    'Timeline and checklist management',
    'Guest list coordination',
    'Payment tracking dashboard'
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-24 hero-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl font-bold font-serif">Our Services</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Comprehensive wedding solutions that blend Kerala's rich traditions with modern innovation
            </p>
          </div>
        </div>
      </section>

      {/* Service 1: Card Creation Studio */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  Starting from ₹10
                </Badge>
                <h2 className="text-4xl font-bold font-serif">Card Template Collection</h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Browse and select from our curated collection of professionally designed wedding invitation templates. Each design reflects Kerala's rich traditions with modern elegance.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">What's Included:</h3>
                <div className="grid grid-cols-1 gap-3">
                  {cardFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
               
                <Button size="lg" variant="outline" className="btn-kerala-outline">
                  View Gallery
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="card-elegant p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold">Starter Collection</h4>
                  <Badge variant="secondary">₹10 - ₹15</Badge>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Beautiful, budget-friendly designs with no hidden costs
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Palette className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Premium Quality</div>
                    <div className="text-sm text-muted-foreground">Zero design fees</div>
                  </div>
                </div>
              </Card>

              <Card className="card-elegant p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold">Premium Collection</h4>
                  <Badge variant="secondary">₹25 - ₹50</Badge>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Luxury materials with custom packaging options
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <div className="font-medium">Luxury Finish</div>
                    <div className="text-sm text-muted-foreground">Boxed gifts available</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Service 2: Wedding Website Builder */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 lg:order-2">
              <div className="space-y-4">
                <Badge className="bg-accent/10 text-accent border-accent/20">
                  DIY Platform
                </Badge>
                <h2 className="text-4xl font-bold font-serif">Wedding Website Builder</h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Share your love story with the world through beautifully designed wedding websites featuring authentic Kerala cultural elements.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Platform Features:</h3>
                <div className="grid grid-cols-1 gap-3">
                  {websiteFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button size="lg" className="btn-kerala">
                Build Your Website
                <Globe className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <div className="lg:order-1 space-y-6">
              <Card className="card-elegant p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold">Love Story Timeline</h4>
                    <p className="text-muted-foreground text-sm">
                      Create interactive timelines showcasing your journey together with photos and milestones.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="card-elegant p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold">Guest Experience</h4>
                    <p className="text-muted-foreground text-sm">
                      RSVP management, guest wishes wall, and event information all in one place.
                    </p>
                  </div>
                </div>
              </Card>

              
            </div>
          </div>
        </div>
      </section>

      {/* Service 3: Coming Soon - Full Wedding Planning */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <Badge className="bg-primary/10 text-primary border-primary/20">
                Coming Soon
              </Badge>
              <h2 className="text-4xl font-bold font-serif">Complete Wedding Planning</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Your one-stop solution for end-to-end wedding planning. From venue selection to vendor coordination, we're building the ultimate planning platform.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {planningFeatures.map((feature, index) => (
                <Card key={index} className="card-elegant p-6 text-center hover-scale">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-medium">{feature}</p>
                </Card>
              ))}
            </div>

         
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;