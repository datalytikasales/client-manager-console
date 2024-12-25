import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Users, UserCog } from "lucide-react";

export default function UsersRegister() {
  const navigate = useNavigate();
  const { companyUsername } = useParams();

  const registers = [
    {
      title: "Clients Register",
      description: "View and manage all client records",
      icon: Users,
      path: "clients",
    },
    {
      title: "Managers Register",
      description: "View and manage all manager records",
      icon: UserCog,
      path: "managers",
    },
  ];

  return (
    <div className="p-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">User Registers</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {registers.map((register) => (
          <Card
            key={register.title}
            className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer bg-white"
            onClick={() => navigate(`/${companyUsername}/admin/users/${register.path}`)}
          >
            <div className="flex items-center space-x-4">
              <register.icon className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">{register.title}</h3>
                <p className="text-sm text-gray-600">{register.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}