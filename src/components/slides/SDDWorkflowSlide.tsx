import { motion } from 'framer-motion';

interface SDDWorkflowSlideProps {
  title: string;
  sectionNumber?: string;
  sectionTitle?: string;
}

interface WorkflowStep {
  number: string;
  title: string;
  description: string;
  icon: string;
  highlighted?: boolean;
}

const workflowSteps: WorkflowStep[] = [
  {
    number: '01',
    title: 'PRD First',
    description: 'Research with Gemini, ChatGPT, Claude',
    icon: '📝',
    highlighted: true,
  },
  {
    number: '02',
    title: 'Store PRD',
    description: 'Put in project, reference in CLAUDE.md',
    icon: '📁',
  },
  {
    number: '03',
    title: 'Task Breakdown',
    description: 'Atomic standalone tasks in TASKS.md',
    icon: '✂️',
    highlighted: true,
  },
  {
    number: '04',
    title: 'Implementation',
    description: 'Plan mode, refer files/skills/commands',
    icon: '⚙️',
  },
  {
    number: '05',
    title: 'Iteration',
    description: 'Update TASKS.md or create GitHub issues',
    icon: '🔄',
  },
  {
    number: '06',
    title: 'Polishing',
    description: 'Plain agent mode for specific expansion',
    icon: '✨',
  },
  {
    number: '07',
    title: 'Parallel Work',
    description: 'Worktrees for branches and PR reviews',
    icon: '🌿',
  },
];

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      className={`size-6 text-warm-gray ${className ?? ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function SDDWorkflowSlide({ title, sectionNumber, sectionTitle }: SDDWorkflowSlideProps) {
  const topRow = workflowSteps.slice(0, 4);
  const bottomRow = workflowSteps.slice(4);

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

      <div className="mt-12 flex flex-1 flex-col items-center justify-center gap-6">
        {/* Top row: steps 01-04 */}
        <div className="flex items-center gap-3">
          {topRow.map((step, index) => (
            <div key={step.number} className="flex items-center gap-3">
              <motion.div
                className={`flex h-36 w-52 flex-col rounded-lg border p-4 ${
                  step.highlighted ? 'border-accent bg-accent/10' : 'border-warm-gray bg-charcoal'
                }`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 + index * 0.08, duration: 0.35 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{step.icon}</span>
                  <span
                    className={`font-mono text-sm ${step.highlighted ? 'text-accent' : 'text-muted'}`}
                  >
                    {step.number}
                  </span>
                </div>
                <h3
                  className={`mt-2 font-sans text-lg font-semibold ${
                    step.highlighted ? 'text-accent' : 'text-main'
                  }`}
                >
                  {step.title}
                </h3>
                <p className="mt-1 font-sans text-sm text-muted">{step.description}</p>
              </motion.div>
              {index < topRow.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 + index * 0.08 + 0.1, duration: 0.2 }}
                >
                  <Arrow />
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom row: steps 05-07 */}
        <div className="flex items-center gap-3">
          {bottomRow.map((step, index) => (
            <div key={step.number} className="flex items-center gap-3">
              <motion.div
                className={`flex h-36 w-52 flex-col rounded-lg border p-4 ${
                  step.highlighted ? 'border-accent bg-accent/10' : 'border-warm-gray bg-charcoal'
                }`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 + (index + topRow.length) * 0.08, duration: 0.35 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{step.icon}</span>
                  <span
                    className={`font-mono text-sm ${step.highlighted ? 'text-accent' : 'text-muted'}`}
                  >
                    {step.number}
                  </span>
                </div>
                <h3
                  className={`mt-2 font-sans text-lg font-semibold ${
                    step.highlighted ? 'text-accent' : 'text-main'
                  }`}
                >
                  {step.title}
                </h3>
                <p className="mt-1 font-sans text-sm text-muted">{step.description}</p>
              </motion.div>
              {index < bottomRow.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: 0.25 + (index + topRow.length) * 0.08 + 0.1,
                    duration: 0.2,
                  }}
                >
                  <Arrow />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
