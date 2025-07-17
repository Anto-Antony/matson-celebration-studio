import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, User, Lock } from 'lucide-react';

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [partnerName, setPartnerName] = useState('');
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (credentials.username && credentials.password) {
      // Check if it's Matson Company login (hardcoded admin)

      if (credentials.username === 'techmatcso2025@gmail.com' && credentials.password === 'password') {
        localStorage.setItem('matson_logged_in', 'true');
        window.location.href = '/dashboard/company';
        return;
      }

      // Check partner credentials from Supabase
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('email', credentials.username)
        .eq('password', credentials.password)
        .single();

      if (error || !data) {
        setLoginError('Invalid partner credentials');
        return;
      }

      // Redirect to partner dashboard using partner id
      localStorage.setItem('matson_logged_in', 'true');
      window.location.href = `/partner/${data.id}`;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="hero-gradient absolute inset-0"></div>
      
      <Card className="glass-morphism w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-8">
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
              Email / Partner Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                placeholder="Enter your email or partner name"
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
          {loginError && (
            <div className="text-red-500 text-center text-sm mt-2">{loginError}</div>
          )}
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