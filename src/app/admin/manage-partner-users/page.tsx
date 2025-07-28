"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { supabase } from "../supabaseClient";
import { toast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { AddNewPartnerForm } from './add-new-partner/page';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface PartnerUser {
  partner_id: string;
  name: string;
  email: string;
  phone_number?: string;
  location?: string;
  created_at?: string;
  verified?: boolean;
  [key: string]: any;
}

function ManagePartnerUsers() {
  const [users, setUsers] = useState<PartnerUser[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<PartnerUser | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("partner_profile").select("*");
    if (error) {
      setError(error.message);
      toast({
        description: error.message,
        variant: "destructive",
      });
    } else {
      setUsers(data as PartnerUser[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleVerify = async (partnerId: string) => {
    try {
      const { data, error } = await supabase
        .from("partner_profile")
        .update({ verified: true })
        .eq("partner_id", partnerId);
  
      if (error) {
        console.error("Error verifying partner:", error.message);
        toast({
          description: "Failed to verify partner. Please try again.",
          variant: "destructive",
        });
        return;
      }
  
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.partner_id === partnerId ? { ...user, verified: true } : user
        )
      );
      
      toast({
        description: "Partner verified successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Unexpected error verifying partner:", error);
      toast({
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleEditClick = (user: PartnerUser) => {
    setSelectedUser({ ...user });
    setIsEditModalOpen(true);
  };

  const handleChange = (field: string, value: string) => {
    setSelectedUser((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;

    const { error } = await supabase
      .from("partner_profile")
      .update({
        name: selectedUser.name,
        email: selectedUser.email,
        phone_number: selectedUser.phone_number,
        location: selectedUser.location,
      })
      .eq("partner_id", selectedUser.partner_id);

    if (error) {
      setError(error.message);
      toast({
        description: error.message,
        variant: "destructive",
      });
    } else {
      setUsers(users.map((u) => (u.partner_id === selectedUser.partner_id ? selectedUser : u)));
      setIsEditModalOpen(false);
      setSelectedUser(null);
      setError("");
      toast({
        description: "Partner updated successfully",
        variant: "default",
      });
    }
  };

  const handleDelete = async (partnerId: string) => {
    if (!confirm("Are you sure you want to delete this partner? This action cannot be undone.")) {
      return;
    }

    const { error: profileError } = await supabase
      .from("partner_profile")
      .delete()
      .eq("partner_id", partnerId);
    if (profileError) {
      setError(profileError.message);
      toast({
        description: profileError.message,
        variant: "destructive",
      });
      return;
    }

    setUsers(users.filter((u) => u.partner_id !== partnerId));
    setError("");
    toast({
      description: "Partner deleted successfully",
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Partner Users</h1>
          <p className="text-gray-600 mt-1">View and manage partner accounts on the platform</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add New Partner
        </Button>
      </div>

      {/* Add Partner Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-lg p-0">
          <AddNewPartnerForm
            onSuccess={() => {
              setIsAddModalOpen(false);
              fetchUsers();
            }}
            onClose={() => setIsAddModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

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
          <p className="text-gray-600">Loading partner users...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && users.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No partner users found</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first partner user.</p>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
          >
            Add First Partner
          </Button>
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
                    Partner
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                {users.map((user) => (
                  <tr key={user.partner_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.phone_number || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.location || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.verified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.verified ? 'Verified' : 'Pending'}
                        </span>
                        {!user.verified && (
                          <button
                            onClick={() => handleVerify(user.partner_id)}
                            className="p-1 text-green-600 hover:text-green-800 transition-colors"
                            title="Verify partner"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit partner"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(user.partner_id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete partner"
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
              <h3 className="text-xl font-semibold text-gray-900">Edit Partner</h3>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={selectedUser.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("email", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="text"
                  value={selectedUser.phone_number || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("phone_number", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={selectedUser.location || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("location", e.target.value)}
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

export default ManagePartnerUsers;
