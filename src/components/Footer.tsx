import { Link } from "react-router-dom";
import { Briefcase, Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-gradient-subtle">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-hero grid place-items-center shadow-elegant">
                <Briefcase className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg">TalentBridge</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              The fastest way to find your next career opportunity. Built for ambitious people.
            </p>
            <div className="mt-4 flex gap-3">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="h-9 w-9 rounded-lg border border-border grid place-items-center hover:bg-muted transition-colors">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/jobs" className="hover:text-foreground">Browse Jobs</Link></li>
              <li><Link to="/register" className="hover:text-foreground">Sign Up</Link></li>
              <li><Link to="/login" className="hover:text-foreground">Sign In</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">About</a></li>
              <li><a href="#" className="hover:text-foreground">Careers</a></li>
              <li><a href="#" className="hover:text-foreground">Privacy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} TalentBridge. All rights reserved.</p>
          <p>Crafted with care for the next generation of work.</p>
        </div>
      </div>
    </footer>
  );
}
