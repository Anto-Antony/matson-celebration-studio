"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { supabase } from "../supabaseClient";
import { toast } from "@/components/ui/use-toast";

interface PartnerUser {
  partner_id: string;
  name: string;
  email: string;
  phone_number?: string;
  location?: string;
  created_at?: string;
  [key: string]: any;
}

function ManagePartnerUsers() {
  const [users, setUsers] = useState<PartnerUser[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<PartnerUser | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
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
    };
    fetchUsers();
  }, []);

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
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4 sm:mb-6">
        Manage Partner Users
      </h2>
      {error && (
        <div className="text-red-500 mb-4 text-center text-base sm:text-lg">
          {error}
        </div>
      )}
      {users.length === 0 && !error ? (
        <div className="text-center text-gray-600 text-base sm:text-lg">
          No partner users found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 hidden sm:table-row">
                <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800 font-semibold text-sm sm:text-base">
                  Name
                </th>
                <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800 font-semibold text-sm sm:text-base">
                  Email
                </th>
                <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800 font-semibold text-sm sm:text-base">
                  Phone Number
                </th>
                <th className="border border-gray-200 p-2 sm:p-3 text-left text-gray-800 font-semibold text-sm sm:text-base">
                  Location
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
              {users.map((user) => (
                <tr
                  key={user.partner_id}
                  className="sm:table-row block border-b border-gray-200 mb-4 sm:mb-0 hover:bg-gray-50 transition-colors duration-200"
                >
                  <td
                    className="border border-gray-200 p-2 sm:p-3 text-gray-600 block sm:table-cell text-sm sm:text-base"
                    data-label="Name"
                  >
                    <span className="sm:hidden font-semibold">Name: </span>
                    {user.name}
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
                    data-label="Phone Number"
                  >
                    <span className="sm:hidden font-semibold">Phone: </span>
                    {user.phone_number || "N/A"}
                  </td>
                  <td
                    className="border border-gray-200 p-2 sm:p-3 text-gray-600 block sm:table-cell text-sm sm:text-base"
                    data-label="Location"
                  >
                    <span className="sm:hidden font-semibold">Location: </span>
                    {user.location || "N/A"}
                  </td>
                  <td
                    className="border border-gray-200 p-2 sm:p-3 text-gray-600 block sm:table-cell text-sm sm:text-base"
                    data-label="Created At"
                  >
                    <span className="sm:hidden font-semibold">Created At: </span>
                    {user.created_at
                      ? new Date(user.created_at).toLocaleString()
                      : "N/A"}
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
                        onClick={() => handleDelete(user.partner_id)}
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
              Edit Partner User
            </h3>
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-gray-600 font-medium mb-1 text-sm sm:text-base">
                  Name
                </label>
                <input
                  type="text"
                  value={selectedUser.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("name", e.target.value)}
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
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("email", e.target.value)}
                  className="p-2 border w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1 text-sm sm:text-base">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={selectedUser.phone_number || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("phone_number", e.target.value)}
                  className="p-2 border w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1 text-sm sm:text-base">
                  Location
                </label>
                <input
                  type="text"
                  value={selectedUser.location || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("location", e.target.value)}
                  className="p-2 border w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                />
              </div>
              <div>
                <p className="text-gray-600 text-sm sm:text-base">
                  <span className="font-medium">Created At:</span>{" "}
                  {selectedUser.created_at
                    ? new Date(selectedUser.created_at).toLocaleString()
                    : "N/A"}
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

export default ManagePartnerUsers;
