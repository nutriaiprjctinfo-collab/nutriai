import AppLayout from '@/components/AppLayout';
import GlassCard from '@/components/GlassCard';
import { Activity, Target, Eye, Cpu, Code, GraduationCap } from 'lucide-react';

const team = [
  { name: 'V. Aswin', role: 'Lead AI Systems Architect' },
  { name: 'G. Dinesh Kanna', role: 'Frontend & UI/UX Developer' },
  { name: 'I. Sham Kumar', role: 'Clinical Logic & Data Modeling Engineer' },
  { name: 'M. Madhavan', role: 'Health Analytics & Integration Developer' },
];

const About = () => (
  <AppLayout>
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center py-8">
        <div className="flex items-center gap-3 justify-center mb-4">
          <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center neon-border neon-glow">
            <Activity className="h-7 w-7 text-primary" />
          </div>
        </div>
        <h1 className="font-display text-3xl font-bold text-primary neon-text">NutriAI</h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto text-sm">
          AI-Based Clinical Nutrition Monitoring System that predicts health risks, dynamically adjusts dietary recommendations, and intelligently monitors patient wellness using a fully client-side AI architecture.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard delay={0.1}>
          <div className="flex items-center gap-2 mb-3"><Target className="h-4 w-4 text-primary" /><h3 className="font-display font-semibold">Mission</h3></div>
          <p className="text-sm text-muted-foreground">To democratize clinical nutrition monitoring through intelligent AI-driven analysis, making personalized health insights accessible to everyone without the need for expensive medical consultations.</p>
        </GlassCard>
        <GlassCard delay={0.15}>
          <div className="flex items-center gap-2 mb-3"><Eye className="h-4 w-4 text-primary" /><h3 className="font-display font-semibold">Vision</h3></div>
          <p className="text-sm text-muted-foreground">A world where every individual has access to AI-powered nutritional guidance that adapts to their unique health profile, preventing disease through proactive dietary intelligence.</p>
        </GlassCard>
        <GlassCard delay={0.2}>
          <div className="flex items-center gap-2 mb-3"><Cpu className="h-4 w-4 text-primary" /><h3 className="font-display font-semibold">Technology Stack</h3></div>
          <p className="text-sm text-muted-foreground">Built with React, TypeScript, Tailwind CSS, and Framer Motion. Features a fully client-side AI architecture with modular engines for risk prediction, diet generation, and symptom analysis. All data persists via Local Storage.</p>
        </GlassCard>
        <GlassCard delay={0.25}>
          <div className="flex items-center gap-2 mb-3"><Code className="h-4 w-4 text-primary" /><h3 className="font-display font-semibold">Architecture</h3></div>
          <p className="text-sm text-muted-foreground">Modular system: UI Layer → AI Logic Engine → Risk Prediction Module → Diet Intelligence Module → Monitoring & Analytics Module → Local Storage Data Layer. No external backend or APIs required.</p>
        </GlassCard>
      </div>

      <GlassCard delay={0.3}>
        <div className="flex items-center gap-2 mb-3"><GraduationCap className="h-4 w-4 text-primary" /><h3 className="font-display font-semibold">Academic Project</h3></div>
        <p className="text-sm text-muted-foreground mb-4">NutriAI demonstrates how client-side AI algorithms can deliver meaningful health predictions and personalized nutrition recommendations, showcasing the intersection of artificial intelligence, clinical nutrition science, and modern web technologies.</p>
      </GlassCard>

      <GlassCard delay={0.35}>
        <h3 className="font-display font-semibold mb-4 text-center">Developed by — Team NutriAI</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {team.map((member, i) => (
            <div key={i} className="p-4 rounded-lg bg-secondary/30 border border-border hover:border-primary/30 transition-all">
              <p className="font-display font-semibold text-sm">{member.name}</p>
              <p className="text-xs text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  </AppLayout>
);

export default About;
