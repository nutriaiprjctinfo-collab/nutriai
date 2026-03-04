import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveProfile, getSession } from '@/lib/storage';
import { generateGroceryList, GroceryItem } from '@/lib/ai-engine';
import AppLayout from '@/components/AppLayout';
import GlassCard from '@/components/GlassCard';
import { ShoppingCart, Check } from 'lucide-react';

const Grocery = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(getActiveProfile());
  const [checked, setChecked] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!getSession()) { navigate('/login'); return; }
    setProfile(getActiveProfile());
  }, [navigate]);

  if (!profile) return null;
  const items = generateGroceryList(profile);
  const categories = [...new Set(items.map(i => i.category))];

  const toggle = (name: string) => {
    setChecked(prev => {
      const n = new Set(prev);
      if (n.has(name)) {
        n.delete(name);
      } else {
        n.add(name);
      }
      return n;
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h2 className="font-display text-2xl font-bold mb-1 flex items-center gap-2"><ShoppingCart className="h-5 w-5 text-primary" /> Smart Grocery List</h2>
          <p className="text-sm text-muted-foreground">Nutrient-priority weekly shopping checklist</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat, ci) => (
            <GlassCard key={cat} delay={0.1 + ci * 0.05}>
              <h3 className="font-display font-semibold text-sm mb-3 text-primary">{cat}</h3>
              <ul className="space-y-2">
                {items.filter(i => i.category === cat).map(item => (
                  <li key={item.name} className="flex items-center justify-between text-sm">
                    <button onClick={() => toggle(item.name)} className="flex items-center gap-2 text-left">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${checked.has(item.name) ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                        {checked.has(item.name) && <Check className="h-3 w-3 text-primary-foreground" />}
                      </div>
                      <span className={checked.has(item.name) ? 'line-through text-muted-foreground' : 'text-foreground'}>{item.name}</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${item.priority === 'Essential' ? 'bg-neon-cyan/15 text-neon-cyan' : item.priority === 'Recommended' ? 'bg-neon-blue/15 text-neon-blue' : 'bg-secondary text-muted-foreground'}`}>
                        {item.priority}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Grocery;
