toast({
  title: "Success",
  description: "User updated successfully",
  variant: "default", // or your default style
});// Converted from JSX to TSX
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { toast } from '@/components/ui/use-toast';

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

  useEffect(() => {
    async function fetchData(): Promise<void> {
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
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setUsers(users.map(u => u.user_id === selectedUser.user_id ? selectedUser : u));
      setIsEditModalOpen(false);
      setSelectedUser(null);
      setError('');
      toast({
        title: 'Success',
        description: 'User updated successfully',
        variant: 'default',
      });
    }
  };

  const handleDelete = async (userId: string) => {
    const { error: profileError } = await supabase
      .from('user_profile')
      .delete()
      .eq('user_id', userId);
    if (profileError) {
      setError(profileError.message);
      toast({
        title: 'Error',
        description: profileError.message,
        variant: 'destructive',
      });
      return;
    }

    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) {
      setError(authError.message);
      toast({
        title: 'Error',
        description: authError.message,
        variant: 'destructive',
      });
      return;
    }

    setUsers(users.filter(u => u.user_id !== userId));
    setError('');
    toast({
      title: 'Success',
      description: 'User deleted successfully',
      variant: 'default',
    });
  };

  const handleWhatsAppShare = (user: UserProfile): void => {
    if (!user.phone_number) {
      toast({
        title: 'Error',
        description: 'Phone number is missing',
        variant: 'destructive',
      });
      return;
    }

    // WhatsApp expects just digits (countrycode+number, no '+')
    const formattedPhone = user.phone_number.replace(/\D/g, '');
    const greeting = `Dear ${user.groom_name} & ${user.bride_name},\nWishing you both a lifetime of love, joy, and cherished memories as you embark on this beautiful journey together.`;
    const websiteInfo = user.website_name
      ? `Your Live Website: ${user.website_name}`
      : `Your live website will be available soon.`;
    // Do NOT send password via WhatsApp for security reasons
    const loginCredentials = `Manage your website details at:\nhttps://editwebsite.matson.app\nLogin Credentials:\n   Email: ${user.email}`;

    const message = `${greeting}\n\n${websiteInfo}\n\n${loginCredentials}`;
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    console.log('WhatsApp URL:', whatsappUrl);
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4 sm:mb-6">
        Manage Couple Users
      </h2>
      {error && (
        <div className="text-red-500 mb-4 text-center text-base sm:text-lg">
          {error}
        </div>
      )}
      {users.length === 0 && !error ? (
        <div className="text-center text-gray-600 text-base sm:text-lg">
          No couple users found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 hidden sm:table-row">
                <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800 font-semibold text-sm sm:text-base">
                  Groom Name
                </th>
                <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800 font-semibold text-sm sm:text-base">
                  Bride Name
                </th>
                <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800 font-semibold text-sm sm:text-base">
                  Phone Number
                </th>
                <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800 font-semibold text-sm sm:text-base">
                  Email
                </th>
                <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800 font-semibold text-sm sm:text-base">
                  Partner
                </th>
                <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800 font-semibold text-sm sm:text-base">
                  Website Name
                </th>
                <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800 font-semibold text-sm sm:text-base">
                  Created At
                </th>
                <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800 font-semibold text-sm sm:text-base">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr
                  key={user.user_id}
                  className="sm:table-row block border-b border-gray-200 mb-4 sm:mb-0 hover:bg-gray-50 transition-colors duration-200"
                >
                  <td
                    className="border border-gray-200 p-2 sm:p-3 text-gray-600 block sm:table-cell text-sm sm:text-base"
                    data-label="Groom Name"
                  >
                    <span className="sm:hidden font-semibold">Groom: </span>
                    {user.groom_name}
                  </td>
                  <td
                    className="border border-gray-200 p-2 sm:p-3 text-gray-600 block sm:table-cell text-sm sm:text-base"
                    data-label="Bride Name"
                  >
                    <span className="sm:hidden font-semibold">Bride: </span>
                    {user.bride_name}
                  </td>
                  <td
                    className="border border-gray-200 p-2 sm:p-3 text-gray-600 block sm:table-cell text-sm sm:text-base"
                    data-label="Phone Number"
                  >
                    <span className="sm:hidden font-semibold">Phone: </span>
                    {user.phone_number || 'N/A'}
                  </td>
                  <td
                    className="border border-gray-200 p-2 sm:p-3 text-gray-600 block sm:table-cell text-sm sm:text-base"
                    data-label="Email"
                  >
                    <span className="sm:hidden font-semibold">Email: </span>
                    {user.email}
                  </td>
                  <td
                    className="border border-gray-200 p-2 sm:p-3 text-gray-600 block sm:table-cell text-sm sm:text-base"
                    data-label="Partner"
                  >
                    <span className="sm:hidden font-semibold">Partner: </span>
                    {partners[user.partner_id ?? ''] || 'Unknown Partner'}
                  </td>
                  <td
                    className="border border-gray-200 p-2 sm:p-3 text-gray-600 block sm:table-cell text-sm sm:text-base"
                    data-label="Website Name"
                  >
                    <span className="sm:hidden font-semibold">Website: </span>
                    {user.website_name || 'N/A'}
                  </td>
                  <td
                    className="border border-gray-200 p-2 sm:p-3 text-gray-600 block sm:table-cell text-sm sm:text-base"
                    data-label="Created At"
                  >
                    <span className="sm:hidden font-semibold">Created At: </span>
                    {user.created_at
                      ? new Date(user.created_at).toLocaleString()
                      : 'N/A'}
                  </td>
                  <td
                    className="border border-gray-200 p-2 sm:p-3 block sm:table-cell"
                    data-label="Actions"
                  >
                    <div className="flex space-x-2 sm:space-x-3 justify-center sm:justify-start">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="bg-cyan-500 text-white p-2 sm:px-4 sm:py-2 rounded-lg hover:bg-cyan-600 transition-colors flex items-center"
                        title="Edit"
                      >
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(user.user_id)}
                        className="bg-red-500 text-white p-2 sm:px-4 sm:py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center"
                        title="Delete"
                      >
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M5 7h14"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleWhatsAppShare(user)}
                        className="bg-green-500 text-white p-2 sm:px-4 sm:py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
                        title="Share via WhatsApp"
                      >
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.134.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.231-.374a9.875 9.875 0 01-1.51-5.272 9.897 9.897 0 019.918-9.914 9.874 9.874 0 017.006 2.898 9.874 9.874 0 012.908 7.006 9.897 9.897 0 01-9.953 9.914m6.508-18.463A11.821 11.821 0 0012.06 0C5.443 0 .058 5.383.058 12.001a11.822 11.822 0 001.936 6.465L0 24l5.629-1.48a11.929 11.929 0 005.681 1.444h.005c6.616 0 11.999-5.383 11.999-12.001A11.821 11.821 0 0018.559 3.537z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/30 p-4">
          <div className="bg-white/90 p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-md sm:max-w-lg animate-fade-in backdrop-blur-sm border border-gray-200/50">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
              Edit Couple User
            </h3>
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-gray-600 font-medium mb-1 text-sm sm:text-base">
                  Groom Name
                </label>
                <input
                  type="text"
                  value={selectedUser.groom_name}
                  onChange={(e) => handleChange('groom_name', e.target.value)}
                  className="p-2 border w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1 text-sm sm:text-base">
                  Bride Name
                </label>
                <input
                  type="text"
                  value={selectedUser.bride_name}
                  onChange={(e) => handleChange('bride_name', e.target.value)}
                  className="p-2 border w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1 text-sm sm:text-base">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={selectedUser.phone_number || ''}
                  onChange={(e) => handleChange('phone_number', e.target.value)}
                  className="p-2 border w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1 text-sm sm:text-base">
                  Email
                </label>
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="p-2 border w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1 text-sm sm:text-base">
                  Website Name
                </label>
                <input
                  type="text"
                  value={selectedUser.website_name || ''}
                  onChange={(e) => handleChange('website_name', e.target.value)}
                  className="p-2 border w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                />
              </div>
              <div>
                <p className="text-gray-600 text-sm sm:text-base">
                  <span className="font-medium">Partner:</span>{' '}
                  {partners[selectedUser.partner_id] || 'Unknown Partner'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm sm:text-base">
                  <span className="font-medium">Created At:</span>{' '}
                  {selectedUser.created_at
                    ? new Date(selectedUser.created_at).toLocaleString()
                    : 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex space-x-2 sm:space-x-3">
              <button
                onClick={handleUpdate}
                className="bg-cyan-500 text-white p-2 sm:px-4 sm:py-2 rounded-lg hover:bg-cyan-600 transition-colors flex items-center"
                title="Save"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedUser(null);
                }}
                className="bg-gray-300 text-gray-800 p-2 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageCoupleUsers;
