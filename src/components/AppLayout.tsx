import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout, getActiveProfile, getSession } from '@/lib/storage';
import { Activity, BarChart3, Heart, Leaf, LogOut, ShoppingCart, Stethoscope, Users, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { path: '/diet', label: 'Diet Plan', icon: Leaf },
  { path: '/symptoms', label: 'Symptoms', icon: Stethoscope },
  { path: '/grocery', label: 'Grocery', icon: ShoppingCart },
  { path: '/profiles', label: 'Profiles', icon: Users },
  { path: '/about', label: 'About', icon: Info },
];

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = getActiveProfile();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <span className="font-display font-bold text-primary neon-text">NutriAI</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-foreground p-2">
          <div className="space-y-1">
            <span className={cn("block w-5 h-0.5 bg-foreground transition-all", mobileOpen && "rotate-45 translate-y-1.5")} />
            <span className={cn("block w-5 h-0.5 bg-foreground transition-all", mobileOpen && "opacity-0")} />
            <span className={cn("block w-5 h-0.5 bg-foreground transition-all", mobileOpen && "-rotate-45 -translate-y-1.5")} />
          </div>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "w-full lg:w-64 lg:min-h-screen border-r border-border bg-secondary/30 backdrop-blur-xl flex-shrink-0 transition-all",
        mobileOpen ? "block" : "hidden lg:block"
      )}>
        <div className="p-6 hidden lg:block">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center neon-border">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-primary neon-text text-lg">NutriAI</h1>
              <p className="text-[10px] text-muted-foreground">Clinical Nutrition AI</p>
            </div>
          </Link>
        </div>

        {profile && (
          <div className="px-6 py-3 border-b border-border">
            <p className="text-xs text-muted-foreground">Active Profile</p>
            <p className="text-sm font-medium truncate">{profile.fullName}</p>
          </div>
        )}

        <nav className="p-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all",
                location.pathname === item.path
                  ? "bg-primary/15 text-primary neon-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 w-full transition-all">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 lg:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
