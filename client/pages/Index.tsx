import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Users, Target, Zap } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-accent fill-accent" />
            <span className="text-2xl font-bold text-foreground">iCare Vision</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/donors" className="text-foreground hover:text-primary font-medium transition">
              Donors
            </Link>
            <Link to="/admin/login" className="w-3 h-3 rounded-full bg-gray-400 hover:bg-gray-600 transition" title="Admin Portal">
              <span className="sr-only">Admin</span>
            </Link>
            <Link to="/donate">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                Donate Now
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-20 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Give Hope This Christmas 🎄
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            iCare Vision Foundation is dedicated to providing care and support for orphans. This Christmas, join us in making a difference in the lives of vulnerable children.
          </p>
          
          {/* Impact Banner */}
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto mb-8 border-2 border-blue-200">
            <h3 className="text-2xl font-bold text-foreground mb-4">Your Donation Transforms Lives</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
              <div className="flex items-start gap-2">
                <span className="text-2xl">📚</span>
                <div>
                  <p className="font-semibold text-foreground">School Fees</p>
                  <p className="text-sm text-muted-foreground">Quality education</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-2xl">🏥</span>
                <div>
                  <p className="font-semibold text-foreground">Healthcare</p>
                  <p className="text-sm text-muted-foreground">Medical support</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-2xl">🎁</span>
                <div>
                  <p className="font-semibold text-foreground">Christmas Gifts</p>
                  <p className="text-sm text-muted-foreground">Joy & celebration</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-2xl">🎓</span>
                <div>
                  <p className="font-semibold text-foreground">Scholarships</p>
                  <p className="text-sm text-muted-foreground">Bright futures</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-2xl">🍽️</span>
                <div>
                  <p className="font-semibold text-foreground">Nutrition</p>
                  <p className="text-sm text-muted-foreground">Healthy meals</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-2xl">👕</span>
                <div>
                  <p className="font-semibold text-foreground">Clothing</p>
                  <p className="text-sm text-muted-foreground">Basic needs</p>
                </div>
              </div>
            </div>
          </div>

          <Link to="/donate">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg shadow-lg">
              Make a Donation Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">50+</div>
              <p className="text-muted-foreground text-lg">Children Helped</p>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-secondary mb-2">20+</div>
              <p className="text-muted-foreground text-lg">Generous Donors</p>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-accent mb-2">$100K+</div>
              <p className="text-muted-foreground text-lg">Target Funds</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-16">
            How Your Donation Helps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg border border-border hover:shadow-lg transition">
              <Heart className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Shelter & Care</h3>
              <p className="text-muted-foreground">Safe homes and loving care for orphaned children</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-border hover:shadow-lg transition">
              <Target className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Education</h3>
              <p className="text-muted-foreground">Quality schooling and skill development programs</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-border hover:shadow-lg transition">
              <Zap className="w-12 h-12 text-secondary mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Health Services</h3>
              <p className="text-muted-foreground">Medical care and nutrition programs</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-border hover:shadow-lg transition">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Community</h3>
              <p className="text-muted-foreground">Building futures through mentorship</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Every Gift Makes a Difference
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Whether it's $5 or $500, your contribution transforms lives and brings hope to those in need.
          </p>
          <Link to="/donate">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
              Donate Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
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
              <p className="text-blue-200 text-sm">Email: melvin02281728@gmail.com</p>
              <p className="text-blue-200 text-sm">Phone: +1 (818) 497-9266</p>
            </div>
          </div>
          <div className="border-t border-blue-700 pt-8 text-center text-blue-200 text-sm">
            <p>&copy; 2025 iCare Vision Foundation. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
