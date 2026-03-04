import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loginUser } from '@/lib/storage';
import { Activity, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = loginUser(email, password);
    if (!user) { setError('Invalid email or password'); toast.error('Authentication failed'); return; }
    toast.success(`Welcome back, ${user.fullName}!`);
    navigate('/dashboard');
  };

  const inputCls = "w-full bg-secondary/60 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
        className="glass-card p-8 w-full max-w-md">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center neon-border">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-primary neon-text">NutriAI</h1>
        </div>
        <p className="text-center text-muted-foreground text-sm mb-6">Sign in to your health dashboard</p>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mb-4 p-3 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive text-sm text-center"
            style={{ boxShadow: '0 0 15px hsl(0 80% 55% / 0.2)' }}>
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Email</label>
            <input className={inputCls} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Password</label>
            <div className="relative">
              <input className={inputCls} type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <button type="submit" className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-all neon-glow">
            Sign In
          </button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-4">Don't have an account? <Link to="/register" className="text-primary hover:underline">Register</Link></p>
      </motion.div>
    </div>
  );
};

export default Login;
