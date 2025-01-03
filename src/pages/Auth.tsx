import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AuthPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        toast.success("Successfully logged in!");
        navigate("/");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500">Sign in to your account to continue</p>
        </div>
        
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            style: {
              button: {
                background: 'hsl(var(--primary))',
                color: 'white',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                opacity: '1',
                pointerEvents: 'auto',
              },
              input: {
                borderRadius: '0.375rem',
                opacity: '1',
                backgroundColor: 'white',
                pointerEvents: 'auto',
              },
              anchor: {
                color: 'hsl(var(--primary))',
                opacity: '1',
                pointerEvents: 'auto',
              },
              container: {
                gap: '1rem',
              },
              divider: {
                margin: '1.5rem 0',
              },
              message: {
                borderRadius: '0.375rem',
                padding: '0.75rem',
                marginBottom: '1rem',
              },
            },
          }}
          theme="light"
          providers={[]}
          redirectTo={window.location.origin + '/auth/callback'}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email address',
                password_label: 'Password',
                button_label: 'Sign in',
                loading_button_label: 'Signing in...',
              },
              sign_up: {
                email_label: 'Email address',
                password_label: 'Create a password',
                button_label: 'Create account',
                loading_button_label: 'Creating account...',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default AuthPage;