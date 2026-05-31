import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Mail, Check, X, Download, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { StatusBadge } from "../candidate/Dashboard";

export default function Applicants() {
  const { id } = useParams();
  const qc = useQueryClient();
  const { data: job } = useQuery({ queryKey: ["job", id], queryFn: () => api.getJob(id!), enabled: !!id });
  const { data: apps, isLoading } = useQuery({
    queryKey: ["apps-job", id],
    queryFn: () => api.getApplicationsByJob(id!),
    enabled: !!id,
  });

  const updateStatus = useMutation({
    mutationFn: ({ appId, status }: { appId: string | number; status: "SHORTLISTED" | "REJECTED" }) =>
      api.updateApplicationStatus(appId, { status, coverLetter: "" }),
    onSuccess: () => {
      toast.success("Application updated");
      qc.invalidateQueries({ queryKey: ["apps-job", id] });
    },
    onError: (e: any) => toast.error(e.message || "Could not update"),
  });

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link to="/admin/jobs"><ArrowLeft className="h-4 w-4 mr-1" /> Back to jobs</Link>
      </Button>

      <div>
        <h1 className="font-display text-3xl md:text-4xl font-bold">Applicants</h1>
        {job && <p className="mt-1 text-muted-foreground">{job.title} · {job.company}</p>}
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}</div>
        ) : !apps || apps.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
            <Users className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 font-semibold">No applicants yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Applications will appear here as they come in.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {apps.map((a, i) => (
              <motion.div
                key={String(a.id)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-elegant transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-12 w-12 rounded-full bg-gradient-hero grid place-items-center text-primary-foreground font-bold shrink-0">
                      {(a.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{a.name || `Candidate #${a.userId}`}</p>
                      {a.email && (
                        <a href={`mailto:${a.email}`} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {a.email}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge status={a.status} />
                    <Button asChild size="sm" variant="outline">
                      <a href={api.resumeUrl(a.id)} target="_blank" rel="noreferrer">
                        <FileText className="h-3.5 w-3.5 mr-1" /> Resume
                      </a>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <a href={api.resumeUrl(a.id)} download>
                        <Download className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus.mutate({ appId: a.id, status: "SHORTLISTED" })}
                      disabled={updateStatus.isPending || a.status === "SHORTLISTED"}
                      className="text-success hover:text-success"
                    >
                      <Check className="h-3.5 w-3.5 mr-1" /> Shortlist
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus.mutate({ appId: a.id, status: "REJECTED" })}
                      disabled={updateStatus.isPending || a.status === "REJECTED"}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-3.5 w-3.5 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
                {a.coverLetter && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">Cover letter</p>
                    <p className="text-sm whitespace-pre-line line-clamp-4">{a.coverLetter}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
