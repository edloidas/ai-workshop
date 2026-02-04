import { motion } from 'framer-motion';

interface LostMiddleSlideProps {
  title: string;
  sectionNumber?: string;
  sectionTitle?: string;
}

interface AccuracyData {
  position: string;
  accuracy: number;
  colorClass: string;
}

const ACCURACY_DATA: AccuracyData[] = [
  { position: 'Beginning', accuracy: 90, colorClass: 'bg-teal' },
  { position: 'Middle', accuracy: 55, colorClass: 'bg-warm-gray' },
  { position: 'End', accuracy: 85, colorClass: 'bg-accent' },
];

const maxAccuracy = 100;

export function LostMiddleSlide({ title, sectionNumber, sectionTitle }: LostMiddleSlideProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="flex h-full w-full flex-col bg-charcoal px-24 py-16"
    >
      {sectionNumber && sectionTitle && (
        <motion.div
          className="mb-2 flex items-center gap-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0, duration: 0.35 }}
        >
          <span className="flex size-6 items-center justify-center bg-accent font-mono text-xs font-medium text-charcoal">
            {sectionNumber}
          </span>
          <span className="font-sans text-lg text-muted">{sectionTitle}</span>
        </motion.div>
      )}
      <motion.h2
        className="font-sans text-5xl font-semibold text-main"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.07, duration: 0.35 }}
      >
        {title}
      </motion.h2>

      <motion.div
        className="mt-12 flex flex-1 flex-col"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.17, duration: 0.35 }}
      >
        {/* U-Curve Bar Chart */}
        <div className="flex flex-1 items-center justify-center gap-16">
          {ACCURACY_DATA.map((item, index) => (
            <div key={item.position} className="flex flex-col items-center gap-4">
              {/* Percentage label */}
              <motion.span
                className="font-mono text-2xl text-muted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.15, duration: 0.35 }}
              >
                {item.accuracy}%
              </motion.span>

              {/* Bar */}
              <div className="relative h-64 w-24">
                <motion.div
                  className={`absolute bottom-0 w-full ${item.colorClass}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.accuracy / maxAccuracy) * 100}%` }}
                  transition={{
                    delay: 0.3 + index * 0.15,
                    duration: 0.6,
                    ease: 'easeOut',
                  }}
                />
              </div>

              {/* Position label */}
              <span className="font-sans text-lg text-muted">{item.position}</span>
            </div>
          ))}
        </div>

        {/* Citation */}
        <motion.p
          className="mt-auto font-display text-sm italic text-muted/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.35 }}
        >
          Liu et al., 2023 —{' '}
          <a
            href="https://arxiv.org/abs/2307.03172"
            className="text-accent underline underline-offset-2 hover:text-main"
            target="_blank"
            rel="noopener noreferrer"
          >
            Lost in the Middle
          </a>
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
