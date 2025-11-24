import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, Users } from "lucide-react";

interface Donor {
  id: string;
  donor_name: string;
  message: string | null;
  payment_type: string;
  created_at: string;
}

export default function Donors() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/donors");
      if (!response.ok) {
        throw new Error("Failed to fetch donors");
      }
      const data = await response.json();
      setDonors(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPaymentTypeLabel = (type: string) => {
    return type === "online" ? "Online Donation" : "Cash Donation";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-accent fill-accent" />
            <span className="text-2xl font-bold text-foreground">iCare Vision</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/donate">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                Donate Now
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Our Generous Donors</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            These wonderful individuals have shown their compassion and generosity by supporting iCare Vision Foundation.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center gap-4">
              <Users className="w-12 h-12 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Donors</p>
                <p className="text-3xl font-bold text-foreground">{donors.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
            <div className="flex items-center gap-4">
              <Heart className="w-12 h-12 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Lives Touched</p>
                <p className="text-3xl font-bold text-foreground">50+</p>
              </div>
            </div>
          </div>
        </div>

        {/* Donor List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading donors...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">Error loading donors: {error}</p>
          </div>
        ) : donors.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-12 text-center">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-6">
              Be the first to support iCare Vision Foundation
            </p>
            <Link to="/donate">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                Make a Donation
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donors.map((donor) => (
              <div
                key={donor.id}
                className="bg-white rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">
                  <p className="text-lg font-semibold text-foreground">{donor.donor_name}</p>
                  <p className="text-sm text-primary font-medium">
                    {getPaymentTypeLabel(donor.payment_type)}
                  </p>
                </div>

                {donor.message && (
                  <div className="mb-4 p-3 bg-gray-50 rounded border border-border">
                    <p className="text-sm text-foreground italic">"{donor.message}"</p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(donor.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        {donors.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Join Our Community of Donors
            </h2>
            <p className="text-blue-100 mb-6">
              Your generosity can change lives. Make a donation today.
            </p>
            <Link to="/donate">
              <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-base font-semibold">
                Donate Now
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12 mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-accent fill-accent" />
                <span className="text-lg font-bold">iCare Vision Foundation</span>
              </div>
              <p className="text-blue-200 text-sm">Bringing hope and care to orphans in need.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li><Link to="/" className="hover:text-white transition">Home</Link></li>
                <li><Link to="/donate" className="hover:text-white transition">Donate</Link></li>
                <li><Link to="/donors" className="hover:text-white transition">Donors</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <p className="text-blue-200 text-sm">Email: info@icarevision.org</p>
              <p className="text-blue-200 text-sm">Phone: +1 (USA)</p>
            </div>
          </div>
          <div className="border-t border-blue-700 pt-8 text-center text-blue-200 text-sm">
            <p>&copy; 2024 iCare Vision Foundation. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
