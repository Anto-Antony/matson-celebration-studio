import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Heart, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

import { SeasonalHoverCards } from "@/components/ui/seasonal-hover-cards"

// Define the interface for invitation card data from Supabase
interface InvitationCard {
  card_name: string;
  description: string | null;
  image_path: string[] | null;
  price: number;
}

// Define card structure for UI
interface CardData {
  title: string;
  description: string;
  imageSrc: string;
  subtitle: string;
}

const FeaturedSection = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch invitation cards from Supabase
  useEffect(() => {
    const fetchFeaturedCards = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('invitation_card')
          .select('card_name, description, image_path, price')
          .limit(3) // Only get 3 cards for featured section
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching featured cards:', error);
          toast({
            title: "Error",
            description: "Failed to load featured cards. Please try again.",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          // Transform database data to card format
          const transformedCards: CardData[] = data.map((card: InvitationCard, index: number) => {
            // Handle image_path - parse JSON objects to extract URLs
            let imageSrc = '/placeholder.svg'; // Default fallback
            
            if (card.image_path && Array.isArray(card.image_path) && card.image_path.length > 0) {
              try {
                // Get the first image from the array
                const firstImageData = card.image_path[0];
                const parsedData = typeof firstImageData === 'string' ? JSON.parse(firstImageData) : firstImageData;
                imageSrc = parsedData.url || '/placeholder.svg';
              } catch (error) {
                console.error('Error parsing image data:', error);
                imageSrc = '/placeholder.svg';
              }
            }

            return {
              title: card.card_name,
              description: card.description || `${card.card_name} invitation template`,
              imageSrc,
              subtitle: `₹${card.price}`
            };
          });

          setCards(transformedCards);
        }
      } catch (error) {
        console.error('Error fetching featured cards:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while loading featured cards.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCards();
  }, [toast]);

  // Show loading state
  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            <motion.div 
              className="lg:col-span-4"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="h-full flex items-center">
                <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 h-full flex items-center">
                  <div className="text-center lg:text-left">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      <Heart className="w-12 h-12 text-primary mx-auto lg:mx-0 mb-6" />
                      <h3 className="text-2xl font-serif font-medium mb-4 text-foreground">
                        Everything you need to plan the wedding you want.
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        For all the days along the way. From the perfect invitation to your dream wedding website.
                      </p>
                    </motion.div>
                  </div>
                </Card>
              </div>
            </motion.div>
            
            <div className="lg:col-span-8">
              <div className="grid grid-rows-2 gap-6 h-full">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
                <div className="flex items-center justify-center">
                  <p className="text-muted-foreground">Loading featured templates...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Inspirational Message Box */}
          <motion.div 
            className="lg:col-span-4"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="h-full flex items-center">
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 h-full flex items-center">
                <div className="text-center lg:text-left">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Heart className="w-12 h-12 text-primary mx-auto lg:mx-0 mb-6" />
                    <h3 className="text-2xl font-serif font-medium mb-4 text-foreground">
                      Everything you need to plan the wedding you want.
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      For all the days along the way. From the perfect invitation to your dream wedding website.
                    </p>
                  </motion.div>
                </div>
              </Card>
            </div>
          </motion.div>
   
          {/* Right Feature Modules */}
          <div className="lg:col-span-8">
            <div className="grid grid-rows-2 gap-6 h-full">
              
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <SeasonalHoverCards cards={cards} />

              {/* Floating View More Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="absolute top-4 right-4 z-10"
              >
                <Link to="/gallery">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="group bg-white/90 backdrop-blur-sm hover:bg-primary hover:text-white border-primary/30 hover:border-primary transition-all duration-300 px-4 py-2 shadow-lg hover:shadow-xl"
                  >
                    View More
                    <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

              {/* Bottom: Wedding Website */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="group"
              >
                <SeasonalHoverCards cards={cards} />
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;