"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/app/admin/supabaseClient";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

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

  // Fetch unverified wedding details and partner profiles
  useEffect(() => {
    const fetchData = async () => {
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
        // .in('partner_id', partnerIds); // .in() is not always typed well in supabase-js

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
    <div className="p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Create Couple User</h2>

      {/* Display message if no users are pending */}
      {details.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">No new users pending</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {details.map((d) => (
            <div
              key={d.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {d.bride_full_name} & {d.groom_full_name}
              </h3>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Email:</span> {d.couple_email}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Phone:</span> {d.couple_phone}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Partner:</span> {partners[d.partner_id] || "Unknown Partner"}
              </p>
              <p className="text-gray-600 mb-4">
                <span className="font-medium">Wedding Date:</span> {d.wedding_date ? new Date(d.wedding_date).toLocaleDateString() : "N/A"}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleApprove(d.id)}
                  className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDeclineClick(d.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Approval */}
      {isModalOpen && selectedDetail && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/30">
          <div className="bg-white/90 p-6 rounded-lg shadow-xl max-w-md w-full animate-fade-in backdrop-blur-sm border border-gray-200/50">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Approve Couple User</h3>
            <div className="space-y-2 mb-4">
              <p className="text-gray-600">
                <span className="font-medium">Bride:</span> {selectedDetail.bride_full_name}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Groom:</span> {selectedDetail.groom_full_name}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Email:</span> {selectedDetail.couple_email}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Phone:</span> {selectedDetail.couple_phone}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Partner:</span> {partners[selectedDetail.partner_id] || "Unknown Partner"}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Wedding Date:</span> {selectedDetail.wedding_date ? new Date(selectedDetail.wedding_date).toLocaleDateString() : "N/A"}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Created At:</span> {new Date(selectedDetail.created_at).toLocaleString()}
              </p>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Set Password"
              className="mb-4 p-2 border w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <div className="flex space-x-3">
              <button
                onClick={handleCreateUser}
                className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors"
              >
                Create User
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setPassword("");
                  setSelectedId(null);
                }}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Decline */}
      {isDeclineModalOpen && declineDetail && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/30">
          <div className="bg-white/90 p-6 rounded-lg shadow-xl max-w-sm w-full animate-fade-in backdrop-blur-sm border border-gray-200/50">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Decline</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to decline the wedding details for {" "}
              <span className="font-medium">
                {declineDetail.bride_full_name} & {declineDetail.groom_full_name}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDeclineConfirm}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setIsDeclineModalOpen(false);
                  setDeclineId(null);
                }}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
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

export default CreateUser;
