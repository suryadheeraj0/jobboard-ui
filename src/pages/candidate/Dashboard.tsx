import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FileText, CheckCircle2, XCircle, Clock, ArrowRight, Briefcase } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { AnimatedCounter } from "@/components/AnimatedCounter";

const COLORS = ["oklch(0.55 0.22 265)", "oklch(0.65 0.17 155)", "oklch(0.6 0.23 25)", "oklch(0.78 0.16 75)"];

export default function CandidateDashboard() {
  const { user } = useAuth();
  const { data: apps, isLoading } = useQuery({
    queryKey: ["apps", user?.userId],
    queryFn: () => api.getApplicationsByUser(user!.userId),
    enabled: !!user?.userId,
  });

  const list = apps ?? [];
  const submitted = list.length;
  const shortlisted = list.filter((a) => a.status === "SHORTLISTED").length;
  const rejected = list.filter((a) => a.status === "REJECTED").length;
  const active = list.filter((a) => a.status === "APPLIED").length;

  const metrics = [
    { label: "Submitted", value: submitted, icon: FileText, color: "text-primary", bg: "bg-primary/10" },
    { label: "Shortlisted", value: shortlisted, icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
    { label: "Rejected", value: rejected, icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
    { label: "Active", value: active, icon: Clock, color: "text-warning", bg: "bg-warning/10" },
  ];

  const pieData = [
    { name: "Active", value: active },
    { name: "Shortlisted", value: shortlisted },
    { name: "Rejected", value: rejected },
  ].filter((d) => d.value > 0);

  const recent = list.slice(0, 5);

  // weekly buckets (last 4 weeks)
  const weekly = Array.from({ length: 4 }, (_, i) => {
    const weekStart = Date.now() - (3 - i) * 7 * 24 * 60 * 60 * 1000;
    const weekEnd = weekStart + 7 * 24 * 60 * 60 * 1000;
    const count = list.filter((a) => {
      const d = new Date(a.appliedDate || a.createdAt || 0).getTime();
      return d >= weekStart && d < weekEnd;
    }).length;
    return { week: `W${i + 1}`, applications: count };
  });

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl md:text-4xl font-bold">Welcome back, {user?.name?.split(" ")[0]} 👋</h1>
        <p className="mt-1 text-muted-foreground">Here's how your job search is going.</p>
      </motion.div>

      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-elegant transition-all"
          >
            <div className={`h-10 w-10 rounded-xl ${m.bg} grid place-items-center`}>
              <m.icon className={`h-5 w-5 ${m.color}`} />
            </div>
            <p className="mt-3 text-xs text-muted-foreground uppercase tracking-wider">{m.label}</p>
            <p className="font-display text-3xl font-bold mt-1">
              {isLoading ? <Skeleton className="h-8 w-12" /> : <AnimatedCounter value={m.value} duration={900} />}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Applications this month</h2>
            <span className="text-xs text-muted-foreground">Last 4 weeks</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 260)" />
                <XAxis dataKey="week" stroke="oklch(0.5 0.02 260)" />
                <YAxis stroke="oklch(0.5 0.02 260)" allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }}
                />
                <Bar dataKey="applications" fill="oklch(0.55 0.22 265)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-semibold mb-4">Status breakdown</h2>
          {pieData.length === 0 ? (
            <div className="h-64 grid place-items-center text-sm text-muted-foreground">No data yet</div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent applications</h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/dashboard/applications">View all <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
          </Button>
        </div>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : recent.length === 0 ? (
          <div className="text-center py-10">
            <Briefcase className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">No applications yet.</p>
            <Button asChild className="mt-4 bg-gradient-hero text-primary-foreground">
              <Link to="/jobs">Browse jobs</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {recent.map((a) => (
              <div key={String(a.id)} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-gradient-hero grid place-items-center text-primary-foreground font-semibold text-sm shrink-0">
                    {(a.job?.company || a.company || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{a.job?.title || a.jobTitle || `Job #${a.jobId}`}</p>
                    <p className="text-xs text-muted-foreground truncate">{a.job?.company || a.company || "—"}</p>
                  </div>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const s = (status || "APPLIED").toUpperCase();
  const config: Record<string, { label: string; class: string }> = {
    APPLIED: { label: "Applied", class: "bg-primary/10 text-primary border-primary/20" },
    SHORTLISTED: { label: "Shortlisted", class: "bg-success/10 text-success border-success/20" },
    REJECTED: { label: "Rejected", class: "bg-destructive/10 text-destructive border-destructive/20" },
  };
  const c = config[s] || config.APPLIED;
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${c.class}`}>{c.label}</span>
  );
}
