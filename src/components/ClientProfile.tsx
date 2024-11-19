import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, Home, User } from "lucide-react";

interface ClientProfileProps {
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    profilePicture?: string;
    nextOfKin1: {
      name: string;
      relationship: string;
      phone: string;
    };
    nextOfKin2: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
}

const ClientProfile = ({ client }: ClientProfileProps) => {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={client.profilePicture} alt={client.name} />
            <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{client.name}</CardTitle>
            <p className="text-sm text-muted-foreground">Client Profile</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail size={18} />
              <span>Email Address</span>
            </div>
            <p className="font-medium">{client.email}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone size={18} />
              <span>Phone Number</span>
            </div>
            <p className="font-medium">{client.phone}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Home size={18} />
              <span>Address</span>
            </div>
            <p className="font-medium">{client.address}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Next of Kin</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Primary Next of Kin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-muted-foreground" />
                  <span>{client.nextOfKin1.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-muted-foreground" />
                  <span>{client.nextOfKin1.phone}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {client.nextOfKin1.relationship}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Secondary Next of Kin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-muted-foreground" />
                  <span>{client.nextOfKin2.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-muted-foreground" />
                  <span>{client.nextOfKin2.phone}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {client.nextOfKin2.relationship}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientProfile;