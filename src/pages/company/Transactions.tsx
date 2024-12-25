import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CompanyDashboardLayout } from "@/components/company/CompanyDashboardLayout";
import { TransactionScheduleTable } from "@/components/transaction/TransactionScheduleTable";
import { ClientSearchSection } from "@/components/loan/ClientSearchSection";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function Transactions() {
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const userRole = localStorage.getItem("userRole") as "client" | "manager" | "admin" || "client";
  const clientId = userRole === "client" 
    ? localStorage.getItem("clientId") 
    : selectedClient?.id;

  const { data: activeLoans, isLoading } = useQuery({
    queryKey: ['active-loans', clientId],
    queryFn: async () => {
      if (!clientId) return [];
      
      console.log('Fetching active loans for client:', clientId);
      
      const { data: loans, error } = await supabase
        .from('loans')
        .select(`
          *,
          clients (
            first_name,
            last_name,
            national_id
          ),
          loan_tenor (
            duration,
            duration_period
          ),
          interest (
            interest_rate,
            interest_period,
            interest_model,
            repayment_installment
          )
        `)
        .eq('client_id', clientId)
        .eq('loan_status', 'Active');

      if (error) {
        console.error('Error fetching loans:', error);
        toast.error("Error loading loans");
        throw error;
      }

      console.log('Found active loans:', loans);
      return loans;
    },
    enabled: !!clientId
  });

  return (
    <CompanyDashboardLayout userRole={userRole}>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Loan Payments</h1>

        {userRole !== "client" && (
          <ClientSearchSection
            onClientFound={(client) => {
              setSelectedClient(client);
              if (!client) {
                toast.error("No client found with this National ID");
              }
            }}
          />
        )}

        {isLoading ? (
          <div>Loading loans...</div>
        ) : activeLoans && activeLoans.length > 0 ? (
          <div className="space-y-6">
            {activeLoans.map((loan) => (
              <Card key={loan.id} className="p-6">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">Loan ID: {loan.loan_id}</h2>
                  <p className="text-sm text-muted-foreground">
                    Client: {loan.clients.first_name} {loan.clients.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    National ID: {loan.clients.national_id}
                  </p>
                </div>
                <TransactionScheduleTable loanId={loan.id} />
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6">
            <p className="text-center text-muted-foreground">
              {userRole === "client" 
                ? "You have no active loans" 
                : "Search for a client to view their loans"}
            </p>
          </Card>
        )}
      </div>
    </CompanyDashboardLayout>
  );
}