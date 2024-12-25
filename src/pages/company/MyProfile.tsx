import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ClientProfile } from "@/components/client/ClientProfile";
import { CompanyDashboardLayout } from "@/components/company/CompanyDashboardLayout";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

export default function MyProfile() {
  const navigate = useNavigate();
  const { companyUsername } = useParams();
  const clientId = localStorage.getItem("clientId");
  const userRole = localStorage.getItem("userRole");

  console.log('MyProfile mounted. ClientId:', clientId, 'UserRole:', userRole);

  useEffect(() => {
    if (!clientId || userRole !== "client") {
      console.log('Invalid client access. Role:', userRole, 'ClientId:', clientId);
      toast.error("Please login as a client to view your profile");
      navigate(`/${companyUsername}`);
    }
  }, [clientId, navigate, companyUsername, userRole]);

  const { data: client, isLoading, error } = useQuery({
    queryKey: ['my-profile', clientId],
    queryFn: async () => {
      if (!clientId) {
        throw new Error('No client ID found');
      }

      console.log('Fetching client data for ID:', clientId);
      
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select(`
          *,
          loans (*),
          client_next_of_kin (*)
        `)
        .eq('id', parseInt(clientId))
        .single();

      if (clientError) {
        console.error('Error fetching client:', clientError);
        toast.error("Error loading profile data");
        throw clientError;
      }

      console.log('Fetched client data:', clientData);
      return clientData;
    },
    enabled: !!clientId,
    retry: false
  });

  if (error) {
    return (
      <CompanyDashboardLayout userRole="client">
        <div className="p-6">
          <div className="text-center text-red-600">
            Failed to load profile. Please try logging in again.
          </div>
        </div>
      </CompanyDashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <CompanyDashboardLayout userRole="client">
        <div className="p-6">Loading profile...</div>
      </CompanyDashboardLayout>
    );
  }

  if (!client) {
    return (
      <CompanyDashboardLayout userRole="client">
        <div className="p-6">Profile not found</div>
      </CompanyDashboardLayout>
    );
  }

  return (
    <CompanyDashboardLayout userRole="client">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        <ClientProfile client={client} />
      </div>
    </CompanyDashboardLayout>
  );
}