import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, Users, FileText, Activity, Plus, ArrowRight } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from "recharts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { AnimatedCounter } from "@/components/AnimatedCounter";

export default function AdminDashboard() {
  const { data: jobs, isLoading } = useQuery({ queryKey: ["jobs"], queryFn: api.getJobs });

  const list = jobs ?? [];
  const totalJobs = list.length;
  const activeJobs = list.length; // Could refine if API had active flag

  // synthetic series for sparkline based on createdAt
  const series = Array.from({ length: 7 }, (_, i) => {
    const dayStart = Date.now() - (6 - i) * 24 * 60 * 60 * 1000;
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    const count = list.filter((j) => {
      const d = new Date(j.createdAt || j.postedDate || 0).getTime();
      return d >= dayStart && d < dayEnd;
    }).length;
    return { day: new Date(dayStart).toLocaleDateString(undefined, { weekday: "short" }), jobs: count };
  });

  const metrics = [
    { label: "Total Jobs", value: totalJobs, icon: Briefcase, color: "text-primary", bg: "bg-primary/10" },
    { label: "Active Jobs", value: activeJobs, icon: Activity, color: "text-success", bg: "bg-success/10" },
    { label: "Applications", value: 0, icon: FileText, color: "text-warning", bg: "bg-warning/10", hint: "All-time" },
    { label: "Candidates", value: 0, icon: Users, color: "text-accent-foreground", bg: "bg-accent", hint: "Active" },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Overview of your hiring pipeline.</p>
        </motion.div>
        <Button asChild className="bg-gradient-hero text-primary-foreground shadow-elegant hover:opacity-95">
          <Link to="/admin/jobs/new"><Plus className="h-4 w-4 mr-1" /> Post a new job</Link>
        </Button>
      </div>

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
            <h2 className="font-semibold">Jobs posted this week</h2>
            <span className="text-xs text-muted-foreground">Last 7 days</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="gradJobs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.22 265)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.55 0.22 265)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 260)" />
                <XAxis dataKey="day" stroke="oklch(0.5 0.02 260)" />
                <YAxis stroke="oklch(0.5 0.02 260)" allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
                <Area type="monotone" dataKey="jobs" stroke="oklch(0.55 0.22 265)" strokeWidth={2.5} fill="url(#gradJobs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-semibold mb-4">Quick actions</h2>
          <div className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-between">
              <Link to="/admin/jobs/new">Post a job <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-between">
              <Link to="/admin/jobs">Manage jobs <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-between">
              <Link to="/jobs">View public page <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent jobs</h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin/jobs">View all <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
          </Button>
        </div>
        {isLoading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
        ) : list.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No jobs posted yet.</p>
        ) : (
          <div className="space-y-2">
            {list.slice(0, 5).map((j) => (
              <Link key={String(j.id)} to={`/admin/jobs/${j.id}/applicants`} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-gradient-hero grid place-items-center text-primary-foreground font-semibold text-sm shrink-0">
                    {(j.company || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{j.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{j.company} · {j.location}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
