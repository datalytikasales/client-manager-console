import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EnhancedTable } from "@/components/ui/enhanced-table";
import { calculateTotalExpectedAmount } from "@/utils/loanPaymentCalculations";
import { format } from "date-fns";

interface LoanReport {
  id: number;
  loan_id: string;
  principal: number;
  loan_status: string;
  totalValue: number;
  client_name: string;
  created_at: string;
}

export default function LoansReport() {
  const { data: loans, isLoading } = useQuery({
    queryKey: ["loans-report"],
    queryFn: async () => {
      const { data: loans, error } = await supabase
        .from("loans")
        .select(`
          id,
          loan_id,
          principal,
          loan_status,
          created_at,
          clients (
            first_name,
            last_name
          )
        `);

      if (error) throw error;

      // Calculate total loan value for each loan and format the data
      const loansWithTotalValue = await Promise.all(
        loans.map(async (loan) => {
          const totalValue = await calculateTotalExpectedAmount(loan.id);
          return {
            id: loan.id,
            loan_id: loan.loan_id,
            principal: loan.principal,
            loan_status: loan.loan_status,
            totalValue,
            client_name: `${loan.clients.first_name} ${loan.clients.last_name}`,
            created_at: loan.created_at,
          };
        })
      );

      return loansWithTotalValue;
    },
  });

  const columns = [
    {
      header: "Loan ID",
      accessorKey: "loan_id" as keyof LoanReport,
      sortable: true,
    },
    {
      header: "Client Name",
      accessorKey: "client_name" as keyof LoanReport,
      sortable: true,
    },
    {
      header: "Principal (KES)",
      accessorKey: "principal" as keyof LoanReport,
      sortable: true,
      cell: (value: number) => value.toLocaleString(),
    },
    {
      header: "Total Value (KES)",
      accessorKey: "totalValue" as keyof LoanReport,
      sortable: true,
      cell: (value: number) => value.toLocaleString(),
    },
    {
      header: "Status",
      accessorKey: "loan_status" as keyof LoanReport,
      sortable: true,
    },
    {
      header: "Created At",
      accessorKey: "created_at" as keyof LoanReport,
      sortable: true,
      cell: (value: string) => format(new Date(value), 'MMM dd, yyyy'),
    },
  ];

  if (isLoading) {
    return <div className="p-8">Loading loans report...</div>;
  }

  return (
    <div className="space-y-6 p-8 animate-fade-in">
      <h1 className="text-3xl font-bold">Loans Report</h1>
      <EnhancedTable
        data={loans || []}
        columns={columns}
        onExportPDF={() => console.log("Exporting PDF...")}
        onExportExcel={() => console.log("Exporting Excel...")}
      />
    </div>
  );
}