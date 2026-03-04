import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, getUsers, getActiveProfile, switchProfile, addPatientProfile } from '@/lib/storage';
import type { UserProfile } from '@/lib/storage';
import AppLayout from '@/components/AppLayout';
import GlassCard from '@/components/GlassCard';
import { motion } from 'framer-motion';
import { Users, Plus, Check } from 'lucide-react';
import { toast } from 'sonner';

const Profiles = () => {
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);
  const [, setTick] = useState(0);
  const refresh = () => setTick(t => t + 1);

  useEffect(() => { if (!getSession()) navigate('/login'); }, [navigate]);

  const session = getSession();
  const activeProfile = getActiveProfile();
  const allUsers = getUsers();
  // Show current user + patient profiles
  const profiles = allUsers.filter(u => u.id === session?.userId || u.email.startsWith(`patient_${session?.userId}`));

  const [form, setForm] = useState({
    fullName: '',
    age: '',
    gender: 'Male' as UserProfile['gender'],
    height: '',
    weight: '',
    activityLevel: 'Moderate' as UserProfile['activityLevel'],
    medicalCondition: 'None',
    mealPreference: 'Vegetarian' as UserProfile['mealPreference'],
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.age || !form.height || !form.weight) { toast.error('Fill required fields'); return; }
    addPatientProfile({ ...form, age: parseInt(form.age), height: parseFloat(form.height), weight: parseFloat(form.weight) });
    toast.success('Patient profile added');
    setShowAdd(false);
    refresh();
  };

  const handleSwitch = (id: string) => { switchProfile(id); toast.success('Profile switched'); refresh(); };

  const inputCls = "w-full bg-secondary/60 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-all";

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold mb-1 flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Patient Profiles</h2>
            <p className="text-sm text-muted-foreground">Manage multiple patient profiles</p>
          </div>
          <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all neon-glow">
            <Plus className="h-4 w-4" /> Add Patient
          </button>
        </div>

        {showAdd && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard hover={false}>
              <form onSubmit={handleAdd} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <input className={inputCls} placeholder="Full Name *" value={form.fullName} onChange={e => set('fullName', e.target.value)} />
                <input className={inputCls} placeholder="Age *" type="number" value={form.age} onChange={e => set('age', e.target.value)} />
                <select className={inputCls} value={form.gender} onChange={e => set('gender', e.target.value)}><option>Male</option><option>Female</option><option>Other</option></select>
                <input className={inputCls} placeholder="Height (cm) *" type="number" value={form.height} onChange={e => set('height', e.target.value)} />
                <input className={inputCls} placeholder="Weight (kg) *" type="number" value={form.weight} onChange={e => set('weight', e.target.value)} />
                <select className={inputCls} value={form.activityLevel} onChange={e => set('activityLevel', e.target.value)}><option>Sedentary</option><option>Light</option><option>Moderate</option><option>Very Active</option></select>
                <select className={inputCls} value={form.medicalCondition} onChange={e => set('medicalCondition', e.target.value)}><option>None</option><option>Diabetes</option><option>Hypertension</option><option>Heart Disease</option><option>Obesity</option><option>Thyroid</option><option>Kidney Problem</option></select>
                <select className={inputCls} value={form.mealPreference} onChange={e => set('mealPreference', e.target.value)}><option>Vegetarian</option><option>Non-Vegetarian</option><option>Vegan</option></select>
                <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 neon-glow">Save</button>
              </form>
            </GlassCard>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profiles.map((p, i) => (
            <GlassCard key={p.id} delay={0.1 + i * 0.05} className={activeProfile?.id === p.id ? 'neon-border' : ''}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold">{p.fullName}</h3>
                  <p className="text-xs text-muted-foreground">{p.age}y • {p.gender} • {p.weight}kg • {p.height}cm</p>
                  <p className="text-xs text-muted-foreground">{p.medicalCondition} • {p.mealPreference} • {p.activityLevel}</p>
                </div>
                {activeProfile?.id === p.id ? (
                  <span className="flex items-center gap-1 text-xs text-primary"><Check className="h-3 w-3" /> Active</span>
                ) : (
                  <button onClick={() => handleSwitch(p.id)} className="text-xs px-3 py-1.5 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-all">Switch</button>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Profiles;
