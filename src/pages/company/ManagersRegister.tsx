import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { EnhancedTable } from "@/components/ui/enhanced-table";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

type ManagerWithFullName = Database['public']['Tables']['managers']['Row'] & {
  full_name: string;
};

export default function ManagersRegister() {
  const { companyUsername } = useParams();
  const companyId = localStorage.getItem("companyId");

  const { data: managers, isLoading } = useQuery({
    queryKey: ["managers", companyUsername],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("managers")
        .select("*")
        .eq("company_id", companyId)
        .order("date_of_onboarding", { ascending: false });

      if (error) {
        console.error('Error fetching managers:', error);
        toast.error("Error loading managers");
        throw error;
      }

      const formattedData = data?.map(manager => ({
        ...manager,
        date_of_onboarding: format(new Date(manager.date_of_onboarding), "PPP"),
        full_name: `${manager.first_name} ${manager.last_name}`
      }));

      return formattedData as ManagerWithFullName[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const columns = [
    { header: "Manager ID", accessorKey: "manager_id" as keyof ManagerWithFullName, sortable: true },
    { header: "Name", accessorKey: "full_name" as keyof ManagerWithFullName, sortable: true },
    { header: "Phone Number", accessorKey: "phone_number" as keyof ManagerWithFullName, sortable: true },
    { header: "Email", accessorKey: "email" as keyof ManagerWithFullName, sortable: true },
    { header: "National ID", accessorKey: "national_id" as keyof ManagerWithFullName, sortable: true },
    { header: "Manager Since", accessorKey: "date_of_onboarding" as keyof ManagerWithFullName, sortable: true },
  ];

  return (
    <div className="p-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Managers Register</h1>
      <EnhancedTable
        data={managers || []}
        columns={columns}
        onExportPDF={() => toast.info("PDF export coming soon!")}
        onExportExcel={() => toast.info("Excel export coming soon!")}
      />
    </div>
  );
}