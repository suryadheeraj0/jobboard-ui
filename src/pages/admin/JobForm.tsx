import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, type Job } from "@/lib/api";

const JOB_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE"];

interface Props { initial?: Partial<Job>; id?: string | number; }

export default function JobForm({ initial, id }: Props) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    company: initial?.company ?? "",
    location: initial?.location ?? "",
    salary: initial?.salary ? String(initial.salary) : "",
    jobType: initial?.jobType ?? "FULL_TIME",
    description: initial?.description ?? "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const body = { ...form };
      return id ? api.updateJob(id, body) : api.createJob(body);
    },
    onSuccess: () => {
      toast.success(id ? "Job updated successfully" : "Job posted successfully");
      navigate("/admin/jobs");
    },
    onError: (e: any) => toast.error(e.message || "Could not save job"),
  });

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl md:text-4xl font-bold">{id ? "Edit Job" : "Create a Job"}</h1>
      <p className="mt-1 text-muted-foreground">{id ? "Update the role details below." : "Fill in the details to publish a new role."}</p>

      <form
        onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
        className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft space-y-5"
      >
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Job title</Label>
            <Input id="title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Senior Frontend Engineer" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Acme Inc." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Remote, NYC, ..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salary">Salary</Label>
            <Input id="salary" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="$120k – $160k" />
          </div>
          <div className="space-y-2">
            <Label>Job type</Label>
            <Select value={form.jobType} onValueChange={(v) => setForm({ ...form, jobType: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {JOB_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={8} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the role, responsibilities, and what makes it special..." className="resize-none" />
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={mutation.isPending} className="bg-gradient-hero text-primary-foreground hover:opacity-95 shadow-elegant">
            {mutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : (id ? "Save changes" : "Publish job")}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/jobs")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
