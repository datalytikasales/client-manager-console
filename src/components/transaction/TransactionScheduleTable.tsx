import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { generateRepaymentSchedule, calculateInstallmentStatuses } from "@/utils/loanPaymentCalculations";

interface TransactionScheduleTableProps {
  loanId: number;
}

export function TransactionScheduleTable({ loanId }: TransactionScheduleTableProps) {
  const navigate = useNavigate();

  const { data: schedule, isLoading: isLoadingSchedule } = useQuery({
    queryKey: ['repayment-schedule', loanId],
    queryFn: () => generateRepaymentSchedule(loanId)
  });

  const { data: statuses, isLoading: isLoadingStatuses } = useQuery({
    queryKey: ['payment-statuses', loanId, schedule],
    queryFn: () => schedule ? calculateInstallmentStatuses(loanId, schedule) : null,
    enabled: !!schedule
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-500">Partial</Badge>;
      default:
        return <Badge variant="destructive">Unpaid</Badge>;
    }
  };

  const handlePayment = (installmentNumber: number, amount: number) => {
    // TODO: Implement payment handler navigation
    console.log('Payment requested for installment:', installmentNumber, 'amount:', amount);
  };

  if (isLoadingSchedule || isLoadingStatuses) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Loading payment schedule...</p>
        </CardContent>
      </Card>
    );
  }

  if (!schedule || schedule.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No payment schedule available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Installment</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Amount (KES)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Remaining</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedule.map((item) => {
              const status = statuses?.get(item.installmentNumber) || { 
                status: 'unpaid', 
                remainingAmount: item.amount 
              };
              
              return (
                <TableRow key={item.installmentNumber}>
                  <TableCell>{item.installmentNumber}</TableCell>
                  <TableCell>{format(new Date(item.dueDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell className="text-right">{item.amount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(status.status)}</TableCell>
                  <TableCell className="text-right">{status.remainingAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    {status.status !== 'paid' && (
                      <Button
                        variant="outline"
                        onClick={() => handlePayment(item.installmentNumber, status.remainingAmount)}
                      >
                        Pay
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}