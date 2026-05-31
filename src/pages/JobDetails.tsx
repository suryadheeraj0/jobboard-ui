import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MapPin, Briefcase, DollarSign, ArrowLeft, Building2, Share2, Clock, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function JobDetails() {
  const { id } = useParams();
  const { data: job, isLoading, error } = useQuery({
    queryKey: ["job", id],
    queryFn: () => api.getJob(id!),
    enabled: !!id,
  });

  const onShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 w-full">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link to="/jobs"><ArrowLeft className="h-4 w-4 mr-1" /> Back to jobs</Link>
        </Button>

        {isLoading ? (
          <div className="grid lg:grid-cols-[1fr_360px] gap-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-64 w-full mt-6" />
            </div>
            <Skeleton className="h-72 w-full" />
          </div>
        ) : error || !job ? (
          <div className="text-center py-20">
            <h2 className="font-display text-2xl font-bold">Job not found</h2>
            <p className="text-muted-foreground mt-2">This role may have been removed.</p>
            <Button asChild className="mt-4"><Link to="/jobs">Browse other roles</Link></Button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-[1fr_360px] gap-8">
            <div>
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-hero grid place-items-center text-primary-foreground font-bold text-2xl shrink-0">
                  {(job.company || "?").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">{job.title}</h1>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" />{job.company}</span>
                    <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                    {job.jobType && <span className="inline-flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" />{job.jobType}</span>}
                  </div>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {(job.location || "").toLowerCase().includes("remote") && <Badge variant="secondary">Remote</Badge>}
                    {job.jobType && <Badge variant="outline">{job.jobType}</Badge>}
                  </div>
                </div>
              </div>

              <Section title="About the role">
                <p className="whitespace-pre-line">{job.description || "No description provided."}</p>
              </Section>

              {job.requirements && (
                <Section title="Requirements">
                  <p className="whitespace-pre-line">{job.requirements}</p>
                </Section>
              )}

              {job.benefits && (
                <Section title="Benefits">
                  <p className="whitespace-pre-line">{job.benefits}</p>
                </Section>
              )}

              {!job.requirements && !job.benefits && (
                <Section title="What we offer">
                  <ul className="space-y-2">
                    {["Competitive compensation", "Flexible working arrangements", "Health and wellness benefits", "Career growth opportunities"].map((b) => (
                      <li key={b} className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> {b}</li>
                    ))}
                  </ul>
                </Section>
              )}
            </div>

            <aside className="lg:sticky lg:top-20 h-fit">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-elegant">
                <div className="space-y-4">
                  {job.salary && (
                    <div>
                      <p className="text-xs text-muted-foreground">Salary</p>
                      <p className="font-display text-2xl font-bold inline-flex items-center"><DollarSign className="h-5 w-5" />{job.salary}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-medium truncate">{job.location || "—"}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">Type</p>
                      <p className="font-medium truncate">{job.jobType || "—"}</p>
                    </div>
                  </div>
                </div>
                <Button asChild size="lg" className="w-full mt-6 bg-gradient-hero text-primary-foreground hover:opacity-95 shadow-elegant">
                  <Link to={`/jobs/${job.id}/apply`}>Apply Now</Link>
                </Button>
                <Button variant="outline" className="w-full mt-2" onClick={onShare}>
                  <Share2 className="h-4 w-4 mr-2" /> Share role
                </Button>
                <p className="mt-4 text-xs text-muted-foreground inline-flex items-center gap-1.5">
                  <Clock className="h-3 w-3" /> Usually responds within a week
                </p>
              </div>
            </aside>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-bold mb-3">{title}</h2>
      <div className="text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}
