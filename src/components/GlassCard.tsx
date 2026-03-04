import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

const GlassCard = ({ children, className, hover = true, delay = 0 }: GlassCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={cn('glass-card p-6', hover && 'transition-all duration-300 hover:scale-[1.02] animate-glow-pulse', className)}
  >
    {children}
  </motion.div>
);

export default GlassCard;
