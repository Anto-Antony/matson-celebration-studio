import { MapPin, Phone, Globe, Instagram, Facebook, Users, Award, Calendar, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-24 hero-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl font-bold font-serif">About Matson Wedding Solutions</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              The artistry of love, etched in ink. From humble beginnings in Kottayam to becoming Kerala's most trusted wedding partner.
            </p>
          </div>
        </div>
      </section>

      {/* Company History */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold font-serif">Our Story</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Founded in the heart of Kottayam, Kerala, Matson Wedding Cards began as a small family workshop crafting bespoke paper invitations. Our journey started with a simple belief: every love story deserves to be told beautifully.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Over the years, we've earned a reputation for affordability and creativity—introducing the first ₹10 and ₹15 premium wedding card collections in the region. Today, we embrace digital innovation while preserving the artisanal quality that defines us.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="card-elegant p-4 text-center">
                  <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">15+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </Card>
                <Card className="card-elegant p-4 text-center">
                  <Users className="w-8 h-8 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold">3000+</div>
                  <div className="text-sm text-muted-foreground">Happy Couples</div>
                </Card>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="card-elegant p-6">
                <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
                <p className="text-muted-foreground">
                  To make every couple's wedding journey memorable and stress-free by providing affordable, elegant, and culturally-rich wedding solutions that celebrate Kerala's diverse traditions.
                </p>
              </Card>

              <Card className="card-elegant p-6">
                <h3 className="text-xl font-semibold mb-4">Our Vision</h3>
                <p className="text-muted-foreground">
                  To become Kerala's premier one-stop wedding planning platform, seamlessly blending traditional artistry with cutting-edge technology to serve couples across India and beyond.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Locations & Contact */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-serif mb-4">Our Locations</h2>
            <p className="text-muted-foreground">Serving couples across Kerala from our strategic locations</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Primary Office */}
            <Card className="card-elegant p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold">Primary Office</h3>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <p>Mattathil Building, MC Road</p>
                  <p>Vazhappally P.O, Changanassery</p>
                  <p>Kottayam, Kerala, 686103</p>
                </div>
                <div className="flex items-center space-x-2 text-primary">
                  <Phone className="w-4 h-4" />
                  <span>062385 45430</span>
                </div>
              </div>
            </Card>

            {/* Design Studio */}
            <Card className="card-elegant p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Award className="w-6 h-6 text-accent" />
                  <h3 className="text-xl font-semibold">Design Studio</h3>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <p>Creative Design Center</p>
                  <p>Pathanamthitta, Kerala</p>
                  <p>Specialized Design Services</p>
                </div>
                <div className="text-accent font-medium">
                  Custom Design Hub
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold font-serif">Connect With Us</h2>
              <p className="text-muted-foreground">
                Follow our journey and stay updated with the latest designs and wedding trends
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" className="btn-kerala-outline" asChild>
                <a href="https://www.matsoncards.com" target="_blank" rel="noopener noreferrer">
                  <Globe className="w-4 h-4 mr-2" />
                  matsoncards.com
                </a>
              </Button>
              <Button variant="outline" className="btn-kerala-outline" asChild>
                <a href="https://instagram.com/matson_cards_" target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-4 h-4 mr-2" />
                  @matson_cards_
                </a>
              </Button>
              <Button variant="outline" className="btn-kerala-outline" asChild>
                <a href="https://facebook.com/matson.cards" target="_blank" rel="noopener noreferrer">
                  <Facebook className="w-4 h-4 mr-2" />
                  Matson Cards
                </a>
              </Button>
            </div>

            {/* Future Vision */}
            <Card className="card-elegant p-8 mt-12">
              <div className="flex items-start space-x-4">
                <Target className="w-8 h-8 text-primary mt-1" />
                <div className="space-y-3 text-left">
                  <h3 className="text-xl font-semibold">Looking Ahead</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our journey doesn't end with cards and websites. We're building towards becoming a comprehensive wedding planning platform, offering venue selection, vendor management, budget planning, and timeline coordination. Join us as we revolutionize how Kerala celebrates love.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;