import { useAuth } from "@/lib/auth";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";

export function AppHeader() {
  const { signOut } = useAuth();
  const { data: profile } = useProfile();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <Link to="/dashboard">
          <Logo size="sm" />
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">Dashboard</Button>
          </Link>
          <Link to="/learn">
            <Button variant="ghost" size="sm">Learn</Button>
          </Link>
          <Link to="/analytics">
            <Button variant="ghost" size="sm">Analytics</Button>
          </Link>
          <div className="flex items-center gap-2 pl-4 border-l border-border">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-sm font-medium hidden sm:inline">{profile?.name || "Learner"}</span>
            <Button variant="ghost" size="icon" onClick={handleSignOut} className="h-7 w-7">
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
