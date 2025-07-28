// Converted from JSX to TSX
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

interface UserProfile {
  user_id: string;
  groom_name: string;
  bride_name: string;
  phone_number?: string | null;
  email: string;
  website_name?: string | null;
  partner_id: string | null;
  created_at?: string;
  password?: string;
}

interface PartnerMap {
  [partnerId: string]: string;
}

function ManageCoupleUsers(): JSX.Element {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [partners, setPartners] = useState<PartnerMap>({});
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      setLoading(true);
      try {
        const { data: userData, error: userError } = await supabase
          .from('user_profile')
          .select('*');
        if (userError || !userData) {
          setError(userError?.message || 'Failed to load users');
          toast({
            title: 'Error',
            description: userError?.message || 'Failed to load users',
            variant: 'destructive',
          });
          return;
        }
        setUsers(userData as UserProfile[]);

        // Fetch partner profiles for mapping partner_id to name
        const partnerIds = [...new Set((userData as UserProfile[]).map(u => u.partner_id).filter(Boolean))];
        if (partnerIds.length > 0) {
          const { data: partnerData, error: partnerError } = await supabase
            .from('partner_profile')
            .select('partner_id, name')
            .in('partner_id', partnerIds);

          if (partnerError || !partnerData) {
            setError(partnerError?.message || 'Failed to load partners');
            toast({
              title: 'Error',
              description: partnerError?.message || 'Failed to load partners',
              variant: 'destructive',
            });
            return;
          }

          // Create a mapping of partner_id to name
          const partnerMap = (partnerData as { partner_id: string; name: string }[]).reduce((acc: PartnerMap, partner) => {
            acc[partner.partner_id] = partner.name;
            return acc;
          }, {});
          setPartners(partnerMap);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load users');
        toast({
          title: 'Error',
          description: 'Failed to load users',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleEditClick = (user: UserProfile) => {
    setSelectedUser({ ...user });
    setIsEditModalOpen(true);
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setSelectedUser(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;

    const { error } = await supabase
      .from('user_profile')
      .update({
        groom_name: selectedUser.groom_name,
        bride_name: selectedUser.bride_name,
        phone_number: selectedUser.phone_number,
        email: selectedUser.email,
        website_name: selectedUser.website_name,
      })
      .eq('user_id', selectedUser.user_id);

    if (error) {
      setError(error.message);
      toast({
        description: error.message,
        variant: "destructive",
      });
    } else {
      setUsers(users.map((u) => (u.user_id === selectedUser.user_id ? selectedUser : u)));
      setIsEditModalOpen(false);
      setSelectedUser(null);
      setError("");
      toast({
        description: "User updated successfully",
        variant: "default",
      });
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    const { error } = await supabase
      .from('user_profile')
      .delete()
      .eq('user_id', userId);

    if (error) {
      setError(error.message);
      toast({
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setUsers(users.filter((u) => u.user_id !== userId));
    setError("");
    toast({
      description: "User deleted successfully",
      variant: "default",
    });
  };

  const handleWhatsAppShare = (user: UserProfile): void => {
    const message = `Hi ${user.groom_name} & ${user.bride_name}! Your wedding website is ready. Please check your email for login details.`;
    const whatsappUrl = `https://wa.me/${user.phone_number?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Manage Couple Users</h1>
        <p className="text-gray-600">View and manage couple accounts on the platform</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading couple users...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && users.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No couple users found</h3>
          <p className="text-gray-600">No couple accounts have been created yet.</p>
        </div>
      )}

      {/* Users Table */}
      {!loading && users.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Couple
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Partner
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Website
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.user_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.groom_name} & {user.bride_name}
                        </div>
                        <div className="text-sm text-gray-500">Couple</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">{user.email}</div>
                        <div className="text-sm text-gray-500">{user.phone_number || "N/A"}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {partners[user.partner_id ?? ''] || 'Unknown Partner'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.website_name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {user.phone_number && (
                          <button
                            onClick={() => handleWhatsAppShare(user)}
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                            title="Share via WhatsApp"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => handleEditClick(user)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit couple"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(user.user_id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete couple"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M5 7h14"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsEditModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Edit Couple</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Groom Name</label>
                  <input
                    type="text"
                    value={selectedUser.groom_name}
                    onChange={(e) => handleChange("groom_name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bride Name</label>
                  <input
                    type="text"
                    value={selectedUser.bride_name}
                    onChange={(e) => handleChange("bride_name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="text"
                  value={selectedUser.phone_number || ""}
                  onChange={(e) => handleChange("phone_number", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website Name</label>
                <input
                  type="text"
                  value={selectedUser.website_name || ""}
                  onChange={(e) => handleChange("website_name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button
                onClick={handleUpdate}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
              >
                Save Changes
              </Button>
              <Button
                onClick={() => setIsEditModalOpen(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageCoupleUsers;
