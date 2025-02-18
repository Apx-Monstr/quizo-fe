"use client"
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the authentication context
const AuthContext = createContext();

// Hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUserId = localStorage.getItem('userid');
      const storedFname = localStorage.getItem('fname');
      const storedLname = localStorage.getItem('lname');
      
      if (storedToken && storedUserId && storedFname && storedLname) {
        setToken(storedToken);
        setCurrentUser({ userid: storedUserId, fname: storedFname, lname: storedLname });
        
        // Configure axios to use the token for all requests
        axios.defaults.headers.common['Authorization'] = `${storedToken}`;
      }
      
      setLoading(false);
      setInitialized(true);
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post("https://quizo-orpin.vercel.app/api/login", { email, password });
      
      // Save token and user data in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userid", res.data.user.userid);
      localStorage.setItem("fname", res.data.user.fname);
      localStorage.setItem("lname", res.data.user.lname);
      
      // Update context state
      setToken(res.data.token);
      setCurrentUser({ userid: res.data.user.userid, fname: res.data.user.fname, lname: res.data.user.lname });
      
      // Configure axios to use the token for all requests
      axios.defaults.headers.common['Authorization'] = `${res.data.token}`;
      
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || "Login failed" 
      };
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      const res = await axios.post("https://quizo-orpin.vercel.app/api/signup", {
        fname: userData.fname,
        lname: userData.lname,
        email: userData.email,
        passhash: userData.pass,
      });
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userid", res.data.userid);
      localStorage.setItem("fname", userData.fname);
      localStorage.setItem("lname", userData.lname);
      
      setToken(res.data.token);
      setCurrentUser({ userid: res.data.userid, fname: userData.fname, lname: userData.lname });
      
      axios.defaults.headers.common['Authorization'] = `${res.data.token}`;
      
      return { success: true, message: res.data.message };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || "Signup failed" 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userid');
    localStorage.removeItem('fname');
    localStorage.removeItem('lname');
    setToken(null);
    setCurrentUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const isAuthenticated = () => {
    return !!token;
  };

  const value = {
    currentUser,
    token,
    login,
    signup,
    logout,
    isAuthenticated,
    initialized
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
