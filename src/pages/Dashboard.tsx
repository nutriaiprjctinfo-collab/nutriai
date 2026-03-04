import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getActiveProfile, getSession, updateProfile } from '@/lib/storage';
import { calculateBMI, getBMICategory, calculateObesityRisk, calculateCardioRisk, calculateMetabolicRisk, calculateDailyCalories, getMacroBreakdown, generateHealthAnalysis } from '@/lib/ai-engine';
import GlassCard from '@/components/GlassCard';
import AppLayout from '@/components/AppLayout';
import type { LucideIcon } from 'lucide-react';
import { Activity, Heart, Flame, TrendingUp, AlertTriangle, Brain, Scale } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { format } from 'date-fns';

const StatCard = ({ icon: Icon, label, value, sub, color, delay }: { icon: LucideIcon; label: string; value: string | number; sub?: string; color?: string; delay: number }) => (
  <GlassCard delay={delay} className="flex flex-col gap-2">
    <div className="flex items-center gap-2">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color || 'bg-primary/20'}`}>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
    <p className="text-2xl font-display font-bold animate-count-up">{value}</p>
    {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
  </GlassCard>
);

const RiskBar = ({ label, value, delay }: { label: string; value: number; delay: number }) => {
  const color = value < 30 ? 'bg-neon-green' : value < 60 ? 'bg-neon-yellow' : 'bg-neon-red';
  const textCls = value < 30 ? 'risk-safe' : value < 60 ? 'risk-moderate' : 'risk-high';
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }} className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={`font-display font-bold ${textCls}`}>{value}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ delay: delay + 0.2, duration: 0.8 }}
          className={`h-full ${color} rounded-full`} style={{ boxShadow: `0 0 8px currentColor` }} />
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(getActiveProfile());

  useEffect(() => {
    if (!getSession()) { navigate('/login'); return; }
    const p = getActiveProfile();
    if (!p) { navigate('/login'); return; }
    setProfile(p);
    // Update BMI history
    const bmi = calculateBMI(p.weight, p.height);
    const today = new Date().toISOString().split('T')[0];
    if (!p.bmiHistory.find(h => h.date.startsWith(today))) {
      updateProfile(p.id, { bmiHistory: [...p.bmiHistory, { date: new Date().toISOString(), bmi }] });
    }
  }, [navigate]);

  if (!profile) return null;

  const bmi = calculateBMI(profile.weight, profile.height);
  const bmiCat = getBMICategory(bmi);
  const obesityRisk = calculateObesityRisk(profile);
  const cardioRisk = calculateCardioRisk(profile);
  const metaRisk = calculateMetabolicRisk(profile);
  const calories = calculateDailyCalories(profile);
  const macros = getMacroBreakdown(profile);
  const analysis = generateHealthAnalysis(profile);

  const showAlert = obesityRisk > 50 || cardioRisk > 50;

  return (
    <AppLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="font-display text-2xl font-bold mb-1">Health Dashboard</h2>
          <p className="text-sm text-muted-foreground">AI-powered clinical nutrition monitoring for {profile.fullName}</p>
        </motion.div>

        {showAlert && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 border-destructive/40" style={{ boxShadow: '0 0 20px hsl(0 80% 55% / 0.15)' }}>
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-destructive">AI Health Alert</p>
                <p className="text-xs text-muted-foreground">Elevated risk scores detected. Review your diet plan and consider professional consultation.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Scale} label="BMI" value={bmi} sub={bmiCat} delay={0.1} />
          <StatCard icon={Flame} label="Daily Calories" value={`${calories} kcal`} sub="AI-adjusted target" delay={0.2} />
          <StatCard icon={Heart} label="Cardio Risk" value={`${cardioRisk}%`} sub={cardioRisk < 30 ? 'Low Risk' : cardioRisk < 60 ? 'Moderate' : 'High Risk'} delay={0.3} />
          <StatCard icon={Activity} label="Metabolic" value={metaRisk} sub="Risk Level" delay={0.4} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk scores */}
          <GlassCard delay={0.3}>
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Risk Analysis
            </h3>
            <div className="space-y-4">
              <RiskBar label="Obesity Risk" value={obesityRisk} delay={0.4} />
              <RiskBar label="Cardiovascular Risk" value={cardioRisk} delay={0.5} />
              <div className="flex justify-between text-sm mt-2">
                <span className="text-muted-foreground">Metabolic Risk</span>
                <span className={`font-display font-bold ${metaRisk === 'Low' ? 'risk-safe' : metaRisk === 'Medium' ? 'risk-moderate' : 'risk-high'}`}>{metaRisk}</span>
              </div>
            </div>
          </GlassCard>

          {/* Macro breakdown */}
          <GlassCard delay={0.4}>
            <h3 className="font-display font-semibold mb-4">Macronutrient Target</h3>
            <div className="space-y-3">
              {[
                { label: 'Protein', value: macros.protein, color: 'bg-neon-cyan' },
                { label: 'Carbohydrates', value: macros.carbs, color: 'bg-neon-blue' },
                { label: 'Fat', value: macros.fat, color: 'bg-neon-green' },
              ].map((m, i) => (
                <div key={m.label} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{m.label}</span>
                    <span className="font-display font-bold">{m.value}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${m.value}%` }} transition={{ delay: 0.6 + i * 0.1, duration: 0.6 }}
                      className={`h-full ${m.color} rounded-full`} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* AI Analysis */}
        <GlassCard delay={0.5}>
          <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" /> AI Health Analysis
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{analysis}</p>
        </GlassCard>

        {/* Weight history */}
        <GlassCard delay={0.6}>
          <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
            <Scale className="h-4 w-4 text-primary" /> Weight History
          </h3>
          <ChartContainer
            config={{ weight: { label: 'Weight (kg)', color: 'hsl(var(--primary))' } }}
            className="h-48 w-full"
          >
            <AreaChart data={profile.weightHistory.slice(-14).map(e => ({
              date: format(new Date(e.date), 'MMM d'),
              weight: e.weight,
            }))}>
              <defs>
                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={35} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#weightGradient)" dot={{ fill: 'hsl(var(--primary))', r: 3 }} activeDot={{ r: 5, strokeWidth: 2 }} />
            </AreaChart>
          </ChartContainer>
        </GlassCard>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
