import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Users, MapPin, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { api } from "@/lib/api";

export default function ManageJobs() {
  const qc = useQueryClient();
  const { data: jobs, isLoading } = useQuery({ queryKey: ["jobs"], queryFn: api.getJobs });

  const del = useMutation({
    mutationFn: (id: string | number) => api.deleteJob(id),
    onSuccess: () => {
      toast.success("Job deleted");
      qc.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (e: any) => toast.error(e.message || "Could not delete job"),
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">Manage Jobs</h1>
          <p className="mt-1 text-muted-foreground">{jobs?.length ?? 0} active listings.</p>
        </div>
        <Button asChild className="bg-gradient-hero text-primary-foreground shadow-elegant hover:opacity-95">
          <Link to="/admin/jobs/new"><Plus className="h-4 w-4 mr-1" /> New job</Link>
        </Button>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-44 w-full rounded-2xl" />)}
          </div>
        ) : !jobs || jobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
            <Briefcase className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 font-semibold">No jobs yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Post your first role to start hiring.</p>
            <Button asChild className="mt-4 bg-gradient-hero text-primary-foreground">
              <Link to="/admin/jobs/new">Post a job</Link>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {jobs.map((j, i) => (
              <motion.div
                key={String(j.id)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-elegant transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-hero grid place-items-center text-primary-foreground font-bold shrink-0">
                    {(j.company || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{j.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">{j.company}</p>
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{j.location}</span>
                      {j.jobType && <Badge variant="secondary" className="text-xs">{j.jobType}</Badge>}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="outline" className="flex-1">
                    <Link to={`/admin/jobs/${j.id}/applicants`}><Users className="h-3.5 w-3.5 mr-1" /> Applicants</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/admin/jobs/${j.id}/edit`}><Pencil className="h-3.5 w-3.5" /></Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this job?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently remove "{j.title}" and stop accepting applications.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => del.mutate(j.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
