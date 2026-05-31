import { Link } from "react-router-dom";
import { Briefcase, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-hero grid place-items-center shadow-elegant">
          <Briefcase className="h-7 w-7 text-primary-foreground" />
        </div>
        <h1 className="mt-6 font-display text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-2 font-display text-2xl font-bold">Page not found</h2>
        <p className="mt-2 text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
        <div className="mt-6 flex justify-center gap-2">
          <Button asChild className="bg-gradient-hero text-primary-foreground">
            <Link to="/"><Home className="h-4 w-4 mr-1" /> Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/jobs">Browse jobs</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
