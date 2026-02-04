import { motion } from 'framer-motion';

interface SubscriptionValueSlideProps {
  title: string;
  sectionNumber?: string;
  sectionTitle?: string;
}

interface TierData {
  label: string;
  subscription: number;
  apiValue: number;
  multiplier: string;
}

const data: TierData[] = [
  { label: 'Max 20x', subscription: 200, apiValue: 2708, multiplier: '13.54x' },
  { label: 'Max 5x', subscription: 100, apiValue: 1354, multiplier: '13.54x' },
  { label: 'Pro', subscription: 20, apiValue: 163, multiplier: '8.15x' },
];

const maxValue = Math.max(...data.map((d) => d.apiValue));

export function SubscriptionValueSlide({
  title,
  sectionNumber,
  sectionTitle,
}: SubscriptionValueSlideProps) {
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
        className="mt-12 flex flex-1 flex-col items-center justify-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.17, duration: 0.35 }}
      >
        <div className="w-full max-w-4xl space-y-8">
          {data.map((item, index) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xl font-medium text-main">{item.label}</span>
                <motion.span
                  className="rounded bg-accent/20 px-3 py-1 font-mono text-sm font-semibold text-accent"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.15, duration: 0.3 }}
                >
                  {item.multiplier} value
                </motion.span>
              </div>

              <div className="space-y-1">
                {/* Pay bar */}
                <div className="flex items-center gap-4">
                  <span className="w-12 text-right font-sans text-sm text-muted">Pay</span>
                  <div className="relative h-6 flex-1">
                    <motion.div
                      className="h-full bg-warm-gray"
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.subscription / maxValue) * 100}%` }}
                      transition={{
                        delay: 0.3 + index * 0.15,
                        duration: 0.6,
                        ease: 'easeOut',
                      }}
                    />
                  </div>
                  <span className="w-20 font-mono text-sm text-muted">${item.subscription}</span>
                </div>

                {/* Get bar */}
                <div className="flex items-center gap-4">
                  <span className="w-12 text-right font-sans text-sm text-muted">Get</span>
                  <div className="relative h-6 flex-1">
                    <motion.div
                      className="h-full bg-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.apiValue / maxValue) * 100}%` }}
                      transition={{
                        delay: 0.4 + index * 0.15,
                        duration: 0.6,
                        ease: 'easeOut',
                      }}
                    />
                  </div>
                  <span className="w-20 font-mono text-sm text-muted">${item.apiValue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <motion.div
          className="mt-12 flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.35 }}
        >
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="size-4 bg-warm-gray" />
              <span className="font-sans text-base text-muted">Subscription Cost</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-4 bg-accent" />
              <span className="font-sans text-base text-muted">API Value</span>
            </div>
          </div>
          <a
            href="https://she-llac.com/claude-limits"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-sm text-muted/60 italic underline decoration-muted/30 transition-colors hover:text-muted/80"
          >
            Source: she-llac.com/claude-limits
          </a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
