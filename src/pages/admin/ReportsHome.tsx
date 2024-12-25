import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, BarChart3, Download } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Placeholder data for charts
const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 700 },
];

const reportCards = [
  {
    title: "Loans Report",
    description: "View and download detailed loan reports",
    icon: FileText,
    path: "/loans",
    color: "bg-purple-100",
  },
  {
    title: "Transactions Report",
    description: "Access transaction history and summaries",
    icon: FileSpreadsheet,
    path: "/transactions",
    color: "bg-blue-100",
  },
  {
    title: "Analytics Report",
    description: "View detailed analytics and insights",
    icon: BarChart3,
    path: "/analytics",
    color: "bg-green-100",
  },
];

export default function ReportsHome() {
  const navigate = useNavigate();
  const { companyUsername } = useParams();

  const handleNavigate = (path: string) => {
    navigate(`/${companyUsername}/admin/reports${path}`);
  };

  return (
    <div className="space-y-8 p-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports Dashboard</h1>
        <Select defaultValue="30">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportCards.map((card) => (
          <Card
            key={card.title}
            className={`p-6 cursor-pointer hover:shadow-lg transition-all ${card.color}`}
            onClick={() => handleNavigate(card.path)}
          >
            <div className="flex items-center space-x-4">
              <card.icon className="w-8 h-8" />
              <div>
                <h3 className="font-semibold text-lg">{card.title}</h3>
                <p className="text-sm text-gray-600">{card.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Loan Recoveries</h3>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Client Growth</h3>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}