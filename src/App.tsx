import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Index from "./pages/Index";
import Login from "./pages/Login";
import { AdminLayout } from "./components/admin/AdminLayout";
import CreateCompany from "./pages/admin/CreateCompany";
import CompanyReport from "./pages/admin/CompanyReport";
import Transactions from "./pages/company/Transactions";
import ReportsHome from "./pages/admin/ReportsHome";
import LoansReport from "./pages/admin/LoansReport";
import TransactionsReport from "./pages/admin/TransactionsReport";
import AnalyticsReport from "./pages/admin/AnalyticsReport";
import CompanyLogin from "./pages/CompanyLogin";
import CompanyAbout from "./pages/CompanyAbout";
import ClientDashboard from "./pages/company/ClientDashboard";
import ManagerDashboard from "./pages/company/ManagerDashboard";
import CompanyAdminDashboard from "./pages/company/CompanyAdminDashboard";
import OnboardClient from "./pages/company/OnboardClient";
import OnboardManager from "./pages/company/OnboardManager";
import LoanApplication from "./pages/company/LoanApplication";
import LoanApproval from "./pages/company/LoanApproval";
import LoanSearch from "./pages/company/LoanSearch";
import ClientSearch from "./pages/company/ClientSearch";
import ClientProfile from "./pages/company/ClientProfile";
import MyProfile from "./pages/company/MyProfile";
import MyLoans from "./pages/company/MyLoans";
import { ActiveLoanProfile } from "./components/loan/ActiveLoanProfile";
import UsersRegister from "./pages/company/UsersRegister";
import ClientsRegister from "./pages/company/ClientsRegister";
import ManagersRegister from "./pages/company/ManagersRegister";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          
          {/* System Owner Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<CreateCompany />} />
            <Route path="create-company" element={<CreateCompany />} />
            <Route path="company-report" element={<CompanyReport />} />
            <Route path="transactions" element={<Transactions />} />
          </Route>

          {/* Company Routes */}
          <Route path="/:companyUsername">
            <Route index element={<CompanyLogin />} />
            <Route path="about" element={<CompanyAbout />} />
            
            {/* Client Routes */}
            <Route path="client">
              <Route path="dashboard" element={<ClientDashboard />} />
              <Route path="my-profile" element={<MyProfile />} />
              <Route path="my-loans" element={<MyLoans />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="loan-application" element={<LoanApplication />} />
              <Route path="loan/:loanId" element={<ActiveLoanProfile />} />
            </Route>

            {/* Manager Routes */}
            <Route path="manager">
              <Route path="dashboard" element={<ManagerDashboard />} />
              <Route path="dashboard/client/:clientId" element={<ClientProfile />} />
              <Route path="onboard-client" element={<OnboardClient />} />
              <Route path="loan-application" element={<LoanApplication />} />
              <Route path="loan-search" element={<LoanSearch />} />
              <Route path="client-search" element={<ClientSearch />} />
              <Route path="loan/:loanId" element={<ActiveLoanProfile />} />
            </Route>

            {/* Company Admin Routes */}
            <Route path="admin">
              <Route path="dashboard" element={<CompanyAdminDashboard />} />
              <Route path="dashboard/client/:clientId" element={<ClientProfile />} />
              <Route path="onboard-client" element={<OnboardClient />} />
              <Route path="onboard-manager" element={<OnboardManager />} />
              <Route path="loan-application" element={<LoanApplication />} />
              <Route path="loan-approval" element={<LoanApproval />} />
              <Route path="loan-search" element={<LoanSearch />} />
              <Route path="client-search" element={<ClientSearch />} />
              <Route path="loan/:loanId" element={<ActiveLoanProfile />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="reports" element={<ReportsHome />} />
              <Route path="reports/loans" element={<LoansReport />} />
              <Route path="reports/transactions" element={<TransactionsReport />} />
              <Route path="reports/analytics" element={<AnalyticsReport />} />
              {/* New User Register Routes */}
              <Route path="users" element={<UsersRegister />} />
              <Route path="users/clients" element={<ClientsRegister />} />
              <Route path="users/managers" element={<ManagersRegister />} />
            </Route>
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;