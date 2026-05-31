import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Briefcase, DollarSign, ArrowRight, Sparkles, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Job } from "@/lib/api";

function isNew(job: Job) {
  const d = job.createdAt || job.postedDate;
  if (!d) return false;
  return Date.now() - new Date(d).getTime() < 7 * 24 * 60 * 60 * 1000;
}

export default function JobCard({ job, index = 0 }: { job: Job; index?: number }) {
  const remote = (job.location || "").toLowerCase().includes("remote");
  const urgent = (job.title || "").toLowerCase().includes("urgent") || (job.description || "").toLowerCase().includes("urgent");
  const fresh = isNew(job);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
    >
      <div className="group relative rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-12 w-12 rounded-xl bg-gradient-hero grid place-items-center text-primary-foreground font-bold shrink-0">
              {(job.company || "?").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              <p className="text-sm text-muted-foreground truncate">{job.company}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 justify-end">
            {fresh && <Badge className="bg-success text-success-foreground"><Sparkles className="h-3 w-3 mr-1" />New</Badge>}
            {remote && <Badge variant="secondary">Remote</Badge>}
            {urgent && <Badge className="bg-warning text-warning-foreground"><Zap className="h-3 w-3 mr-1" />Urgent</Badge>}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{job.location || "—"}</span>
          {job.jobType && <span className="inline-flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" />{job.jobType}</span>}
          {job.salary && <span className="inline-flex items-center gap-1.5 text-foreground font-medium"><DollarSign className="h-3.5 w-3.5" />{job.salary}</span>}
        </div>

        {job.description && (
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{job.description}</p>
        )}

        <div className="mt-5 flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link to={`/jobs/${job.id}`}>View Details</Link>
          </Button>
          <Button asChild size="sm" className="flex-1 bg-gradient-hero text-primary-foreground hover:opacity-95">
            <Link to={`/jobs/${job.id}/apply`}>
              Apply Now <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
