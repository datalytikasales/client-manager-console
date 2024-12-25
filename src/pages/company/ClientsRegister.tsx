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
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ClientsRegister() {
  const navigate = useNavigate();
  const companyId = localStorage.getItem("companyId");
  console.log('Using company ID:', companyId);

  // Redirect if no companyId is found
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
      console.log('Fetched clients:', data);
      return data;
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

  return (
    <div className="p-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Clients Register</h1>
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>National ID</TableHead>
              <TableHead>Client Since</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients?.map((client) => (
              <TableRow 
                key={client.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => navigate(`../dashboard/client/${client.id}`)}
              >
                <TableCell>{client.client_id}</TableCell>
                <TableCell>{`${client.first_name} ${client.last_name}`}</TableCell>
                <TableCell>{client.phone_number}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.national_id}</TableCell>
                <TableCell>
                  {format(new Date(client.date_of_onboarding), "PPP")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}