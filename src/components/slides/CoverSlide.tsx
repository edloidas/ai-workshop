import { motion } from 'framer-motion';

interface CoverSlideProps {
  title: string;
  subtitle?: string;
}

export function CoverSlide({ title, subtitle }: CoverSlideProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="relative flex h-full w-full items-center justify-center bg-charcoal"
    >
      {/* Decorative circles */}
      <motion.div
        className="absolute top-20 right-32 h-64 w-64 rounded-full bg-coral/20"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.55, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute bottom-32 left-24 h-48 w-48 rounded-full bg-teal/20"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.55, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute top-1/3 left-1/4 h-32 w-32 rounded-full bg-teal-light/10"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.55, ease: 'easeOut' }}
      />

      {/* Content */}
      <div className="relative z-10 text-center">
        <motion.h1
          className="font-display text-8xl font-bold tracking-tight text-cream"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            className="mt-6 font-sans text-3xl font-light text-text-muted"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.28, duration: 0.4 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
