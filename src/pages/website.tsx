import { useEffect, useState } from 'react';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { newSupabase } from '@/integrations/supabase/client'; // Assuming this is the new client

const WebsiteGallery = () => {
  const [websites, setWebsites] = useState<any[]>([]);

  useEffect(() => {
    const fetchWebsites = async () => {
      const { data, error } = await newSupabase
        .from('user_profile')
        .select('bride_name, groom_name, website_name');

      if (error) {
        console.error('Error fetching websites:', error);
      } else {
        setWebsites(data || []);
      }
    };

    fetchWebsites();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-medium mb-6">
              Wedding Website Gallery
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Explore real wedding websites created with Matson. Click any card to view the live site.
            </p>
          </div>
        </div>
      </section>

      {/* Websites Grid */}
      <section className="py-12 flex-1">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {websites.map((site, idx) => (
              <Card key={idx} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md flex flex-col">
                <div className="aspect-[4/3] bg-muted/20 flex items-center justify-center relative overflow-hidden">
                  <iframe
                    src={`https://${site.website_name}.matson.app`}
                    title={`${site.bride_name} & ${site.groom_name}`}
                    className="w-full h-full object-cover border-0 rounded-t-lg"
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-serif font-medium mb-2">{`${site.bride_name} & ${site.groom_name}`}</h3>
                  <p className="text-sm text-muted-foreground mb-4 truncate">{`${site.website_name}.matson.app`}</p>
                  <Button
                    asChild
                    className="w-full rounded-full mt-auto"
                  >
                    <a href={`https://${site.website_name}.matson.app`} target="_blank" rel="noopener noreferrer">
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
};

export default WebsiteGallery;
