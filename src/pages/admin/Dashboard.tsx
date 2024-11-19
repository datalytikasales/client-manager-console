import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
  { name: "Jun", value: 700 },
];

const recentTransactions = [
  {
    id: 1,
    client: "John Doe",
    amount: 5000,
    type: "Loan Disbursement",
    date: "2024-02-20",
  },
  {
    id: 2,
    client: "Jane Smith",
    amount: 1200,
    type: "Payment Received",
    date: "2024-02-19",
  },
  {
    id: 3,
    client: "Mike Johnson",
    amount: 3000,
    type: "Loan Disbursement",
    date: "2024-02-18",
  },
];

const AdminDashboard = () => {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Overview of all loan activities and system performance
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-4 lg:p-6 glass-card">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Active Loans
            </h3>
            <p className="text-2xl lg:text-3xl font-bold mt-2">246</p>
            <p className="text-xs lg:text-sm text-success mt-1">
              +12% from last month
            </p>
          </Card>
          <Card className="p-4 lg:p-6 glass-card">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Amount Disbursed
            </h3>
            <p className="text-2xl lg:text-3xl font-bold mt-2">$1.2M</p>
            <p className="text-xs lg:text-sm text-success mt-1">
              +8% from last month
            </p>
          </Card>
          <Card className="p-4 lg:p-6 glass-card sm:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-medium text-muted-foreground">
              Recovery Rate
            </h3>
            <p className="text-2xl lg:text-3xl font-bold mt-2">98.5%</p>
            <p className="text-xs lg:text-sm text-success mt-1">
              +2% from last month
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-4 lg:p-6 glass-card">
            <h3 className="text-lg font-semibold mb-4">Loan Disbursements</h3>
            <div className="h-[250px] lg:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#6E59A5"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4 lg:p-6 glass-card">
            <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg bg-secondary"
                >
                  <div className="mb-2 sm:mb-0">
                    <p className="font-medium">{transaction.client}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.type}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-medium">${transaction.amount}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;