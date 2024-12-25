import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

export default function ManagersRegister() {
  const { companyUsername } = useParams();

  const { data: managers, isLoading } = useQuery({
    queryKey: ["managers", companyUsername],
    queryFn: async () => {
      // Get company_id from localStorage or fetch it based on companyUsername
      const companyId = localStorage.getItem("companyId");
      
      const { data, error } = await supabase
        .from("managers")
        .select("*")
        .eq("company_id", companyId)
        .order("date_of_onboarding", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Managers Register</h1>
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Manager ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>National ID</TableHead>
              <TableHead>Manager Since</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {managers?.map((manager) => (
              <TableRow 
                key={manager.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell>{manager.manager_id}</TableCell>
                <TableCell>{`${manager.first_name} ${manager.last_name}`}</TableCell>
                <TableCell>{manager.phone_number}</TableCell>
                <TableCell>{manager.email}</TableCell>
                <TableCell>{manager.national_id}</TableCell>
                <TableCell>
                  {format(new Date(manager.date_of_onboarding), "PPP")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}