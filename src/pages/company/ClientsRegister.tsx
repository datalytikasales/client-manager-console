import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { EnhancedTable } from "@/components/ui/enhanced-table";
import { Tables } from "@/integrations/supabase/types";

type ClientWithFullName = Tables<"clients"> & {
  full_name: string;
};

export default function ClientsRegister() {
  const navigate = useNavigate();
  const companyId = localStorage.getItem("companyId");
  console.log('Using company ID:', companyId);

  if (!companyId) {
    console.error('No company ID found in localStorage');
    toast.error("Company information not found. Please login again.");
    navigate("/");
    return null;
  }

  const { data: clients, isLoading, error } = useQuery({
    queryKey: ["clients", companyId],
    queryFn: async () => {
      console.log('Fetching clients for company ID:', companyId);
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("company_id", parseInt(companyId))
        .order("date_of_onboarding", { ascending: false });

      if (error) {
        console.error('Error fetching clients:', error);
        throw error;
      }
      
      const formattedData = data?.map(client => ({
        ...client,
        date_of_onboarding: format(new Date(client.date_of_onboarding), "PPP"),
        full_name: `${client.first_name} ${client.last_name}`
      }));
      
      console.log('Fetched clients:', formattedData);
      return formattedData as ClientWithFullName[];
    },
  });

  if (error) {
    console.error('Query error:', error);
    toast.error("Error loading clients. Please try again.");
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const columns = [
    { header: "Client ID", accessorKey: "client_id" as keyof ClientWithFullName, sortable: true },
    { header: "Name", accessorKey: "full_name" as keyof ClientWithFullName, sortable: true },
    { header: "Phone Number", accessorKey: "phone_number" as keyof ClientWithFullName, sortable: true },
    { header: "Email", accessorKey: "email" as keyof ClientWithFullName, sortable: true },
    { header: "National ID", accessorKey: "national_id" as keyof ClientWithFullName, sortable: true },
    { header: "Client Since", accessorKey: "date_of_onboarding" as keyof ClientWithFullName, sortable: true },
  ];

  const handleExportPDF = () => {
    toast.info("PDF export coming soon!");
  };

  const handleExportExcel = () => {
    toast.info("Excel export coming soon!");
  };

  return (
    <div className="p-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Clients Register</h1>
      <EnhancedTable
        data={clients || []}
        columns={columns}
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportExcel}
      />
    </div>
  );
}