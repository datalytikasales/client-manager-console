import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/auth";
import { useCompanyLogin } from "@/hooks/useCompanyLogin";

export default function CompanyLogin() {
  const navigate = useNavigate();
  const { companyUsername } = useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("client");

  console.log('CompanyLogin mounted for company:', companyUsername);

  const { data: company, isError } = useQuery({
    queryKey: ['company', companyUsername],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('company_name, company_logo, id')
        .filter('company_username', 'eq', companyUsername)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Company not found');
      console.log('Found company:', data);
      return data;
    }
  });

  const { handleLogin, isLoading } = useCompanyLogin(company?.id || 0, companyUsername || '');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(email, password, selectedRole);
  };

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Company Not Found</h2>
          <p className="text-gray-600 mb-6">
            The company you're looking for doesn't exist or may have been moved.
          </p>
          <Button onClick={() => navigate('/')} variant="outline">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {company?.company_logo && (
                <img 
                  src={company.company_logo} 
                  alt={`${company.company_name} logo`}
                  className="h-8 w-auto"
                />
              )}
            </div>
            <div className="flex items-center">
              <Link to={`/${companyUsername}/about`} className="text-gray-600 hover:text-gray-900">
                About
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome to {company?.company_name}
            </h2>
            <p className="mt-2 text-gray-600">Please select your role and sign in</p>
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            {(['client', 'manager', 'admin'] as UserRole[]).map((role) => (
              <Button
                key={role}
                variant={selectedRole === role ? 'default' : 'outline'}
                onClick={() => setSelectedRole(role)}
                className="capitalize"
              >
                {role}
              </Button>
            ))}
          </div>

          <form className="mt-8 space-y-6" onSubmit={onSubmit}>
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}