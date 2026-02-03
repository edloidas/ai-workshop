import { motion } from 'framer-motion';

interface SectionSlideProps {
  number: string;
  title: string;
}

export function SectionSlide({ number, title }: SectionSlideProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="flex h-full w-full items-center justify-center bg-charcoal"
    >
      <div className="text-center">
        <motion.span
          className="font-mono text-6xl font-medium text-coral"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.07, duration: 0.35 }}
        >
          {number}
        </motion.span>
        <motion.h2
          className="mt-4 font-display text-6xl font-semibold text-cream"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.17, duration: 0.35 }}
        >
          {title}
        </motion.h2>
      </div>
    </motion.div>
  );
}
