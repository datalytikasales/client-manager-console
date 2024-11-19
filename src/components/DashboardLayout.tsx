import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface SidebarLink {
  icon: typeof LayoutDashboard;
  label: string;
  href: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
  role: "admin" | "manager" | "client";
}

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const links: Record<string, SidebarLink[]> = {
    admin: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
      { icon: Users, label: "Manage Users", href: "/admin/users" },
      { icon: FileText, label: "Loan Applications", href: "/admin/loans" },
      { icon: CreditCard, label: "Payments", href: "/admin/payments" },
      { icon: Settings, label: "Settings", href: "/admin/settings" },
    ],
    manager: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/manager/dashboard" },
      { icon: Users, label: "Clients", href: "/manager/clients" },
      { icon: FileText, label: "New Application", href: "/manager/new-loan" },
      { icon: CreditCard, label: "Payments", href: "/manager/payments" },
    ],
    client: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/client/dashboard" },
      { icon: FileText, label: "My Loans", href: "/client/loans" },
      { icon: CreditCard, label: "Make Payment", href: "/client/payment" },
      { icon: Settings, label: "Profile", href: "/client/profile" },
    ],
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-secondary">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
        <h2 className="text-xl font-bold text-primary">LoanSystem</h2>
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      <div className="flex h-[calc(100vh-4rem)] lg:h-screen">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-border transform transition-transform duration-200 ease-in-out lg:relative lg:transform-none",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="h-full flex flex-col">
            <div className="p-6 hidden lg:block">
              <h2 className="text-2xl font-bold text-primary">LoanSystem</h2>
            </div>
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
              {links[role].map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      location.pathname === link.href
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-secondary"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t">
              <Link
                to="/login"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-secondary transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Log out</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8 w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;