import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Users, Mail, Phone, Calendar, Eye, Edit, Trash2 } from "lucide-react";

const ManageClients = () => {
  const { user } = useAuth();
  const [clientCount, setClientCount] = useState<number | null>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState<any[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      if (!user) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const { data, count, error } = await supabase
          .from("partner_side_wedding_details")
          .select("*", { count: "exact" })
          .eq("partner_id", user.id);
        if (error) throw error;
        setClients(data || []);
        setFilteredClients(data || []);
        setClientCount(count ?? 0);
      } catch (err: any) {
        setError(err.message || "Failed to fetch client details");
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, [user]);

  // Filter clients based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client => 
        client.bride_full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.groom_full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.couple_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.couple_phone?.includes(searchTerm)
      );
      setFilteredClients(filtered);
    }
  }, [searchTerm, clients]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-white/80 backdrop-blur-sm border-2 border-gray-200/50">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Clients</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Client Management
          </h1>
          <p className="text-gray-600">
            Manage and view all your wedding clients in one place
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
            <div className="text-2xl font-bold text-purple-600">{clientCount}</div>
            <div className="text-sm text-purple-700">Total Clients</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white/80 backdrop-blur-sm border-2 border-gray-200/50">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search clients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50 border-gray-200 focus:bg-white"
            />
          </div>
          {searchTerm && (
            <div className="mt-2 text-sm text-gray-600">
              Found {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <Card className="bg-white/80 backdrop-blur-sm border-2 border-gray-200/50">
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No clients found' : 'No clients yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : 'Start by creating your first wedding client'
                }
              </p>
              {!searchTerm && (
                <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <a href="/partner/wedding-details">Add First Client</a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Card key={client.id} className="bg-white/80 backdrop-blur-sm border-2 border-gray-200/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105 group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                      {client.bride_full_name} & {client.groom_full_name}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      Active Client
                    </Badge>
                  </div>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 truncate">{client.couple_email}</span>
                </div>
                
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{client.couple_phone}</span>
                </div>
                
                {client.wedding_date && (
                  <div className="flex items-center space-x-3 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{formatDate(client.wedding_date)}</span>
                  </div>
                )}
                
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Created: {formatDate(client.created_at)}</span>
                    <span>ID: {client.id.slice(0, 8)}...</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {filteredClients.length > 0 && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">{filteredClients.length}</div>
                <div className="text-sm text-purple-700">Total Clients</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-600">
                  {filteredClients.filter(c => c.wedding_date).length}
                </div>
                <div className="text-sm text-pink-700">With Wedding Date</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-600">
                  {filteredClients.filter(c => c.couple_email).length}
                </div>
                <div className="text-sm text-indigo-700">With Email</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ManageClients;
