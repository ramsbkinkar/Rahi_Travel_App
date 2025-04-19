
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/components/ui/use-toast";

interface AuthFormsProps {
  onSuccess?: () => void;
}

const AuthForms: React.FC<AuthFormsProps> = ({ onSuccess }) => {
  const { refresh } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  
  // Error states
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    
    if (!loginEmail || !loginPassword) {
      setLoginError("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    
    try {
      const user = await signIn(loginEmail, loginPassword);
      if (user) {
        await refresh();
        toast({
          title: "Login successful",
          description: "Welcome back to Raahi!",
        });
        onSuccess?.();
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setLoginError(error.message || "Failed to sign in. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    
    if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
      setRegisterError("Please fill in all fields");
      return;
    }
    
    if (registerPassword !== registerConfirmPassword) {
      setRegisterError("Passwords do not match");
      return;
    }
    
    if (registerPassword.length < 6) {
      setRegisterError("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Attempting registration with:", { email: registerEmail, password: registerPassword, name: registerName });
      const user = await signUp(registerEmail, registerPassword, registerName);
      console.log("Registration result:", user);
      
      if (user) {
        await refresh();
        toast({
          title: "Registration successful",
          description: "Your account has been created. Welcome to Raahi!",
        });
        onSuccess?.();
      } else {
        throw new Error("Registration failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setRegisterError(error.message || "Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      
      <TabsContent value="login">
        <form onSubmit={handleLogin} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input 
              id="login-email"
              type="email"
              placeholder="john@example.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password">Password</Label>
              <button 
                type="button"
                onClick={() => setActiveTab("forgot-password")}
                className="text-xs text-raahi-blue hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <Input 
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </div>
          
          {loginError && (
            <div className="text-sm text-red-500">{loginError}</div>
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-raahi-blue hover:bg-raahi-blue-dark"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
          
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <button 
              type="button"
              onClick={() => setActiveTab("register")}
              className="text-raahi-blue hover:underline"
            >
              Sign up
            </button>
          </div>
        </form>
      </TabsContent>
      
      <TabsContent value="register">
        <form onSubmit={handleRegister} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="register-name">Full Name</Label>
            <Input 
              id="register-name"
              type="text"
              placeholder="John Doe"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="register-email">Email</Label>
            <Input 
              id="register-email"
              type="email"
              placeholder="john@example.com"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="register-password">Password</Label>
            <Input 
              id="register-password"
              type="password"
              placeholder="••••••••"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="register-confirm-password">Confirm Password</Label>
            <Input 
              id="register-confirm-password"
              type="password"
              placeholder="••••••••"
              value={registerConfirmPassword}
              onChange={(e) => setRegisterConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          {registerError && (
            <div className="text-sm text-red-500">{registerError}</div>
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-raahi-blue hover:bg-raahi-blue-dark"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
          
          <div className="text-center text-sm">
            Already have an account?{" "}
            <button 
              type="button"
              onClick={() => setActiveTab("login")}
              className="text-raahi-blue hover:underline"
            >
              Sign in
            </button>
          </div>
        </form>
      </TabsContent>
      
      <TabsContent value="forgot-password">
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <Input id="reset-email" type="email" placeholder="john@example.com" />
          </div>
          
          <Button className="w-full bg-raahi-blue hover:bg-raahi-blue-dark">
            Send Reset Link
          </Button>
          
          <div className="text-center text-sm">
            <button 
              type="button"
              onClick={() => setActiveTab("login")}
              className="text-raahi-blue hover:underline"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AuthForms;
