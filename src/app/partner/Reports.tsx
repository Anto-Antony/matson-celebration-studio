import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FileText, 
  Download, 
  Users, 
  Calendar, 
  Mail, 
  Phone,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { toast } from "sonner";
import AuthGuard from "./auth/AuthGuard";

interface ClientData {
  id: string;
  bride_full_name: string;
  groom_full_name: string;
  couple_email: string;
  couple_phone: string;
  wedding_date?: string;
  created_at: string;
  partner_id: string;
}

const Reports = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);

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
        const { data, error } = await supabase
          .from("partner_side_wedding_details")
          .select("*")
          .eq("partner_id", user.id)
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        setClients(data || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch client details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchClients();
  }, [user]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generatePDFReport = async () => {
    setGeneratingPDF(true);
    
    try {
      // Create HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Client Registration Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #6B2D3C;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #6B2D3C;
              margin: 0;
            }
            .stats {
              display: flex;
              justify-content: space-around;
              margin: 20px 0;
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
            }
            .stat-item {
              text-align: center;
            }
            .stat-number {
              font-size: 24px;
              font-weight: bold;
              color: #6B2D3C;
            }
            .stat-label {
              font-size: 14px;
              color: #666;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #6B2D3C;
              color: white;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Matson Wedding Studio</h1>
            <h2>Client Registration Report</h2>
            <p>Generated on: ${new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
          
          <div class="stats">
            <div class="stat-item">
              <div class="stat-number">${clients.length}</div>
              <div class="stat-label">Total Clients</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${clients.filter(c => c.wedding_date).length}</div>
              <div class="stat-label">With Wedding Date</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${clients.filter(c => c.couple_email).length}</div>
              <div class="stat-label">With Email</div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Couple Names</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Wedding Date</th>
                <th>Registration Date</th>
              </tr>
            </thead>
            <tbody>
              ${clients.map((client, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${client.bride_full_name} & ${client.groom_full_name}</td>
                  <td>${client.couple_email || 'N/A'}</td>
                  <td>${client.couple_phone || 'N/A'}</td>
                  <td>${client.wedding_date ? formatDate(client.wedding_date) : 'Not specified'}</td>
                  <td>${formatDate(client.created_at)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>This report contains ${clients.length} client registrations.</p>
            <p>© ${new Date().getFullYear()} Matson Wedding Studio - Partner Portal</p>
          </div>
        </body>
        </html>
      `;
      
      // Create a blob and download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Open in new window for printing/saving as PDF
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
          }, 500);
        };
      }
      
      // Alternative: Direct download as HTML file
      const link = document.createElement('a');
      link.href = url;
      link.download = `client-report-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Report generated successfully! Use browser's print function to save as PDF.");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to generate report");
    } finally {
      setGeneratingPDF(false);
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Report Data</h3>
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
      </AuthGuard>
    );
  }

  const totalClients = clients.length;
  const clientsWithWeddingDate = clients.filter(c => c.wedding_date).length;
  const clientsWithEmail = clients.filter(c => c.couple_email).length;
  const recentClients = clients.filter(c => {
    const createdDate = new Date(c.created_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return createdDate >= thirtyDaysAgo;
  }).length;

  return (
    <AuthGuard>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Client Reports
            </h1>
            <p className="text-gray-600">
              View and export detailed reports of your client registrations
            </p>
          </div>
          
          <Button 
            onClick={generatePDFReport}
            disabled={generatingPDF || totalClients === 0}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            {generatingPDF ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-dashed border-white"></div>
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export as PDF
              </>
            )}
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-700 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Total Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalClients}</div>
              <p className="text-xs text-blue-600 mt-1">All time registrations</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-700 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                With Wedding Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{clientsWithWeddingDate}</div>
              <p className="text-xs text-green-600 mt-1">
                {totalClients > 0 ? Math.round((clientsWithWeddingDate / totalClients) * 100) : 0}% of total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-700 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                With Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{clientsWithEmail}</div>
              <p className="text-xs text-purple-600 mt-1">
                {totalClients > 0 ? Math.round((clientsWithEmail / totalClients) * 100) : 0}% of total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-orange-700 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Recent (30 days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{recentClients}</div>
              <p className="text-xs text-orange-600 mt-1">New registrations</p>
            </CardContent>
          </Card>
        </div>

        {/* Client List Table */}
        <Card className="bg-white/80 backdrop-blur-sm border-2 border-gray-200/50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Client Registration Details
            </CardTitle>
            <CardDescription>
              Complete list of all registered clients with their information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {totalClients === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No clients registered yet</h3>
                <p className="text-gray-600 mb-6">Start by adding your first wedding client</p>
                <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <a href="/partner/wedding-details">Add First Client</a>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">S.No</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Couple Names</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Wedding Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Registration Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client, index) => (
                      <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{index + 1}</td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">
                            {client.bride_full_name} & {client.groom_full_name}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-gray-600">{client.couple_email || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-gray-600">{client.couple_phone || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {client.wedding_date ? formatDate(client.wedding_date) : 'Not specified'}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {formatDate(client.created_at)}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            Active
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
};

export default Reports;