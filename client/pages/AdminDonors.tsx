import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  LogOut,
  Edit2,
  Trash2,
  Plus,
  ChevronLeft,
} from "lucide-react";

interface Donor {
  id: string;
  donor_name: string;
  donor_email: string;
  amount: number;
  message: string | null;
  payment_type: string;
  status: string;
  created_at: string;
}

export default function AdminDonors() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(
    searchParams.get("action") === "add-manual"
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    donor_name: "",
    donor_email: "",
    amount: "",
    message: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchDonors(token);
  }, [navigate]);

  const fetchDonors = async (token: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/admin/donors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminId");
          navigate("/admin/login");
          return;
        }
        throw new Error("Failed to fetch donors");
      }

      const data = await response.json();
      console.log("Fetched donors:", data);
      setDonors(data || []);
    } catch (err) {
      console.error("Error fetching donors:", err);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      const endpoint = editingId
        ? `/api/admin/donors/${editingId}`
        : "/api/admin/donors/manual-add";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          donor_name: formData.donor_name,
          donor_email: formData.donor_email,
          amount: parseFloat(formData.amount),
          message: formData.message || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save donation");
      }

      // Refresh donors list
      fetchDonors(token);
      setFormData({ donor_name: "", donor_email: "", amount: "", message: "" });
      setShowAddForm(false);
      setEditingId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleEdit = (donor: Donor) => {
    setFormData({
      donor_name: donor.donor_name,
      donor_email: donor.donor_email,
      amount: donor.amount.toString(),
      message: donor.message || "",
    });
    setEditingId(donor.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this donation?")) return;

    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      const response = await fetch(`/api/admin/donors/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete donation");
      }

      fetchDonors(token);
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Link to="/admin/dashboard">
                <Button variant="ghost" size="sm" className="px-2">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </Link>
              <h1 className="text-4xl font-bold text-foreground">Manage Donors</h1>
            </div>
            <p className="text-muted-foreground ml-12">
              View, edit, and manage all donation records
            </p>
          </div>
          <Button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingId(null);
              setFormData({
                donor_name: "",
                donor_email: "",
                amount: "",
                message: "",
              });
            }}
            className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Manual Donation
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg border border-border p-8 mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {editingId ? "Edit Donation" : "Add Manual Donation"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="donor_name" className="text-base font-semibold">
                    Donor Name *
                  </Label>
                  <Input
                    id="donor_name"
                    name="donor_name"
                    type="text"
                    value={formData.donor_name}
                    onChange={handleChange}
                    required
                    className="mt-2 h-10"
                  />
                </div>
                <div>
                  <Label htmlFor="donor_email" className="text-base font-semibold">
                    Email *
                  </Label>
                  <Input
                    id="donor_email"
                    name="donor_email"
                    type="email"
                    value={formData.donor_email}
                    onChange={handleChange}
                    required
                    className="mt-2 h-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="amount" className="text-base font-semibold">
                  Amount (USD) *
                </Label>
                <div className="flex items-center mt-2">
                  <span className="text-lg font-semibold text-primary mr-2">$</span>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    min="1"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    className="h-10 flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message" className="text-base font-semibold">
                  Message (Optional)
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-2 resize-none"
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  {editingId ? "Update Donation" : "Add Donation"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingId(null);
                    setFormData({
                      donor_name: "",
                      donor_email: "",
                      amount: "",
                      message: "",
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Donors Table */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading donors...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600">Error: {error}</p>
          </div>
        ) : donors.length === 0 ? (
          <div className="bg-white rounded-lg border border-border p-12 text-center">
            <p className="text-muted-foreground mb-6">No donations yet</p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Add First Donation
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {donors.map((donor) => (
                    <tr key={donor.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-foreground font-medium">
                        {donor.donor_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {donor.donor_email}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">
                        ${Number(donor.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            donor.payment_type === "online"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {donor.payment_type === "online"
                            ? "Online"
                            : "Cash"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatDate(donor.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(donor)}
                          className="text-primary hover:bg-blue-50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(donor.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
