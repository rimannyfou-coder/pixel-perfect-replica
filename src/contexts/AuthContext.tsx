import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

interface User {
  id: number;
  email: string;
  role: "ADMIN" | "CABINET" | "PATIENT";
  cabinet: string | null;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  passwordConfirm: string;
  nom_cabinet?: string;
  telephone?: string;
  adresse?: string;
  role?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users for demo
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  "admin@dent.com": {
    password: "admin123",
    user: { id: 1, email: "admin@dent.com", role: "CABINET", cabinet: "Cabinet Dentaire Demo" },
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("dental_auth");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user);
        setAccessToken(parsed.token);
      } catch {}
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Mock login — replace with real API call
    const mockUser = MOCK_USERS[email];
    if (mockUser && mockUser.password === password) {
      const token = "mock-jwt-token";
      setUser(mockUser.user);
      setAccessToken(token);
      localStorage.setItem("dental_auth", JSON.stringify({ user: mockUser.user, token }));
      return;
    }
    // Accept any login for demo purposes
    const demoUser: User = { id: 2, email, role: "CABINET", cabinet: "Mon Cabinet" };
    const token = "mock-jwt-token";
    setUser(demoUser);
    setAccessToken(token);
    localStorage.setItem("dental_auth", JSON.stringify({ user: demoUser, token }));
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const newUser: User = {
      id: Date.now(),
      email: data.email,
      role: (data.role as User["role"]) || "CABINET",
      cabinet: data.nom_cabinet || null,
    };
    const token = "mock-jwt-token";
    setUser(newUser);
    setAccessToken(token);
    localStorage.setItem("dental_auth", JSON.stringify({ user: newUser, token }));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("dental_auth");
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
