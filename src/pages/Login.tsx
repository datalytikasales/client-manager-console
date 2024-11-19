import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const Login = () => {
  const [role, setRole] = useState<"client" | "manager" | "admin" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Simulate login - in real app, this would be an API call
    toast.success("Login successful");
    navigate(`/${role}/dashboard`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary to-background p-4">
      <div className="w-full max-w-md space-y-8 fade-in">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        <Card className="p-6 glass-card">
          <div className="space-y-6">
            {!role ? (
              <div className="grid grid-cols-3 gap-4">
                {["client", "manager", "admin"].map((r) => (
                  <Button
                    key={r}
                    variant={role === r ? "default" : "outline"}
                    className="w-full capitalize"
                    onClick={() => setRole(r as typeof role)}
                  >
                    {r}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <Button
                  variant="ghost"
                  className="text-sm"
                  onClick={() => setRole(null)}
                >
                  ← Change role
                </Button>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Button type="button" variant="link" className="text-sm">
                      Forgot password?
                    </Button>
                    <Button type="button" variant="link" className="text-sm">
                      Sign up
                    </Button>
                  </div>
                  <Button type="submit" className="w-full">
                    Sign in
                  </Button>
                </form>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;