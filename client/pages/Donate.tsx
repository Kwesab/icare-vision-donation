import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Donate() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    amount: "",
    message: "",
  });

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
    setIsLoading(true);

    try {
      // Initialize Paystack payment
      const response = await fetch("/api/donate/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          amount: parseFloat(formData.amount),
          message: formData.message || null,
        }),
      });

      const data = await response.json();
      
      console.log("Server response:", data);

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to initialize payment");
      }

      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else {
        throw new Error("No authorization URL received");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`Failed to process donation: ${error instanceof Error ? error.message : "Please try again."}`);
    } finally {
      setIsLoading(false);
    }
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
            <Link to="/donors" className="text-foreground hover:text-primary font-medium transition">
              Donors
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Make Your Donation</h1>
          <p className="text-lg text-muted-foreground">
            Your generosity brings hope and care to orphans in need. Every donation, no matter the size, makes a difference.
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-8 border border-blue-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="fullName" className="text-base font-semibold text-foreground">
                Full Name *
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="mt-2 h-12"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-base font-semibold text-foreground">
                Email Address *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-2 h-12"
              />
            </div>

            <div>
              <Label htmlFor="amount" className="text-base font-semibold text-foreground">
                Donation Amount (USD) *
              </Label>
              <div className="flex items-center mt-2">
                <span className="text-lg font-semibold text-primary mr-2">$</span>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  placeholder="50.00"
                  min="1"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="h-12 flex-1"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">Minimum donation: $1</p>
            </div>

            <div>
              <Label htmlFor="message" className="text-base font-semibold text-foreground">
                Message (Optional)
              </Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Share why this cause is important to you..."
                value={formData.message}
                onChange={handleChange}
                className="mt-2 resize-none"
                rows={4}
              />
              <p className="text-sm text-muted-foreground mt-2">This message will appear on our public donor list</p>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !formData.fullName || !formData.email || !formData.amount}
              className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-base font-semibold"
            >
              {isLoading ? "Processing..." : "Proceed to Payment"}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-blue-200">
            <h3 className="font-semibold text-foreground mb-4">Why Your Donation Matters</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Provides shelter and care for vulnerable children</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Supports education and skill development</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Ensures access to healthcare and nutrition</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Builds a brighter future through mentorship</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Secure payment powered by Paystack
          </p>
          <Link to="/donors">
            <Button variant="outline" className="text-foreground border-border hover:bg-gray-50">
              View All Donors
            </Button>
          </Link>
        </div>
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
