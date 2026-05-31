import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Search, Building2, Briefcase, Users, Star, Shield, Rocket, Sparkles,
  Code, Palette, BarChart3, Megaphone, HeadphonesIcon, Stethoscope, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AnimatedCounter } from "@/components/AnimatedCounter";

const stats = [
  { value: 12480, label: "Jobs Available", suffix: "+" },
  { value: 2100, label: "Companies Hiring", suffix: "+" },
  { value: 184000, label: "Applications Submitted", suffix: "+" },
];

const featuredJobs = [
  { title: "Senior Frontend Engineer", company: "Linear", location: "Remote", salary: "$160k", type: "FULL_TIME", tag: "Hot" },
  { title: "Product Designer", company: "Stripe", location: "San Francisco", salary: "$140k", type: "FULL_TIME", tag: "New" },
  { title: "Staff ML Engineer", company: "OpenAI", location: "Remote", salary: "$220k", type: "FULL_TIME", tag: "Urgent" },
];

const categories = [
  { icon: Code, name: "Engineering", count: "3,240 jobs" },
  { icon: Palette, name: "Design", count: "1,180 jobs" },
  { icon: BarChart3, name: "Data & Analytics", count: "920 jobs" },
  { icon: Megaphone, name: "Marketing", count: "1,540 jobs" },
  { icon: HeadphonesIcon, name: "Customer Success", count: "780 jobs" },
  { icon: Stethoscope, name: "Healthcare", count: "640 jobs" },
];

const testimonials = [
  { name: "Priya Sharma", role: "Software Engineer @ Vercel", quote: "Landed my dream remote role in under 3 weeks. The job quality on TalentBridge is on another level.", avatar: "P" },
  { name: "Marcus Chen", role: "Product Designer @ Notion", quote: "Clean UX, smart matching. Felt like the product team actually understood what job seekers go through.", avatar: "M" },
  { name: "Aisha Bello", role: "Data Scientist @ Stripe", quote: "Best job search experience I've had. Period. Applied to 5 roles, got 3 interviews.", avatar: "A" },
];

