import { Star, Quote, Heart, Users, Calendar, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Priya & Rajesh',
      location: 'Kottayam, Kerala',
      service: 'Wedding Cards + Website',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=100&h=100&fit=crop&crop=faces',
      testimonial: "Matson exceeded our expectations! The wedding cards were absolutely beautiful with perfect Kerala traditional designs. The website they created helped us share our story with family abroad. Highly recommended!",
      date: 'March 2024',
      featured: true
    },
    {
      id: 2,
      name: 'Fatima & Mohammed',
      location: 'Malappuram, Kerala',
      service: 'Premium Card Collection',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      testimonial: "The team understood our Islamic wedding traditions perfectly. The cards were elegant, affordable, and delivered on time. The ₹15 collection looked way more expensive than the price!",
      date: 'February 2024',
      featured: false
    },
    {
      id: 3,
      name: 'Sarah & David',
      location: 'Ernakulam, Kerala',
      service: 'Christian Wedding Website',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=faces',
      testimonial: "As a Christian couple, we loved how Matson incorporated our faith elements into the website design. The RSVP system made guest management so easy. Professional service throughout!",
      date: 'January 2024',
      featured: true
    },
    {
      id: 4,
      name: 'Anita & Suresh',
      location: 'Thrissur, Kerala',
      service: 'Traditional Hindu Cards',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces',
      testimonial: "Beautiful traditional designs with modern printing quality. The gold foil work was exquisite and the boxed packaging made it feel truly premium. Worth every rupee!",
      date: 'December 2023',
      featured: false
    },
    {
      id: 5,
      name: 'Meera & Arun',
      location: 'Palakkad, Kerala',
      service: 'Eco-Friendly Collection',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=faces',
      testimonial: "We chose the eco-friendly collection for our environment-conscious wedding. The recycled paper looked beautiful and aligned with our values. Great sustainable option!",
      date: 'November 2023',
      featured: false
    },
    {
      id: 6,
      name: 'Lakshmi & Vikram',
      location: 'Kozhikode, Kerala',
      service: 'Complete Package',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces',
      testimonial: "From wedding cards to the website, everything was perfectly coordinated. The team's attention to detail and customer service is exceptional. Made our wedding planning stress-free!",
      date: 'October 2023',
      featured: true
    }
  ];

  const stats = [
    { number: '3000+', label: 'Happy Couples', icon: Heart },
    { number: '2500+', label: 'Cards Designed', icon: Award },
    { number: '850+', label: 'Websites Built', icon: Users },
    { number: '15+', label: 'Years Experience', icon: Calendar }
  ];

  const featuredTestimonials = testimonials.filter(t => t.featured);
  const regularTestimonials = testimonials.filter(t => !t.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-24 hero-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl font-bold">What Our Couples Say</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Real stories from real couples who trusted us with their special day
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="card-elegant p-6 text-center hover-scale">
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-foreground mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Stories</h2>
            <p className="text-muted-foreground">Heartfelt experiences from our cherished couples</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {featuredTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="card-elegant p-8 hover-scale">
                <div className="space-y-6">
                  {/* Quote */}
                  <div className="relative">
                    <Quote className="w-8 h-8 text-primary/30 absolute -top-2 -left-2" />
                    <p className="text-muted-foreground leading-relaxed pl-6">
                      "{testimonial.testimonial}"
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                      </Avatar>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{testimonial.service}</Badge>
                      <div className="text-sm text-muted-foreground mt-1">{testimonial.date}</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Regular Testimonials Grid */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">More Happy Couples</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="card-elegant p-6 hover-scale">
                <div className="space-y-4">
                  {/* Rating */}
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    "{testimonial.testimonial}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.location}</div>
                    </div>
                  </div>

                  {/* Service & Date */}
                  <div className="flex justify-between items-center pt-2 border-t border-border/50">
                    <Badge variant="outline" className="text-xs">{testimonial.service}</Badge>
                    <span className="text-xs text-muted-foreground">{testimonial.date}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Video Stories</h2>
            <p className="text-muted-foreground">Watch couples share their Matson experience</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="card-elegant overflow-hidden hover-scale">
              <div className="aspect-video bg-muted/50 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Priya & Rajesh</h3>
                    <p className="text-sm text-muted-foreground">Their Wedding Journey</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="card-elegant overflow-hidden hover-scale">
              <div className="aspect-video bg-muted/50 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                    <Heart className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Sarah & David</h3>
                    <p className="text-sm text-muted-foreground">Website Success Story</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Ready to Join Our Happy Couples?</h2>
              <p className="text-muted-foreground leading-relaxed">
                Let us help you create beautiful memories that will last a lifetime. Start your wedding journey with Matson today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-kerala px-8 py-3 rounded-lg font-medium transition-smooth hover:scale-105">
                <Heart className="w-5 h-5 mr-2 inline" />
                Start Your Journey
              </button>
              <button className="btn-kerala-outline px-8 py-3 rounded-lg font-medium border-2 transition-smooth hover:scale-105">
                Get Free Consultation
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;