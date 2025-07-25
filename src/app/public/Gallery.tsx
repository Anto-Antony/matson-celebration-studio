import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Search } from 'lucide-react';
import Footer from '@/app/public/components/Footer';
import { AnimatePresence, motion } from 'framer-motion';

// Dynamically import all images from cards subfolders
const imageModules = import.meta.glob('@/assets/cards/*/*.{jpg,png,jpeg,svg}', { eager: true, import: 'default' });

// Group images by folder (model)
const groupedTemplates: Record<string, { images: { src: string; fileName: string }[]; category: string; price: string; popular: boolean; description: string }> = {};
Object.entries(imageModules).forEach(([path, src]) => {
  const match = path.match(/cards\/(\d+)\/(.+)$/);
  const model = match ? match[1] : 'Unknown';
  const filename = match ? match[2] : 'Image';
  if (!groupedTemplates[model]) {
    groupedTemplates[model] = {
      images: [],
      category: model,
      price: '₹15',
      popular: false,
      description: `Model ${model}`,
    };
  }
  groupedTemplates[model].images.push({ src: src as string, fileName: filename });
});

const templates = Object.entries(groupedTemplates).map(([model, data], idx) => ({
  id: idx + 1,
  name: `Model ${model}`,
  ...data,
}));

const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  // For each card, track the current image index
  const [carouselIndexes, setCarouselIndexes] = useState<{ [key: string]: number }>(() => {
    const initial: { [key: string]: number } = {};
    templates.forEach((t) => {
      initial[t.category] = 0;
    });
    return initial;
  });
  // Track which carousels are hovered (by card hover)
  const [hovered, setHovered] = useState<{ [key: string]: boolean }>({});
  // Track which carousels are paused (by dot hover)
  const [paused, setPaused] = useState<{ [key: string]: boolean }>({});
  // Store random intervals for each card
  const [intervals, setIntervals] = useState<{ [key: string]: number }>({});

  // Generate random intervals for each card on mount
  useEffect(() => {
    const newIntervals: { [key: string]: number } = {};
    templates.forEach((t) => {
      // Random interval between 5000ms and 9000ms
      newIntervals[t.category] = 5000 + Math.floor(Math.random() * 4000);
    });
    setIntervals(newIntervals);
  }, [templates.length]);

  // Set up interval to auto-advance images for each card
  useEffect(() => {
    const timers: { [key: string]: NodeJS.Timeout } = {};
    templates.forEach((t) => {
      const cat = t.category;
      // If paused by dot hover, do nothing
      if (paused[cat]) return;
      // If hovered, use 5s interval
      if (hovered[cat]) {
        timers[cat] = setInterval(() => {
          setCarouselIndexes((prev) => ({
            ...prev,
            [cat]: ((prev[cat] || 0) + 1) % t.images.length,
          }));
        }, 5000);
      } else {
        // Use random interval for each card
        timers[cat] = setInterval(() => {
          setCarouselIndexes((prev) => ({
            ...prev,
            [cat]: ((prev[cat] || 0) + 1) % t.images.length,
          }));
        }, intervals[cat] || 6000);
      }
    });
    return () => {
      Object.values(timers).forEach(clearInterval);
    };
  }, [templates, hovered, paused, intervals]);

  const filteredTemplates = selectedCategory === 'All'
    ? templates
    : templates.filter(template => template.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-medium mb-6">
              Wedding invitation templates
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Choose from our collection of beautifully designed templates. Each design celebrates Kerala's rich cultural heritage.
            </p>
            <div className="flex justify-center">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                  // Search logic can be added here
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full px-6"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md"
                onMouseEnter={() => setHovered((prev) => ({ ...prev, [template.category]: true }))}
                onMouseLeave={() => setHovered((prev) => ({ ...prev, [template.category]: false }))}
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <AnimatePresence initial={false} custom={carouselIndexes[template.category]}>
                    <motion.img
                      key={carouselIndexes[template.category] || 0}
                      src={template.images[carouselIndexes[template.category] || 0].src}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 absolute inset-0"
                      initial={{ x: 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -100, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  {/* Overlay content */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {template.popular && (
                      <Badge className="bg-primary text-primary-foreground">
                        Popular
                      </Badge>
                    )}
                    <Badge variant="secondary" className="bg-white/90 text-foreground">
                      {template.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-8 h-8 p-0 rounded-full bg-white/90 hover:bg-white"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* Preview button removed */}
                  </div>
                  {/* Dots for carousel */}
                  <div
                    className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 z-10"
                    onMouseLeave={() => setPaused((prev) => ({ ...prev, [template.category]: false }))}
                  >
                    {template.images.map((_, imgIdx) => (
                      <button
                        key={imgIdx}
                        className={`w-2.5 h-2.5 rounded-full border border-white transition-all duration-200 ${carouselIndexes[template.category] === imgIdx ? 'bg-white' : 'bg-white/50'}`}
                        style={{ outline: carouselIndexes[template.category] === imgIdx ? '2px solid #6366f1' : 'none' }}
                        onMouseEnter={() => {
                          setCarouselIndexes((prev) => ({ ...prev, [template.category]: imgIdx }));
                          setPaused((prev) => ({ ...prev, [template.category]: true }));
                        }}
                        aria-label={`Show image ${imgIdx + 1}`}
                        type="button"
                      />
                    ))}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-lg font-bold text-primary">{template.price}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 rounded-full">
                      Quick view
                    </Button>
                    <Button className="flex-1 rounded-full">
                      Select
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-medium mb-4">
            Need something custom?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our design team can create a completely custom invitation just for you. Starting from ₹50.
          </p>
          <Button size="lg" className="rounded-full px-8">
            Request custom design
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;