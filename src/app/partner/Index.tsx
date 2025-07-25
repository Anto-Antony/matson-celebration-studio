
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-100 flex flex-col items-center justify-center">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-pink-600 mb-6">
          Wedding Bells
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-2xl mx-auto">
          Your perfect wedding planning companion. Create, manage, and share your special day with ease.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          {user ? (
            <Button asChild size="lg" className="bg-pink-600 hover:bg-pink-700 px-8 py-6 text-lg">
              <Link to="/wedding-details">
                Manage Wedding Details
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg" className="bg-pink-600 hover:bg-pink-700 px-8 py-6 text-lg">
                <Link to="/auth">
                  Get Started
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-pink-300 text-pink-700 hover:bg-pink-100 px-8 py-6 text-lg">
                <a href="#features">
                  Learn More
                </a>
              </Button>
            </>
          )}
        </div>
        
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-pink-100">
            <h3 className="text-xl font-semibold text-pink-700 mb-3">Easy Planning</h3>
            <p className="text-gray-600">Organize all your wedding details in one place with our simple form.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-pink-100">
            <h3 className="text-xl font-semibold text-pink-700 mb-3">Secure Storage</h3>
            <p className="text-gray-600">Your wedding information is safely stored and accessible anytime.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-pink-100">
            <h3 className="text-xl font-semibold text-pink-700 mb-3">Beautiful Design</h3>
            <p className="text-gray-600">Create a stunning wedding experience with our elegant templates.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
