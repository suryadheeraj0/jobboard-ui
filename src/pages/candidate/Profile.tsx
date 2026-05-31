import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, User as UserIcon, Shield } from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl md:text-4xl font-bold">Profile</h1>
      <p className="mt-1 text-muted-foreground">Your account information.</p>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-hero grid place-items-center text-primary-foreground text-2xl font-bold shadow-elegant">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-display text-xl font-semibold">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label className="inline-flex items-center gap-1.5"><UserIcon className="h-3.5 w-3.5" /> Name</Label>
            <Input value={user?.name ?? ""} readOnly />
          </div>
          <div className="space-y-2">
            <Label className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email</Label>
            <Input value={user?.email ?? ""} readOnly />
          </div>
          <div className="space-y-2">
            <Label className="inline-flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> Role</Label>
            <Input value={user?.role ?? ""} readOnly />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <Button variant="destructive" onClick={logout}>Sign out</Button>
        </div>
      </div>
    </div>
  );
}
