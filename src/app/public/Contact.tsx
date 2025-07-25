import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Globe, Instagram, Facebook } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-24 hero-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl font-bold">Get In Touch</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Ready to start your wedding journey? We're here to make your special day unforgettable
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Send us a Message</h2>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you within 24 hours
                </p>
              </div>

              <Card className="card-elegant p-8">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Enter your first name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Enter your last name" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="your@email.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+91 98765 43210" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service">Service Interest</Label>
                    <select className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground">
                      <option value="">Select a service</option>
                      <option value="cards">Wedding Card Design</option>
                      <option value="website">Wedding Website Builder</option>
                      <option value="planning">Full Wedding Planning (Beta)</option>
                      <option value="consultation">General Consultation</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us about your wedding plans and how we can help..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" size="lg" className="btn-kerala w-full">
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              </Card>
            </div>

            {/* Contact Details */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Contact Information</h2>
                <p className="text-muted-foreground">
                  Visit our offices or reach out through your preferred channel
                </p>
              </div>

              {/* Office Locations */}
              <div className="space-y-6">
                <Card className="card-elegant p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Primary Office</h3>
                      <div className="text-muted-foreground space-y-1">
                        <p>Mattathil Building, MC Road</p>
                        <p>Vazhappally P.O, Changanassery</p>
                        <p>Kottayam, Kerala, 686103</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="card-elegant p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-accent" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Design Studio</h3>
                      <div className="text-muted-foreground space-y-1">
                        <p>Creative Design Center</p>
                        <p>Pathanamthitta, Kerala</p>
                        <p>Specialized Design Services</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Contact Methods */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Get in Touch</h3>
                
                <Card className="card-elegant p-4">
                  <div className="flex items-center space-x-4">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium">Phone</div>
                      <a href="tel:062385 45430" className="text-muted-foreground hover:text-primary transition-smooth">
                        062385 45430
                      </a>
                    </div>
                  </div>
                </Card>

                <Card className="card-elegant p-4">
                  <div className="flex items-center space-x-4">
                    <MessageCircle className="w-5 h-5 text-kerala-green" />
                    <div>
                      <div className="font-medium">WhatsApp</div>
                      <a href="https://wa.me/916238545430" className="text-muted-foreground hover:text-kerala-green transition-smooth">
                        Chat with us instantly
                      </a>
                    </div>
                  </div>
                </Card>

                <Card className="card-elegant p-4">
                  <div className="flex items-center space-x-4">
                    <Mail className="w-5 h-5 text-accent" />
                    <div>
                      <div className="font-medium">Email</div>
                      <a href="mailto:hello@matsoncards.com" className="text-muted-foreground hover:text-accent transition-smooth">
                        hello@matsoncards.com
                      </a>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Business Hours */}
              <Card className="card-elegant p-6">
                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-primary mt-1" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Business Hours</h3>
                    <div className="text-muted-foreground space-y-1">
                      <div className="flex justify-between">
                        <span>Monday - Friday</span>
                        <span>9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday</span>
                        <span>9:00 AM - 4:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday</span>
                        <span>By Appointment</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Social Links */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Follow Us</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline" className="btn-kerala-outline" asChild>
                    <a href="https://www.matsoncards.com" target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4 mr-2" />
                      Website
                    </a>
                  </Button>
                  <Button variant="outline" className="btn-kerala-outline" asChild>
                    <a href="https://instagram.com/matson_cards_" target="_blank" rel="noopener noreferrer">
                      <Instagram className="w-4 h-4 mr-2" />
                      Instagram
                    </a>
                  </Button>
                  <Button variant="outline" className="btn-kerala-outline" asChild>
                    <a href="https://facebook.com/matson.cards" target="_blank" rel="noopener noreferrer">
                      <Facebook className="w-4 h-4 mr-2" />
                      Facebook
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;