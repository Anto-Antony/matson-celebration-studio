"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/app/admin/supabaseClient";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

interface WeddingDetail {
  id: number;
  bride_full_name: string;
  groom_full_name: string;
  couple_email: string;
  couple_phone: string;
  partner_id: number | string;
  wedding_date?: string;
  created_at: string;
}

interface PartnerMap {
  [partner_id: string]: string;
}

function CreateUser() {
  const [details, setDetails] = useState<WeddingDetail[]>([]);
  const [partners, setPartners] = useState<PartnerMap>({});
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState<boolean>(false);
  const [declineId, setDeclineId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch unverified wedding details and partner profiles
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch unverified wedding details
        const { data: weddingData, error: weddingError } = await supabase
          .from("partner_side_wedding_details")
          .select("*")
          .eq("verified", false);

        if (weddingError) {
          toast({
            description: weddingError.message,
            variant: "destructive",
          });
          return;
        }

        setDetails(weddingData as WeddingDetail[]);

        // Fetch partner profiles for all partner_ids in wedding details
        const partnerIds = weddingData ? [...new Set((weddingData as WeddingDetail[]).map((d) => d.partner_id))] : [];
        if (partnerIds.length > 0) {
          const { data: partnerData, error: partnerError } = await supabase
            .from("partner_profile")
            .select("partner_id, name");

          if (partnerError) {
            toast({
              description: partnerError.message,
              variant: "destructive",
            });
            return;
          }

          // Create a mapping of partner_id to name
          const partnerMap: PartnerMap = (partnerData as { partner_id: string; name: string }[]).reduce((acc, partner) => {
            acc[partner.partner_id] = partner.name;
            return acc;
          }, {} as PartnerMap);
          setPartners(partnerMap);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          description: "Failed to load wedding details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApprove = (id: number) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleDeclineClick = (id: number) => {
    setDeclineId(id);
    setIsDeclineModalOpen(true);
  };

  const handleDeclineConfirm = async () => {
    try {
      const { error } = await supabase
        .from("partner_side_wedding_details")
        .delete()
        .eq("id", declineId);

      if (error) {
        throw new Error(error.message);
      }

      setDetails(details.filter((d) => d.id !== declineId));
      toast({
        description: "Wedding details declined and removed successfully.",
        variant: "default",
      });
      setIsDeclineModalOpen(false);
      setDeclineId(null);
    } catch (err: any) {
      toast({
        description: err.message,
        variant: "destructive",
      });
      setIsDeclineModalOpen(false);
    }
  };

  const handleCreateUser = async () => {
    setMessage("");
    setError("");

    if (!password) {
      toast({
        description: "Please set a password",
        variant: "destructive",
      });
      return;
    }

    const selectedDetail = details.find((d) => d.id === selectedId);
    if (!selectedDetail) {
      toast({
        description: "Selected record not found",
        variant: "destructive",
      });
      setIsModalOpen(false);
      return;
    }

    try {
      let { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session || !sessionData.session.access_token) {
        // Attempt to refresh the session
        const { data: refreshedSession, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError || !refreshedSession.session) {
          throw new Error("Failed to get or refresh session");
        }
        sessionData.session = refreshedSession.session;
      }

      const headers = {
        Authorization: `Bearer ${sessionData.session.access_token}`,
        "Content-Type": "application/json",
      };

      const response = await axios.post(
        "https://kzhbmjygrzjardgruunp.supabase.co/functions/v1/create-user",
        { weddingDetailsId: selectedId, password, email: selectedDetail.couple_email },
        { headers }
      );

      const result = response.data;
      if (response.status !== 200) {
        throw new Error(result.error || "Failed to create user or save profile");
      }

      toast({
        description: result.message,
        variant: "default",
      });
      setDetails(details.filter((d) => d.id !== selectedId));
      setSelectedId(null);
      setPassword("");
      setIsModalOpen(false);
    } catch (err: any) {
      toast({
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const selectedDetail = details.find((d) => d.id === selectedId);
  const declineDetail = details.find((d) => d.id === declineId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Create Couple User</h1>
        <p className="text-gray-600">Review and approve pending couple registrations</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pending registrations...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && details.length === 0 && (
        <div className="text-center py-12">
          <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pending registrations</h3>
          <p className="text-gray-600">All couple registrations have been processed.</p>
        </div>
      )}

      {/* Wedding Details Grid */}
      {!loading && details.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {details.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {d.bride_full_name} & {d.groom_full_name}
                  </h3>
                  <p className="text-sm text-gray-500">Pending Approval</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2 text-sm">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span className="text-gray-600">{d.couple_email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span className="text-gray-600">{d.couple_phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  <span className="text-gray-600">{partners[d.partner_id] || "Unknown Partner"}</span>
                </div>
                {d.wedding_date && (
                  <div className="flex items-center space-x-2 text-sm">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span className="text-gray-600">{new Date(d.wedding_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button
                  onClick={() => handleApprove(d.id)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Approve
                </Button>
                <Button
                  onClick={() => handleDeclineClick(d.id)}
                  variant="outline"
                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  Decline
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approval Modal */}
      {isModalOpen && selectedDetail && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Approve Couple User</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bride</label>
                  <p className="text-sm text-gray-900">{selectedDetail.bride_full_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Groom</label>
                  <p className="text-sm text-gray-900">{selectedDetail.groom_full_name}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-sm text-gray-900">{selectedDetail.couple_email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <p className="text-sm text-gray-900">{selectedDetail.couple_phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Partner</label>
                <p className="text-sm text-gray-900">{partners[selectedDetail.partner_id] || "Unknown Partner"}</p>
              </div>
              {selectedDetail.wedding_date && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wedding Date</label>
                  <p className="text-sm text-gray-900">{new Date(selectedDetail.wedding_date).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Set Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password for the couple"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button
                onClick={handleCreateUser}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
              >
                Create User
              </Button>
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  setPassword("");
                  setSelectedId(null);
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Decline Confirmation Modal */}
      {isDeclineModalOpen && declineDetail && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsDeclineModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Confirm Decline</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to decline the wedding details for{" "}
              <span className="font-medium text-gray-900">
                {declineDetail.bride_full_name} & {declineDetail.groom_full_name}
              </span>
              ?
            </p>
            
            <div className="flex space-x-3">
              <Button
                onClick={handleDeclineConfirm}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              >
                Confirm Decline
              </Button>
              <Button
                onClick={() => {
                  setIsDeclineModalOpen(false);
                  setDeclineId(null);
                }}
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

export default CreateUser;
