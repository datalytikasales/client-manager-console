import { PlusCircle, FileBarChart, FileText, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Create New Company",
    icon: PlusCircle,
    path: "/admin/create-company",
  },
  {
    title: "Company Summary Report",
    icon: FileBarChart,
    path: "/admin/company-report",
  },
  {
    title: "Reports",
    icon: FileText,
    path: "/admin/reports",
  },
  {
    title: "Users",
    icon: Users,
    path: "/admin/users",
  },
];

export function AdminSidebar() {
  const navigate = useNavigate();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>System Admin Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}