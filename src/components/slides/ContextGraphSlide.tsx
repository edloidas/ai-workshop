import { motion } from 'framer-motion';

interface ContextGraphSlideProps {
  title: string;
  sectionNumber?: string;
  sectionTitle?: string;
}

interface BarData {
  label: string;
  tokens: number;
  display: string;
  type: 'book' | 'ai';
}

const data: BarData[] = [
  { label: 'The Great Gatsby', tokens: 70_000, display: '70k', type: 'book' },
  { label: 'Claude Opus 4.5', tokens: 200_000, display: '200k', type: 'ai' },
  { label: 'Dune', tokens: 270_000, display: '270k', type: 'book' },
  { label: 'GPT 5.2', tokens: 400_000, display: '400k', type: 'ai' },
  { label: 'War and Peace', tokens: 850_000, display: '850k', type: 'book' },
  { label: 'Gemini 3.0 Pro', tokens: 1_000_000, display: '1M', type: 'ai' },
];

const maxTokens = Math.max(...data.map((d) => d.tokens));

export function ContextGraphSlide({ title, sectionNumber, sectionTitle }: ContextGraphSlideProps) {
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
        <div className="w-full max-w-4xl space-y-4">
          {data.map((item, index) => (
            <div key={item.label} className="flex items-center gap-4">
              <span className="w-44 text-right font-sans text-lg text-muted">{item.label}</span>
              <div className="relative h-8 flex-1">
                <motion.div
                  className={`h-full ${item.type === 'ai' ? 'bg-accent' : 'bg-teal'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.tokens / maxTokens) * 100}%` }}
                  transition={{
                    delay: 0.3 + index * 0.1,
                    duration: 0.6,
                    ease: 'easeOut',
                  }}
                />
              </div>
              <span className="w-16 font-mono text-lg text-muted">{item.display}</span>
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
              <div className="size-4 bg-accent" />
              <span className="font-sans text-base text-muted">AI Models</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-4 bg-teal" />
              <span className="font-sans text-base text-muted">Books</span>
            </div>
          </div>
          <p className="font-display italic text-sm text-muted/60">
            Book token counts are approximate and vary by tokenizer
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