const why = [
  { icon: Rocket, title: "Apply in Minutes", desc: "One-click apply with a saved profile. No more retyping the same info." },
  { icon: Shield, title: "Verified Companies", desc: "Every company is vetted. No spam, no ghost listings, no recruiter farms." },
  { icon: Sparkles, title: "Smart Matching", desc: "We surface roles that actually fit your skills, location, and salary expectations." },
  { icon: Users, title: "Real Humans", desc: "Talk to real hiring teams, not chatbots. Get faster, more honest responses." },
];

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden pt-20 pb-28">
        <div className="absolute inset-0 bg-gradient-glow opacity-70 pointer-events-none" />
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-blob" />
        <div className="absolute top-20 -right-20 h-80 w-80 rounded-full bg-primary-glow/30 blur-3xl animate-blob" style={{ animationDelay: "4s" }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge variant="secondary" className="mb-6 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full">
              <Sparkles className="h-3.5 w-3.5" /> 12,000+ new jobs this month
            </Badge>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              Find Your{" "}
              <span className="text-gradient">Dream Career</span>
              <br /> Faster
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover opportunities from leading companies and apply in minutes. Built for ambitious people who don't have time for clunky job boards.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="bg-gradient-hero text-primary-foreground shadow-elegant hover:opacity-95 px-7">
                <Link to="/jobs">Browse Jobs <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-7">
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {["P", "M", "A", "K"].map((c) => (
                  <div key={c} className="h-7 w-7 rounded-full bg-gradient-hero grid place-items-center text-xs text-primary-foreground border-2 border-background">
                    {c}
                  </div>
                ))}
              </div>
              <span>Joined by 50,000+ professionals</span>
            </div>
          </motion.div>

          {/* Floating UI cards */}
          <div className="relative mt-16 max-w-5xl mx-auto h-72 hidden md:block">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute left-0 top-4 w-72 rounded-2xl glass p-5 shadow-elegant animate-float"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-hero grid place-items-center">
                  <Briefcase className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold">New match!</p>
                  <p className="text-xs text-muted-foreground">Senior Engineer @ Stripe</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Badge variant="secondary">Remote</Badge>
                <Badge className="bg-success text-success-foreground">$180k</Badge>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute right-0 top-0 w-80 rounded-2xl glass p-5 shadow-elegant animate-float"
              style={{ animationDelay: "1.5s" }}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Application status</p>
                <Badge className="bg-success text-success-foreground">Shortlisted</Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Product Designer @ Linear</p>
              <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-hero rounded-full" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="absolute left-1/2 -translate-x-1/2 top-20 w-96 rounded-2xl glass p-5 shadow-elegant animate-float"
              style={{ animationDelay: "0.7s" }}
            >
              <div className="flex items-center gap-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Searching "frontend engineer remote"...</p>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {["240 roles", "92 companies", "$120k avg"].map((m) => (
                  <div key={m} className="rounded-lg bg-muted/50 py-2 text-xs font-medium">{m}</div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 border-y border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-5xl md:text-6xl font-bold text-gradient">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-2 text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED JOBS */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Featured Opportunities</h2>
              <p className="mt-2 text-muted-foreground">Handpicked roles from the world's most ambitious companies.</p>
            </div>
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link to="/jobs">View all <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredJobs.map((j, i) => (
              <motion.div
                key={j.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-xl bg-gradient-hero grid place-items-center text-primary-foreground font-bold">
                    {j.company.charAt(0)}
                  </div>
                  <Badge variant={j.tag === "Urgent" ? "destructive" : "secondary"}>{j.tag}</Badge>
                </div>
                <h3 className="mt-4 font-semibold text-lg">{j.title}</h3>
                <p className="text-sm text-muted-foreground">{j.company} · {j.location}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="font-semibold">{j.salary}</span>
                  <span className="text-muted-foreground">{j.type}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-24 bg-gradient-subtle">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold">Explore by Category</h2>
            <p className="mt-2 text-muted-foreground">Find roles in the field you love.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <Link
                  to="/jobs"
                  className="block rounded-2xl bg-card border border-border p-5 text-center hover:shadow-elegant hover:-translate-y-1 transition-all"
                >
                  <div className="h-12 w-12 rounded-xl bg-accent mx-auto grid place-items-center">
                    <c.icon className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <p className="mt-3 font-semibold text-sm">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.count}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold">Loved by professionals</h2>
            <p className="mt-2 text-muted-foreground">Real people. Real careers. Real momentum.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, k) => <Star key={k} className="h-4 w-4 fill-warning text-warning" />)}
                </div>
                <p className="text-sm leading-relaxed">"{t.quote}"</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-hero grid place-items-center text-primary-foreground font-semibold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-24 bg-gradient-subtle">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold">Why choose TalentBridge</h2>
            <p className="mt-2 text-muted-foreground">A job search experience that respects your time.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {why.map((w) => (
              <div key={w.title} className="rounded-2xl bg-card border border-border p-6 shadow-soft">
                <div className="h-11 w-11 rounded-xl bg-gradient-hero grid place-items-center">
                  <w.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="mt-4 font-semibold">{w.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-12 md:p-16 text-center shadow-elegant">
            <div className="absolute inset-0 bg-gradient-glow opacity-50" />
            <div className="relative">
              <Building2 className="h-10 w-10 mx-auto text-primary-foreground/80" />
              <h2 className="mt-4 font-display text-3xl md:text-5xl font-bold text-primary-foreground">
                Ready to find your next role?
              </h2>
              <p className="mt-3 text-primary-foreground/85 max-w-xl mx-auto">
                Join 50,000+ professionals who've accelerated their careers with TalentBridge.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg" variant="secondary" className="px-7">
                  <Link to="/register">Create free account</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="px-7 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                  <Link to="/jobs">Browse Jobs</Link>
                </Button>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-primary-foreground/80">
                {["Free forever", "No credit card", "Cancel anytime"].map((p) => (
                  <span key={p} className="inline-flex items-center gap-1.5"><Check className="h-4 w-4" />{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
