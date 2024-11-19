import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, DollarSign, Percent, FileText, User } from "lucide-react";

interface LoanProfileProps {
  loan: {
    id: string;
    loaneeName: string;
    principal: number;
    startDate: string;
    duration: number;
    interestRate: number;
    maturityDate: string;
    status: "active" | "default" | "completed" | "pending";
    purpose: string;
    collateral?: string;
    paymentFrequency: "weekly" | "monthly";
    totalRepaid: number;
  };
}

const LoanProfile = ({ loan }: LoanProfileProps) => {
  const statusColors = {
    active: "bg-green-500",
    default: "bg-red-500",
    completed: "bg-blue-500",
    pending: "bg-yellow-500",
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Loan Details</span>
          <Badge className={statusColors[loan.status]}>{loan.status}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User size={18} />
              <span>Loanee Name</span>
            </div>
            <p className="font-medium">{loan.loaneeName}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign size={18} />
              <span>Principal Amount</span>
            </div>
            <p className="font-medium">${loan.principal.toLocaleString()}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarIcon size={18} />
              <span>Start Date</span>
            </div>
            <p className="font-medium">{new Date(loan.startDate).toLocaleDateString()}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarIcon size={18} />
              <span>Duration</span>
            </div>
            <p className="font-medium">{loan.duration} months</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Percent size={18} />
              <span>Interest Rate</span>
            </div>
            <p className="font-medium">{loan.interestRate}%</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarIcon size={18} />
              <span>Maturity Date</span>
            </div>
            <p className="font-medium">{new Date(loan.maturityDate).toLocaleDateString()}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText size={18} />
              <span>Purpose</span>
            </div>
            <p className="font-medium">{loan.purpose}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarIcon size={18} />
              <span>Payment Frequency</span>
            </div>
            <p className="font-medium capitalize">{loan.paymentFrequency}</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Repaid</span>
            <span className="font-medium">${loan.totalRepaid.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoanProfile;