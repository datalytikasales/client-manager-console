import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, FileText } from "lucide-react";
import { calculateTotalExpectedAmount } from "@/utils/loanPaymentCalculations";

export default function LoansReport() {
  const [isExporting, setIsExporting] = useState(false);

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
          clients (
            first_name,
            last_name
          )
        `);

      if (error) throw error;

      // Calculate total loan value for each loan
      const loansWithTotalValue = await Promise.all(
        loans.map(async (loan) => {
          const totalValue = await calculateTotalExpectedAmount(loan.id);
          return {
            ...loan,
            totalValue,
          };
        })
      );

      return loansWithTotalValue;
    },
  });

  const handleExportExcel = () => {
    setIsExporting(true);
    // TODO: Implement Excel export
    setIsExporting(false);
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    // TODO: Implement PDF export
    setIsExporting(false);
  };

  return (
    <div className="space-y-6 p-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Loans Report</h1>
        <div className="space-x-4">
          <Button
            variant="outline"
            onClick={handleExportExcel}
            disabled={isExporting}
          >
            <FileText className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button
            variant="outline"
            onClick={handleExportPDF}
            disabled={isExporting}
          >
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Loan ID</TableHead>
              <TableHead>Client Name</TableHead>
              <TableHead>Principal</TableHead>
              <TableHead>Total Value</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : loans?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No loans found
                </TableCell>
              </TableRow>
            ) : (
              loans?.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>{loan.loan_id}</TableCell>
                  <TableCell>
                    {loan.clients.first_name} {loan.clients.last_name}
                  </TableCell>
                  <TableCell>
                    {loan.principal.toLocaleString("en-US", {
                      style: "currency",
                      currency: "KES",
                    })}
                  </TableCell>
                  <TableCell>
                    {loan.totalValue.toLocaleString("en-US", {
                      style: "currency",
                      currency: "KES",
                    })}
                  </TableCell>
                  <TableCell>{loan.loan_status}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}