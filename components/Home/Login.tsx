"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

const Login = ({ toggleForm }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(formData.email, formData.password);

    if (result.success) {
      alert("Login Successful");
      router.push("/dashboard"); // Redirect to dashboard after login
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <Card className="max-w-[480px] w-full p-3">
        <CardHeader>
          <CardTitle className="text-4xl text-[#292137] pb-2">Login</CardTitle>
          <CardDescription className="text-lg">
            Don`t have an account?{" "}
            <span className="text-[#292137] cursor-pointer" onClick={toggleForm}>
              Signup
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <Input 
                name="email" 
                placeholder="Email" 
                value={formData.email}
                onChange={handleChange} 
              />
              <Input 
                name="password" 
                placeholder="Password" 
                type="password" 
                value={formData.password}
                onChange={handleChange} 
              />
              <Button type="submit" className="bg-[#292137]" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
              {error && <p className="text-red-500 w-full text-center">{error}</p>}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;