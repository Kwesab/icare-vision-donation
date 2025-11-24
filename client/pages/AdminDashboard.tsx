import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Heart,
  LogOut,
  Users,
  DollarSign,
  TrendingUp,
  CreditCard,
} from "lucide-react";

interface DashboardStats {
  totalDonations: number;
  totalDonors: number;
  totalAmount: number;
  onlineDonations: number;
  cashDonations: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchStats(token);
  }, [navigate]);

  const fetchStats = async (token: string) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminId");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-accent fill-accent" />
            <span className="text-2xl font-bold text-foreground">iCare Vision</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Admin Panel</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Monitor donations and manage your platform</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <Link to="/admin/dashboard">
            <Button
              variant="ghost"
              className="border-b-2 border-primary text-primary font-semibold rounded-none h-auto py-4"
            >
              Overview
            </Button>
          </Link>
          <Link to="/admin/donors">
            <Button variant="ghost" className="rounded-none h-auto py-4">
              Manage Donors
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading stats...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">Error: {error}</p>
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Total Donations */}
            <div className="bg-white rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Total Donations
                </h3>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">
                {stats.totalDonations}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Completed donations
              </p>
            </div>

            {/* Total Donors */}
            <div className="bg-white rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Total Donors
                </h3>
                <Users className="w-5 h-5 text-secondary" />
              </div>
              <p className="text-3xl font-bold text-foreground">
                {stats.totalDonors}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Unique donors
              </p>
            </div>

            {/* Total Amount */}
            <div className="bg-white rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Total Amount
                </h3>
                <DollarSign className="w-5 h-5 text-accent" />
              </div>
              <p className="text-3xl font-bold text-foreground">
                ${stats.totalAmount.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">USD</p>
            </div>

            {/* Online Donations */}
            <div className="bg-white rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Online Donations
                </h3>
                <CreditCard className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-foreground">
                {stats.onlineDonations}
              </p>
              <p className="text-xs text-muted-foreground mt-2">Via Paystack</p>
            </div>

            {/* Cash Donations */}
            <div className="bg-white rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Cash Donations
                </h3>
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-foreground">
                {stats.cashDonations}
              </p>
              <p className="text-xs text-muted-foreground mt-2">Manual entries</p>
            </div>
          </div>
        ) : null}

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/admin/donors">
              <div className="bg-white rounded-lg border border-border p-6 hover:shadow-lg transition cursor-pointer">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Manage Donors
                </h3>
                <p className="text-muted-foreground mb-4">
                  View, edit, and delete donation records
                </p>
                <Button variant="outline" className="text-primary border-primary">
                  Go to Donors →
                </Button>
              </div>
            </Link>
            <Link to="/admin/donors?action=add-manual">
              <div className="bg-white rounded-lg border border-border p-6 hover:shadow-lg transition cursor-pointer">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Add Manual Donation
                </h3>
                <p className="text-muted-foreground mb-4">
                  Record cash donations or offline contributions
                </p>
                <Button variant="outline" className="text-primary border-primary">
                  Add Donation →
                </Button>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
