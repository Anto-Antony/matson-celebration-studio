import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, User, Lock } from 'lucide-react';
import Footer from '@/app/public/components/Footer';

const websites = [
  {
    name: 'Nithin & Keziah',
    url: 'https://nithinandkeziah.matson.app/',
  },
  {
    name: 'Rafael & Kirste',
    url: 'https://rafaelandkirste.matson.app/',
  },
  {
    name: 'Duke & Elaine',
    url: 'https://dukeandelaine.matson.app/',
  },
  {
    name: 'Arun & Vidya',
    url: 'https://arunandvidya.matson.app/',
  },
];

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [partnerName, setPartnerName] = useState('');
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.username && credentials.password) {
      setPartnerName(credentials.username);
      setIsLoggedIn(true);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Welcome Header */}
        <section className="py-16 hero-gradient">
          <div className="container mx-auto px-4 text-center">
            <div className="glass-morphism max-w-2xl mx-auto p-8 rounded-2xl">
              <Heart className="w-12 h-12 text-primary mx-auto mb-4 float-animation" />
              <h1 className="text-4xl md:text-5xl font-serif font-medium mb-4 text-gradient">
                Welcome, {partnerName}!
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                Thank you for partnering with Matson Wedding Solutions. 
                Explore our beautiful wedding websites created for couples in love.
              </p>
              <Button 
                onClick={() => setIsLoggedIn(false)}
                variant="outline"
                className="btn-kerala-outline"
              >
                Logout
              </Button>
            </div>
          </div>
        </section>

        {/* Wedding Websites Gallery */}
        <section className="py-16 flex-1">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6">
                Partner Wedding Gallery
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover the beautiful wedding websites we've crafted together
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {websites.map((site, idx) => (
                <Card 
                  key={site.url} 
                  className="card-premium group cursor-pointer"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center relative overflow-hidden rounded-t-lg">
                    <iframe
                      src={site.url}
                      title={site.name}
                      className="w-full h-full border-0"
                      loading="lazy"
                      sandbox="allow-scripts allow-same-origin"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="p-6 relative z-10">
                    <h3 className="text-xl font-serif font-medium mb-2 group-hover:text-primary transition-colors">
                      {site.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {site.url.replace('https://', '')}
                    </p>
                    <Button
                      asChild
                      className="w-full btn-kerala"
                    >
                      <a href={site.url} target="_blank" rel="noopener noreferrer">
                        Visit Website
                      </a>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="hero-gradient absolute inset-0"></div>
      
      <Card className="glass-morphism w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-8">
          <Heart className="w-12 h-12 text-primary mx-auto mb-4 pulse-glow" />
          <h1 className="text-3xl font-serif font-medium mb-2 text-gradient">
            Partner Login
          </h1>
          <p className="text-muted-foreground">
            Access your Matson wedding portfolio
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              Partner Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                placeholder="Enter your name"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                className="pl-10 transition-smooth focus:shadow-md"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="pl-10 transition-smooth focus:shadow-md"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full btn-kerala"
            disabled={!credentials.username || !credentials.password}
          >
            Login to Partner Portal
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Need access? Contact Matson Wedding Solutions
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;