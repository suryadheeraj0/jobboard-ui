import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, MapPin, Briefcase, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import { api } from "@/lib/api";

const JOB_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE"];

export default function Jobs() {
  const [filters, setFilters] = useState({ title: "", location: "", jobType: "" });
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ["jobs"],
    queryFn: api.getJobs,
  });

  const filtered = useMemo(() => {
    if (!jobs) return [];
    return jobs.filter((j) => {
      if (filters.title && !j.title?.toLowerCase().includes(filters.title.toLowerCase())
        && !j.company?.toLowerCase().includes(filters.title.toLowerCase())) return false;
      if (filters.location && !j.location?.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.jobType && j.jobType !== filters.jobType) return false;
      return true;
    });
  }, [jobs, filters]);

  const clearFilters = () => setFilters({ title: "", location: "", jobType: "" });
  const hasFilters = filters.title || filters.location || filters.jobType;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="relative pt-16 pb-12 bg-gradient-subtle border-b border-border">
        <div className="absolute inset-0 bg-gradient-glow opacity-30 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold">Find your next role</h1>
          <p className="mt-2 text-muted-foreground max-w-xl">Browse {jobs?.length ?? "—"} curated opportunities from top companies.</p>
          <div className="mt-6 max-w-2xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, company..."
              className="pl-11 h-12 text-base bg-card"
              value={filters.title}
              onChange={(e) => setFilters({ ...filters, title: e.target.value })}
            />
          </div>
        </div>
      </section>

      <section className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          {/* Filters */}
          <div className="lg:block">
            <Button
              variant="outline"
              className="lg:hidden mb-4 w-full"
              onClick={() => setFiltersOpen((v) => !v)}
            >
              <Filter className="h-4 w-4 mr-2" /> {filtersOpen ? "Hide" : "Show"} filters
            </Button>
            <div className={`${filtersOpen ? "block" : "hidden"} lg:block sticky top-20`}>
              <div className="rounded-2xl bg-card border border-border p-5 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Filters</h3>
                  {hasFilters && (
                    <button onClick={clearFilters} className="text-xs text-primary hover:underline">Clear</button>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Title or company</Label>
                    <Input placeholder="e.g. Engineer" value={filters.title} onChange={(e) => setFilters({ ...filters, title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input className="pl-8" placeholder="City or remote" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Job type</Label>
                    <Select value={filters.jobType || "all"} onValueChange={(v) => setFilters({ ...filters, jobType: v === "all" ? "" : v })}>
                      <SelectTrigger>
                        <Briefcase className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any type</SelectItem>
                        {JOB_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {isLoading ? "Loading..." : `${filtered.length} ${filtered.length === 1 ? "role" : "roles"} found`}
              </p>
              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-3 w-3 mr-1" /> Clear filters
                </Button>
              )}
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card p-6 space-y-3">
                    <div className="flex gap-3">
                      <Skeleton className="h-12 w-12 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-3 w-1/3" />
                      </div>
                    </div>
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-9 flex-1" />
                      <Skeleton className="h-9 flex-1" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <EmptyState title="Could not load jobs" desc="There was a problem reaching the server. Please try again." />
            ) : filtered.length === 0 ? (
              <EmptyState title="No jobs match your filters" desc="Try broadening your search or clearing filters." action={hasFilters ? <Button onClick={clearFilters}>Clear filters</Button> : null} />
            ) : (
              <motion.div layout className="grid md:grid-cols-2 gap-5">
                {filtered.map((job, i) => (
                  <JobCard key={String(job.id)} job={job} index={i} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function EmptyState({ title, desc, action }: { title: string; desc: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
      <div className="mx-auto h-12 w-12 rounded-xl bg-muted grid place-items-center">
        <Search className="h-5 w-5 text-muted-foreground" />
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">{desc}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
