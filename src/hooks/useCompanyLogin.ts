import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserRole, UserTable } from "@/types/auth";

export const useCompanyLogin = (companyId: number, companyUsername: string) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email: string, password: string, selectedRole: UserRole) => {
    setIsLoading(true);
    console.log('Attempting login with:', { email, password, role: selectedRole, company: companyUsername, companyId });

    try {
      let userTableName: UserTable;
      switch (selectedRole) {
        case 'admin':
          userTableName = 'app_admin_users';
          break;
        case 'manager':
          userTableName = 'app_manager_users';
          break;
        case 'client':
          userTableName = 'app_client_users';
          break;
      }

      console.log('Querying table:', userTableName, 'with company_id:', companyId);

      if (selectedRole === 'client') {
        const { data: clientUser, error: clientError } = await supabase
          .from('app_client_users')
          .select('*, clients:client_id(*)')
          .eq('email', email)
          .eq('password', password)
          .eq('company_id', companyId)
          .maybeSingle();

        if (clientError) {
          console.error('Database error:', clientError);
          throw new Error('Failed to verify credentials');
        }

        if (!clientUser) {
          throw new Error('Invalid credentials or user not found');
        }

        localStorage.setItem("userRole", selectedRole);
        localStorage.setItem("userId", clientUser.id.toString());
        localStorage.setItem("clientId", clientUser.client_id.toString());
        localStorage.setItem("userEmail", email);
        
        console.log('Client login successful. User ID:', clientUser.id, 'Client ID:', clientUser.client_id);
      } else if (selectedRole === 'manager') {
        const { data: managerUser, error: managerError } = await supabase
          .from('app_manager_users')
          .select('*')
          .eq('email', email)
          .eq('password', password)
          .eq('company_id', companyId)
          .maybeSingle();

        if (managerError) {
          console.error('Database error:', managerError);
          throw new Error('Failed to verify credentials');
        }

        if (!managerUser) {
          throw new Error('Invalid credentials or user not found');
        }

        localStorage.setItem("userRole", selectedRole);
        localStorage.setItem("userId", managerUser.id.toString());
        localStorage.setItem("userEmail", email);
        localStorage.setItem("managerId", managerUser.manager_id.toString());

        console.log('Manager login successful. User ID:', managerUser.id, 'Manager ID:', managerUser.manager_id);
      } else {
        const { data: adminUser, error: adminError } = await supabase
          .from('app_admin_users')
          .select('*')
          .eq('email', email)
          .eq('password', password)
          .eq('company_id', companyId)
          .maybeSingle();

        if (adminError) {
          console.error('Database error:', adminError);
          throw new Error('Failed to verify credentials');
        }

        if (!adminUser) {
          throw new Error('Invalid credentials or user not found');
        }

        localStorage.setItem("userRole", selectedRole);
        localStorage.setItem("userId", adminUser.id.toString());
        localStorage.setItem("userEmail", email);
      }
      
      const dashboardRoute = `/${companyUsername}/${selectedRole}/dashboard`;
      navigate(dashboardRoute);
      toast.success('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid credentials. Please check your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading };
};