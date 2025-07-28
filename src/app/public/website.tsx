import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const websites = [
  {
    name: 'Nithin & Keziah',
    url: 'https://nithinandkeziah.matson.app/',
    // Optionally add a thumbnail image if available
    // thumbnail: '/path/to/thumbnail.jpg',
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

const WebsiteGallery = () => {
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
              <Card key={site.url} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md flex flex-col">
                <div className="aspect-[4/3] bg-muted/20 flex items-center justify-center relative overflow-hidden">
                  {/* If you have a thumbnail, use <img src={site.thumbnail} ... /> instead of iframe */}
                  <iframe
                    src={site.url}
                    title={site.name}
                    className="w-full h-full object-cover border-0 rounded-t-lg"
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-serif font-medium mb-2">{site.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 truncate">{site.url.replace('https://', '')}</p>
                  <Button
                    asChild
                    className="w-full rounded-full mt-auto"
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
    </div>
  );
};

export default WebsiteGallery;
