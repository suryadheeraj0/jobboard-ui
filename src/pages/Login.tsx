import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Briefcase, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await api.login(form);
      const user = res?.user || res;
      const role = (user?.role || res?.role || "USER").toUpperCase();
      login({
        userId: String(user?.id ?? user?.userId ?? res?.id ?? ""),
        name: user?.name ?? res?.name ?? form.email.split("@")[0],
        email: user?.email ?? form.email,
        role: role === "ADMIN" ? "ADMIN" : "USER",
      });
      toast.success("Welcome back!");
      const from = (location.state as any)?.from;
      navigate(from || (role === "ADMIN" ? "/admin" : "/dashboard"), { replace: true });
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="relative hidden md:flex flex-col justify-between p-12 bg-gradient-hero text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-50" />
        <Link to="/" className="relative flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-primary-foreground/15 backdrop-blur grid place-items-center">
            <Briefcase className="h-4 w-4" />
          </div>
          <span className="font-display font-bold">TalentBridge</span>
        </Link>
        <div className="relative">
          <h2 className="font-display text-4xl font-bold leading-tight">
            Welcome back. Your next opportunity is waiting.
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-md">
            Sign in to track applications, get matched with new roles, and pick up where you left off.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
            {[{ n: "12k+", l: "Jobs" }, { n: "2k+", l: "Companies" }, { n: "184k", l: "Applications" }].map((s) => (
              <div key={s.l} className="rounded-xl bg-primary-foreground/10 backdrop-blur p-4">
                <p className="font-display text-2xl font-bold">{s.n}</p>
                <p className="text-xs text-primary-foreground/70">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-primary-foreground/60">© {new Date().getFullYear()} TalentBridge</p>
      </div>

      <div className="flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="md:hidden flex items-center gap-2 mb-8">
            <div className="h-9 w-9 rounded-xl bg-gradient-hero grid place-items-center">
              <Briefcase className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">TalentBridge</span>
          </Link>
          <h1 className="font-display text-3xl font-bold">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enter your details to access your dashboard.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-9"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  className="pl-9 pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-gradient-hero text-primary-foreground hover:opacity-95 shadow-elegant">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</> : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">Create one</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
