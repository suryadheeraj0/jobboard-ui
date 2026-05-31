import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Briefcase, Calendar, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { StatusBadge } from "./Dashboard";

export default function MyApplications() {
  const { user } = useAuth();
  const { data: apps, isLoading } = useQuery({
    queryKey: ["apps", user?.userId],
    queryFn: () => api.getApplicationsByUser(user!.userId),
    enabled: !!user?.userId,
  });

  return (
    <div>
      <h1 className="font-display text-3xl md:text-4xl font-bold">My Applications</h1>
      <p className="mt-1 text-muted-foreground">Track every application in one place.</p>

      <div className="mt-8">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
          </div>
        ) : !apps || apps.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
            <Briefcase className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 font-semibold">No applications yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Browse jobs and apply in minutes.</p>
            <Button asChild className="mt-4 bg-gradient-hero text-primary-foreground">
              <Link to="/jobs">Browse jobs</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {apps.map((a, i) => (
              <motion.div
                key={String(a.id)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-elegant transition-all flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="h-12 w-12 rounded-xl bg-gradient-hero grid place-items-center text-primary-foreground font-bold shrink-0">
                    {(a.job?.company || a.company || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{a.job?.title || a.jobTitle || `Job #${a.jobId}`}</p>
                    <p className="text-sm text-muted-foreground truncate">{a.job?.company || a.company || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground sm:flex-shrink-0">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {a.appliedDate || a.createdAt ? new Date(a.appliedDate || a.createdAt!).toLocaleDateString() : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-3 sm:flex-shrink-0">
                  <StatusBadge status={a.status} />
                  {a.jobId && (
                    <Button asChild size="sm" variant="ghost">
                      <Link to={`/jobs/${a.jobId}`}>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
