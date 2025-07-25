import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import heroImage from '@/assets/hero-wedding.jpg';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex flex-col sm:flex-row items-center justify-center overflow-hidden">
      {/* Desktop background image */}
      <div 
        className="hidden sm:block absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Mobile image on top */}
      <div className="block sm:hidden w-full mt-4">
        <img 
          src={heroImage} 
          alt="Wedding Hero" 
          className="w-full h-64 object-cover rounded-2xl shadow-lg" 
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center w-full">
        <div
          className="max-w-5xl mx-auto 
            bg-white text-matson-black shadow-lg rounded-2xl p-6
            sm:bg-transparent sm:text-white sm:shadow-none sm:rounded-none sm:p-0
            transition-colors duration-300"
        >
          <h1 className="font-serif text-4xl md:text-7xl font-medium mb-6 leading-tight">
            Wedding planning starts here
          </h1>
          <p className="text-lg md:text-2xl mb-12 text-black/80 sm:text-white/90 max-w-3xl mx-auto leading-relaxed font-light">
            From beautiful invitation templates and wedding websites to full planning services — Matson is here for all the days along the way
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10 sm:mb-16">
            <Link to="/gallery">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-matson-black text-matson-black hover:bg-matson-black hover:text-white text-lg px-8 py-4 rounded-full font-medium bg-transparent sm:border-white sm:text-white sm:hover:bg-white sm:hover:text-matson-black"
              >
                Browse card templates
              </Button>
            </Link>
            <Link to="/website">  
            <Button 
              size="lg" 
              className="border-2 border-matson-black text-matson-black hover:bg-matson-black hover:text-white text-lg px-8 py-4 rounded-full font-medium bg-transparent sm:border-white sm:text-white sm:hover:bg-white sm:hover:text-matson-black"
              >
              Browse website templates
            </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator (desktop only) */}
      <div className="hidden sm:flex absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-8 border border-white/50 rounded-full flex items-center justify-center">
          <ChevronDown className="w-4 h-4 text-white/50" />
        </div>
      </div>
    </div>
  );
};

export default Hero;