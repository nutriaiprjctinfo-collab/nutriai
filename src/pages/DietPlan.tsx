import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveProfile, getSession } from '@/lib/storage';
import { generateMealPlan, getMacroBreakdown, calculateDailyCalories } from '@/lib/ai-engine';
import AppLayout from '@/components/AppLayout';
import GlassCard from '@/components/GlassCard';
import type { LucideIcon } from 'lucide-react';
import { Leaf, Coffee, Sun, Moon, Cookie } from 'lucide-react';

const mealIcons: Record<string, LucideIcon> = { breakfast: Coffee, lunch: Sun, dinner: Moon, snacks: Cookie };
const mealLabels: Record<string, string> = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snacks: 'Snacks' };

const DietPlan = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(getActiveProfile());

  useEffect(() => {
    if (!getSession()) { navigate('/login'); return; }
    setProfile(getActiveProfile());
  }, [navigate]);

  if (!profile) return null;

  const plan = generateMealPlan(profile);
  const macros = getMacroBreakdown(profile);
  const calories = calculateDailyCalories(profile);

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h2 className="font-display text-2xl font-bold mb-1 flex items-center gap-2"><Leaf className="h-5 w-5 text-primary" /> AI Diet Plan</h2>
          <p className="text-sm text-muted-foreground">Personalized for {profile.fullName} • {profile.mealPreference} • {profile.medicalCondition !== 'None' ? profile.medicalCondition + ' adjusted' : 'No medical conditions'}</p>
        </div>

        <GlassCard delay={0.1}>
          <div className="flex flex-wrap gap-6 text-center">
            <div><p className="text-2xl font-display font-bold text-primary neon-text">{calories}</p><p className="text-xs text-muted-foreground">Total Calories</p></div>
            <div><p className="text-2xl font-display font-bold">{macros.protein}%</p><p className="text-xs text-muted-foreground">Protein</p></div>
            <div><p className="text-2xl font-display font-bold">{macros.carbs}%</p><p className="text-xs text-muted-foreground">Carbs</p></div>
            <div><p className="text-2xl font-display font-bold">{macros.fat}%</p><p className="text-xs text-muted-foreground">Fat</p></div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['breakfast', 'lunch', 'dinner', 'snacks'] as const).map((meal, i) => {
            const Icon = mealIcons[meal];
            return (
              <GlassCard key={meal} delay={0.2 + i * 0.1}>
                <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" /> {mealLabels[meal]}
                </h3>
                <ul className="space-y-2">
                  {plan[meal].map((item, j) => (
                    <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default DietPlan;
