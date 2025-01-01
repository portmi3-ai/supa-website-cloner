import { Button } from "@/components/ui/button";
import { ArrowRight, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/App";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* User Menu */}
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <span className="text-sm text-gray-600">{user?.email}</span>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Transform Your Digital Presence
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create beautiful, responsive websites with our powerful platform. Built with modern technologies for the modern web.
          </p>
          <Button className="bg-primary hover:bg-primary/90">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Easy to Use</h3>
            <p className="text-gray-600">
              Intuitive interface that makes website creation a breeze
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Responsive Design</h3>
            <p className="text-gray-600">
              Looks great on all devices, from mobile to desktop
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Modern Stack</h3>
            <p className="text-gray-600">
              Built with React, TypeScript, and Supabase
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-primary/5 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-6">
            Join thousands of users who are already creating amazing websites
          </p>
          <Button variant="secondary">
            Start Building Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;