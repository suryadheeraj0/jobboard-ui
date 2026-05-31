import { useState, useRef, type DragEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Upload, FileText, X, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function Apply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { data: job } = useQuery({
    queryKey: ["job", id],
    queryFn: () => api.getJob(id!),
    enabled: !!id,
  });

  const handleFile = (f: File) => {
    if (f.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10MB");
      return;
    }
    setFile(f);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!file) {
      toast.error("Please upload your resume");
      return;
    }
    if (!coverLetter.trim()) {
      toast.error("Please write a short cover letter");
      return;
    }
    if (!user) return;

    setSubmitting(true);
    setProgress(0);

    // Simulated upload progress
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 18, 92));
    }, 220);

    try {
      const fd = new FormData();
      fd.append("jobId", String(id));
      fd.append("userId", user.userId);
      fd.append("coverLetter", coverLetter);
      fd.append("resume", file);
      await api.apply(fd);
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setSuccess(true);
        toast.success("Application submitted successfully!");
      }, 350);
    } catch (err: any) {
      clearInterval(interval);
      setProgress(0);
      toast.error(err.message || "Could not submit application");
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 grid place-items-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="text-center max-w-md"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring" }}
              className="mx-auto h-20 w-20 rounded-full bg-success/10 grid place-items-center"
            >
              <CheckCircle2 className="h-10 w-10 text-success" />
            </motion.div>
            <h1 className="mt-6 font-display text-3xl font-bold">Application Submitted!</h1>
            <p className="mt-2 text-muted-foreground">
              Your application for <span className="font-medium text-foreground">{job?.title}</span> at <span className="font-medium text-foreground">{job?.company}</span> is in. We'll let you know as soon as the team responds.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-gradient-hero text-primary-foreground">
                <Link to="/dashboard/applications">View my applications</Link>
              </Button>
              <Button asChild variant="outline" onClick={() => navigate("/jobs")}>
                <Link to="/jobs">Browse more jobs</Link>
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 w-full">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to={`/jobs/${id}`}><ArrowLeft className="h-4 w-4 mr-1" /> Back to job</Link>
        </Button>
        <div className="rounded-2xl border border-border bg-card p-8 shadow-soft">
          <h1 className="font-display text-3xl font-bold">Apply for this role</h1>
          {job && (
            <p className="mt-1 text-muted-foreground">{job.title} · <span className="text-foreground font-medium">{job.company}</span></p>
          )}

          <form onSubmit={onSubmit} className="mt-8 space-y-6">
            <div className="space-y-2">
              <Label>Resume</Label>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className={`relative rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
                  dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
                }`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                />
                <AnimatePresence mode="wait">
                  {file ? (
                    <motion.div
                      key="file"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-between gap-3 text-left"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 grid place-items-center shrink-0">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                        className="h-8 w-8 rounded-lg hover:bg-muted grid place-items-center"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="mx-auto h-12 w-12 rounded-xl bg-muted grid place-items-center">
                        <Upload className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="mt-3 font-medium text-sm">Drop your resume here or click to browse</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX up to 10MB</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {submitting && progress > 0 && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Uploading...</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover">Cover letter</Label>
              <Textarea
                id="cover"
                rows={7}
                placeholder="Tell the hiring team why you're a great fit for this role..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">{coverLetter.length} characters</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="submit" disabled={submitting} className="flex-1 bg-gradient-hero text-primary-foreground hover:opacity-95 shadow-elegant">
                {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit Application"}
              </Button>
              <Button asChild type="button" variant="outline" className="sm:w-auto">
                <Link to={`/jobs/${id}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
