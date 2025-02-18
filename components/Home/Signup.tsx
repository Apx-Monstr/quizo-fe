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
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Signup = ({ toggleForm }) => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    pass: "",
    repass: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (formData.pass !== formData.repass) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const result = await signup(formData);

    if (result.success) {
      alert(result.message || "Signup Successful");
      router.push("/dashboard"); // Redirect to dashboard after signup
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <Card className="max-w-[480px] w-full p-3">
        <CardHeader>
          <CardTitle className="text-4xl text-[#292137] pb-2">Signup</CardTitle>
          <CardDescription className="text-lg flex gap-1">
            Already have an account?
            <span className="text-[#292137] cursor-pointer" onClick={toggleForm}>
              Login
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="flex gap-8">
                <Input 
                  name="fname" 
                  placeholder="First Name" 
                  value={formData.fname}
                  onChange={handleChange} 
                />
                <Input 
                  name="lname" 
                  placeholder="Last Name" 
                  value={formData.lname}
                  onChange={handleChange} 
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input 
                  name="email" 
                  id="email" 
                  placeholder="Email" 
                  value={formData.email}
                  onChange={handleChange} 
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input 
                  name="pass" 
                  id="pass" 
                  type="password"
                  placeholder="Password" 
                  value={formData.pass}
                  onChange={handleChange} 
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input 
                  name="repass" 
                  id="repass" 
                  type="password"
                  placeholder="Re-enter your password" 
                  value={formData.repass}
                  onChange={handleChange} 
                />
              </div>
              <Button type="submit" className="bg-[#292137]" disabled={loading}>
                {loading ? "Signing up..." : "Signup"}
              </Button>
              {error && <p className="text-red-500 w-full text-center">{error}</p>}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;