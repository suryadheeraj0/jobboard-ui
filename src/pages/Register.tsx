import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Briefcase, Mail, Lock, User, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const strength = (() => {
    let s = 0;
    if (form.password.length >= 8) s++;
    if (/[A-Z]/.test(form.password)) s++;
    if (/[0-9]/.test(form.password)) s++;
    if (/[^A-Za-z0-9]/.test(form.password)) s++;
    return s;
  })();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    else if (form.name.trim().length < 2) e.name = "Name is too short";
    if (!form.email) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "At least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await api.register({ name: form.name.trim(), email: form.email, password: form.password });
      const user = res?.user || res;
      const role = (user?.role || "USER").toUpperCase();
      login({
        userId: String(user?.id ?? user?.userId ?? ""),
        name: user?.name ?? form.name,
        email: user?.email ?? form.email,
        role: role === "ADMIN" ? "ADMIN" : "USER",
      });
      toast.success("Account created — welcome to TalentBridge!");
      navigate(role === "ADMIN" ? "/admin" : "/dashboard", { replace: true });
    } catch (err: any) {
      toast.error(err.message || "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="flex items-center justify-center p-8 order-2 md:order-1">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Link to="/" className="md:hidden flex items-center gap-2 mb-8">
            <div className="h-9 w-9 rounded-xl bg-gradient-hero grid place-items-center">
              <Briefcase className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">TalentBridge</span>
          </Link>
          <h1 className="font-display text-3xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Start applying to top roles in minutes.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="name" className="pl-9" placeholder="Jane Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" className="pl-9" placeholder="you@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type={show ? "text" : "password"} className="pl-9 pr-10" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.password && (
                <div className="flex gap-1 mt-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                      i < strength
                        ? strength <= 1 ? "bg-destructive" : strength <= 2 ? "bg-warning" : "bg-success"
                        : "bg-muted"
                    }`} />
                  ))}
                </div>
              )}
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-gradient-hero text-primary-foreground hover:opacity-95 shadow-elegant">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</> : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>

      <div className="relative hidden md:flex flex-col justify-between p-12 bg-gradient-hero text-primary-foreground overflow-hidden order-1 md:order-2">
        <div className="absolute inset-0 bg-gradient-glow opacity-50" />
        <Link to="/" className="relative flex items-center gap-2 self-end">
          <div className="h-9 w-9 rounded-xl bg-primary-foreground/15 backdrop-blur grid place-items-center">
            <Briefcase className="h-4 w-4" />
          </div>
          <span className="font-display font-bold">TalentBridge</span>
        </Link>
        <div className="relative">
          <h2 className="font-display text-4xl font-bold leading-tight">Built for ambitious people.</h2>
          <p className="mt-4 text-primary-foreground/80 max-w-md">A modern job search experience. No spam, no clutter, no recruiter mass-emails.</p>
          <ul className="mt-8 space-y-3 text-sm">
            {["One-click apply with saved profiles", "Real-time application tracking", "Verified companies only", "Free forever"].map((p) => (
              <li key={p} className="flex items-center gap-2"><Check className="h-4 w-4" /> {p}</li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-primary-foreground/60">© {new Date().getFullYear()} TalentBridge</p>
      </div>
    </div>
  );
}
