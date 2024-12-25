import { useQuery } from "@tanstack/react-query";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

interface CompanyTopbarProps {
  companyLogo?: string;
  companyName?: string;
}

export function CompanyTopbar({ companyLogo, companyName }: CompanyTopbarProps) {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");
  const clientId = localStorage.getItem("clientId");
  const userEmail = localStorage.getItem("userEmail");

  const { data: userData } = useQuery({
    queryKey: ['user-data', userRole, userId, clientId],
    queryFn: async () => {
      if (!userId) return null;

      if (userRole === 'client' && clientId) {
        console.log('Fetching client data with client_id:', clientId);
        const { data } = await supabase
          .from('clients')
          .select('first_name, last_name')
          .eq('id', clientId)
          .single();
        return data;
      } else if (userRole === 'manager') {
        const { data: managerUser } = await supabase
          .from('app_manager_users')
          .select('manager_id')
          .eq('id', userId)
          .single();

        if (managerUser) {
          const { data } = await supabase
            .from('managers')
            .select('first_name, last_name')
            .eq('id', managerUser.manager_id)
            .single();
          return data;
        }
      }
      return null;
    },
    enabled: !!userId && (userRole === 'client' || userRole === 'manager'),
  });

  const displayName = userData 
    ? `${userData.first_name} ${userData.last_name}`
    : userRole === 'admin' 
      ? `ADMIN (${userEmail})`
      : 'User';

  const handleLogout = () => {
    localStorage.removeItem("adminId");
    localStorage.removeItem("managerId");
    localStorage.removeItem("clientId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    navigate('/');
  };

  return (
    <header className="bg-white shadow">
      <div className="flex justify-between items-center px-4 py-4">
        <div className="flex items-center">
          {companyLogo && (
            <img
              src={companyLogo}
              alt={`${companyName} logo`}
              className="h-8 w-auto"
            />
          )}
          {companyName && (
            <span className="ml-2 text-lg font-semibold text-gray-900">
              {companyName}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700">{displayName}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
          >
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}