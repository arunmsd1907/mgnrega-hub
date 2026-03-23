import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { UserRole } from "@/lib/mock-data";
import { Shield, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@mgnrega.gov.in");
  const [password, setPassword] = useState("password");
  const [role, setRole] = useState<UserRole>("admin");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password, role)) {
      navigate("/dashboard");
    }
  };

  const roles: { value: UserRole; label: string; desc: string }[] = [
    { value: "admin", label: "Admin", desc: "Full system access" },
    { value: "officer", label: "Officer", desc: "Project & attendance management" },
    { value: "worker", label: "Worker", desc: "View attendance & wages" },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Shield className="h-10 w-10 text-secondary" />
            <div>
              <h1 className="text-2xl font-display font-bold text-primary-foreground">MGNREGA</h1>
              <p className="text-primary-foreground/70 text-sm">Smart Monitoring System</p>
            </div>
          </div>
          <div className="mt-16">
            <h2 className="text-4xl font-display font-bold text-primary-foreground leading-tight">
              Transparent.<br />Efficient.<br />Accountable.
            </h2>
            <p className="text-primary-foreground/70 mt-6 text-lg max-w-md leading-relaxed">
              Empowering rural India through digital monitoring of employment guarantee schemes.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { n: "2,450+", l: "Active Workers" },
            { n: "186", l: "Projects" },
            { n: "₹4.2Cr", l: "Wages Disbursed" },
          ].map((s) => (
            <div key={s.l} className="bg-primary-foreground/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-secondary font-display">{s.n}</p>
              <p className="text-xs text-primary-foreground/60 mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-display font-bold">MGNREGA Monitor</h1>
          </div>
          <h2 className="text-2xl font-display font-bold">Sign In</h2>
          <p className="text-muted-foreground text-sm mt-1 mb-8">Access the monitoring dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Select Role</Label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`rounded-lg border p-3 text-center transition-all text-sm ${
                      role === r.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <span className="font-medium block">{r.label}</span>
                    <span className="text-xs text-muted-foreground">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Sign In
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Demo: Use any credentials with selected role
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
