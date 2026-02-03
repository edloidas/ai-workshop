import { motion } from 'framer-motion';

import { ShaderCanvas } from '../ShaderCanvas';

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
      {/* WebGL shader background */}
      <ShaderCanvas className="absolute inset-0 h-full w-full" />

      {/* Content */}
      <div className="relative z-10 text-center flex flex-col items-center justify-center gap-6">
        <motion.h1
          className="font-display text-8xl font-bold tracking-tight text-main"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            className="font-sans text-3xl font-light text-muted"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.28, duration: 0.4 }}
          >
            {subtitle}
          </motion.p>
        )}

        {/* Author line */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.4 }}
        >
          <div className="h-px w-24 bg-muted/30" />
          <p className="font-sans text-sm tracking-widest text-muted">edloidas • 2026</p>
        </motion.div>
      </div>

      {/* Navigation hint */}
      <motion.div
        className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 0.5,
          y: [0, -8, 0],
        }}
        transition={{
          opacity: { delay: 1.2, duration: 0.6 },
          y: {
            delay: 1.2,
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          },
        }}
      >
        <p className="font-mono text-sm uppercase tracking-wide text-main cursor-default">
          ← keys →
        </p>
      </motion.div>
    </motion.div>
  );
}
