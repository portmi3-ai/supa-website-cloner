import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/App";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch user profile data
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate("/auth");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1 overflow-y-auto">
          {/* Top Bar */}
          <div className="border-b">
            <div className="flex h-16 items-center px-4 gap-4">
              <SidebarTrigger />
              <div className="flex-1" />
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {profile?.username || user?.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Welcome Back{profile?.username ? `, ${profile.username}` : ''}!</h1>
            
            {/* Dashboard Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="font-semibold mb-2">Profile Completion</h3>
                <p className="text-sm text-muted-foreground">
                  Complete your profile to get the most out of our platform.
                </p>
              </div>
              
              <div className="rounded-lg border bg-card p-6">
                <h3 className="font-semibold mb-2">Recent Activity</h3>
                <p className="text-sm text-muted-foreground">
                  Track your recent actions and updates.
                </p>
              </div>
              
              <div className="rounded-lg border bg-card p-6">
                <h3 className="font-semibold mb-2">Quick Actions</h3>
                <p className="text-sm text-muted-foreground">
                  Access frequently used features and tools.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;