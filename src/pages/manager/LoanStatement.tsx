import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";

// Dummy data - replace with API data later
const companyInfo = {
  name: "MicroFinance Solutions Ltd",
  logo: "/placeholder.svg",
  email: "contact@microfinance.com",
  phone: "+254 700 123 456"
};

const loanInfo = {
  clientName: "John Doe",
  clientPhone: "+254 712 345 678",
  clientEmail: "john.doe@example.com",
  loanNumber: "LN2024001",
  principal: 50000,
  startDate: "2024-01-15",
  payments: [
    { date: "2024-02-15", amount: 5500, balance: 45000 },
    { date: "2024-03-15", amount: 5500, balance: 39500 },
    { date: "2024-04-15", amount: 5500, balance: 34000 },
    { date: "2024-05-15", amount: 5500, balance: 28500 },
  ]
};

const LoanStatement = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardLayout role="manager">
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center print:hidden">
          <h1 className="text-2xl font-bold">Loan Statement</h1>
          <div className="space-x-2">
            <Button onClick={handlePrint} variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm">
          {/* Company Header */}
          <div className="flex items-center justify-between mb-8 border-b pb-6">
            <div className="flex items-center gap-4">
              <img
                src={companyInfo.logo}
                alt="Company Logo"
                className="h-16 w-16"
              />
              <div>
                <h2 className="text-xl font-bold">{companyInfo.name}</h2>
                <p className="text-sm text-muted-foreground">{companyInfo.email}</p>
                <p className="text-sm text-muted-foreground">{companyInfo.phone}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">Loan Statement</p>
              <p className="text-sm text-muted-foreground">Generated on: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Client and Loan Info */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-2">Client Information</h3>
              <div className="space-y-1">
                <p>{loanInfo.clientName}</p>
                <p className="text-sm text-muted-foreground">{loanInfo.clientPhone}</p>
                <p className="text-sm text-muted-foreground">{loanInfo.clientEmail}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Loan Details</h3>
              <div className="space-y-1">
                <p>Loan Number: {loanInfo.loanNumber}</p>
                <p>Principal Amount: KES {loanInfo.principal.toLocaleString()}</p>
                <p>Start Date: {new Date(loanInfo.startDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Payment Schedule */}
          <div className="mb-8">
            <h3 className="font-semibold mb-4">Payment History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Date</th>
                    <th className="text-right py-2 px-4">Amount Paid</th>
                    <th className="text-right py-2 px-4">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {loanInfo.payments.map((payment, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4">
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
                      <td className="text-right py-2 px-4">
                        KES {payment.amount.toLocaleString()}
                      </td>
                      <td className="text-right py-2 px-4">
                        KES {payment.balance.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t pt-6 text-center space-y-4">
            <div>
              <p className="font-medium">Payment Account Details</p>
              <p className="text-sm text-muted-foreground">Bank: Example Bank</p>
              <p className="text-sm text-muted-foreground">Account: 1234567890</p>
              <p className="text-sm text-muted-foreground">Branch: Main Branch</p>
            </div>
            <p className="text-sm text-muted-foreground italic">
              Thank you for trusting MicroFinance Solutions Ltd. We value your business.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LoanStatement;