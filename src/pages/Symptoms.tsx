import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession } from '@/lib/storage';
import { analyzeSymptoms, SymptomResult } from '@/lib/ai-engine';
import AppLayout from '@/components/AppLayout';
import GlassCard from '@/components/GlassCard';
import { motion } from 'framer-motion';
import { Stethoscope, AlertTriangle, CheckCircle } from 'lucide-react';

const symptomList = ['Fatigue', 'Hair Fall', 'Weakness', 'Pale Skin', 'Bone Pain', 'Muscle Cramps'];

const Symptoms = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);
  const [results, setResults] = useState<SymptomResult[]>([]);

  useEffect(() => { if (!getSession()) navigate('/login'); }, [navigate]);

  const toggle = (s: string) => {
    setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
    setResults([]);
  };

  const analyze = () => { setResults(analyzeSymptoms(selected)); };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h2 className="font-display text-2xl font-bold mb-1 flex items-center gap-2"><Stethoscope className="h-5 w-5 text-primary" /> AI Symptom Analysis</h2>
          <p className="text-sm text-muted-foreground">Select your symptoms for AI-powered nutrient deficiency prediction</p>
        </div>

        <GlassCard delay={0.1}>
          <h3 className="font-display font-semibold mb-4">Select Symptoms</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {symptomList.map(s => (
              <button key={s} onClick={() => toggle(s)}
                className={`p-3 rounded-lg border text-sm text-left transition-all ${selected.includes(s) ? 'border-primary bg-primary/10 text-foreground neon-border' : 'border-border bg-secondary/30 text-muted-foreground hover:border-primary/30'}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${selected.includes(s) ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                    {selected.includes(s) && <CheckCircle className="h-3 w-3 text-primary-foreground" />}
                  </div>
                  {s}
                </div>
              </button>
            ))}
          </div>
          <button onClick={analyze} disabled={selected.length === 0}
            className="mt-4 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-all neon-glow disabled:opacity-40 disabled:cursor-not-allowed">
            Analyze Symptoms
          </button>
        </GlassCard>

        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <GlassCard className={r.severity === 'Severe' ? 'border-destructive/40' : ''} hover={false}>
                  <div className="flex items-start gap-3">
                    {r.severity === 'Severe' ? <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" /> : <Stethoscope className="h-5 w-5 text-primary mt-0.5" />}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-display font-semibold text-sm">{r.deficiency}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${r.severity === 'Severe' ? 'bg-destructive/20 text-destructive' : r.severity === 'Moderate' ? 'bg-neon-yellow/20 text-neon-yellow' : 'bg-neon-green/20 text-neon-green'}`}>
                          {r.severity}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{r.message}</p>
                      <div className="flex flex-wrap gap-2">
                        {r.foods.map((f, j) => (
                          <span key={j} className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground">{f}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Symptoms;
