import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { registerUser } from '@/lib/storage';
import { Activity, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const activityLevels = ['Sedentary', 'Light', 'Moderate', 'Very Active'] as const;
const conditions = ['None', 'Diabetes', 'Hypertension', 'Heart Disease', 'Obesity', 'Thyroid', 'Kidney Problem'] as const;
const mealPrefs = ['Vegetarian', 'Non-Vegetarian', 'Vegan'] as const;
const genders = ['Male', 'Female', 'Other'] as const;

const getStrength = (p: string): { label: string; color: string; width: string } => {
  if (p.length < 4) return { label: 'Weak', color: 'bg-neon-red', width: 'w-1/4' };
  if (p.length < 6) return { label: 'Fair', color: 'bg-neon-yellow', width: 'w-2/4' };
  if (p.length < 8) return { label: 'Good', color: 'bg-neon-cyan', width: 'w-3/4' };
  return { label: 'Strong', color: 'bg-neon-green', width: 'w-full' };
};

const Register = () => {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', age: '', gender: 'Male' as typeof genders[number],
    height: '', weight: '', activityLevel: 'Moderate' as typeof activityLevels[number],
    medicalCondition: 'None' as string, mealPreference: 'Vegetarian' as typeof mealPrefs[number],
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const strength = getStrength(form.password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.age || !form.height || !form.weight) {
      toast.error('Please fill all required fields'); return;
    }
    const ok = registerUser({
      ...form, age: parseInt(form.age), height: parseFloat(form.height), weight: parseFloat(form.weight),
    });
    if (!ok) { toast.error('Email already registered'); return; }
    toast.success('Registration successful!');
    navigate('/login');
  };

  const inputCls = "w-full bg-secondary/60 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all";
  const labelCls = "text-xs text-muted-foreground mb-1 block";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
        className="glass-card p-8 w-full max-w-lg">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center neon-border">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-primary neon-text">NutriAI</h1>
        </div>
        <p className="text-center text-muted-foreground text-sm mb-6">Create your health profile</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Full Name *</label><input className={inputCls} value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="John Doe" /></div>
            <div><label className={labelCls}>Email *</label><input className={inputCls} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="john@example.com" /></div>
          </div>
          <div>
            <label className={labelCls}>Password *</label>
            <div className="relative">
              <input className={inputCls} type={showPw ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {form.password && (
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1 flex-1 bg-secondary rounded-full overflow-hidden"><div className={`h-full ${strength.color} ${strength.width} transition-all`} /></div>
                <span className="text-xs text-muted-foreground">{strength.label}</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div><label className={labelCls}>Age *</label><input className={inputCls} type="number" value={form.age} onChange={e => set('age', e.target.value)} /></div>
            <div><label className={labelCls}>Height (cm) *</label><input className={inputCls} type="number" value={form.height} onChange={e => set('height', e.target.value)} /></div>
            <div><label className={labelCls}>Weight (kg) *</label><input className={inputCls} type="number" value={form.weight} onChange={e => set('weight', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Gender</label><select className={inputCls} value={form.gender} onChange={e => set('gender', e.target.value)}>{genders.map(g => <option key={g} value={g}>{g}</option>)}</select></div>
            <div><label className={labelCls}>Activity Level</label><select className={inputCls} value={form.activityLevel} onChange={e => set('activityLevel', e.target.value)}>{activityLevels.map(a => <option key={a} value={a}>{a}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Medical Condition</label><select className={inputCls} value={form.medicalCondition} onChange={e => set('medicalCondition', e.target.value)}>{conditions.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className={labelCls}>Meal Preference</label><select className={inputCls} value={form.mealPreference} onChange={e => set('mealPreference', e.target.value)}>{mealPrefs.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
          </div>
          <button type="submit" className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-all neon-glow">
            Create Account
          </button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-4">Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link></p>
      </motion.div>
    </div>
  );
};

export default Register;
