import { createContext, useContext, useState, ReactNode } from "react";
import { User, UserRole, mockUser } from "./mock-data";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string, role: UserRole) => {
    // Mock login
    const names: Record<UserRole, string> = {
      admin: "Rajesh Kumar (Admin)",
      officer: "Anita Sharma (Officer)",
      worker: "Ramesh Yadav (Worker)",
    };
    setUser({ id: "1", name: names[role], email, role });
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
