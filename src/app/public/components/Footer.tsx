import { Heart, MapPin, Phone, Mail, Globe, Instagram, Facebook, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import matsonIcon from '../../../assets/matson-icon.png';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border/50">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center space-x-3">
                <img src={matsonIcon} alt="Matson Logo" className="w-10 h-10 object-contain" />
                <div>
                  <span className="text-xl font-bold text-foreground block">Matson</span>
                  <span className="text-sm text-primary">Wedding Solutions</span>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                The artistry of love, etched in ink. Creating beautiful wedding memories across Kerala since 2008.
              </p>
              <div className="flex space-x-4">
                <a href="https://www.matsoncards.com" className="text-muted-foreground hover:text-primary transition-smooth">
                  <Globe className="w-5 h-5" />
                </a>
                <a href="https://instagram.com/matson_cards_" className="text-muted-foreground hover:text-primary transition-smooth">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://facebook.com/matson.cards" className="text-muted-foreground hover:text-primary transition-smooth">
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <div className="space-y-3">
                {[
                  { name: 'About Us', path: '/about' },
                  { name: 'Our Services', path: '/services' },
                  { name: 'Design Gallery', path: '/gallery' },
                  // { name: 'Testimonials', path: '/testimonials' },
                  { name: 'Contact Us', path: '/contact' }
                ].map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="block text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Our Services</h3>
              <div className="space-y-3">
                {[
                  'Wedding Card Design',
                  'Website Builder',
                  'Premium Collections',
                  'Eco-Friendly Options',
                  'Custom Packaging',
                  'Full Planning (Coming Soon)'
                ].map((service) => (
                  <div key={service} className="text-muted-foreground">
                    {service}
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter & Contact */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Stay Updated</h3>
              <p className="text-muted-foreground text-sm">
                Subscribe to get the latest designs and wedding inspiration
              </p>
              <div className="flex space-x-2">
                <Input placeholder="your@email.com" className="flex-1" />
                <Button size="sm" className="btn-kerala">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>062385 45430</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>hello@matsoncards.com</span>
                </div>
                <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Kottayam, Kerala</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © 2024 Matson Wedding Solutions. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-smooth">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-smooth">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-smooth">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;