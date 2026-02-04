import { motion } from 'framer-motion';

interface ClaudeHierarchySlideProps {
  title: string;
  sectionNumber?: string;
  sectionTitle?: string;
}

const hierarchyData = [
  {
    level: 'Enterprise',
    location: 'Managed policy',
    priority: 'highest',
    when: 'Always (if configured)',
  },
  {
    level: 'Project local',
    location: './CLAUDE.local.md',
    priority: 'high',
    when: 'Session start',
  },
  {
    level: 'Project shared',
    location: './CLAUDE.md',
    priority: 'high',
    when: 'Session start',
  },
  {
    level: 'Project rules',
    location: './.claude/rules/*.md',
    priority: 'high',
    when: 'Session start (or conditional)',
  },
  {
    level: 'User rules',
    location: '~/.claude/rules/*.md',
    priority: 'medium',
    when: 'Session start',
  },
  {
    level: 'User global',
    location: '~/.claude/CLAUDE.md',
    priority: 'medium',
    when: 'Session start',
  },
  {
    level: 'Subfolder',
    location: './src/CLAUDE.md',
    priority: 'contextual',
    when: 'When working in that folder',
  },
];

const priorityColors: Record<string, string> = {
  highest: 'bg-red-500/80',
  high: 'bg-accent/80',
  medium: 'bg-teal/80',
  contextual: 'bg-blue/80',
};

export function ClaudeHierarchySlide({
  title,
  sectionNumber,
  sectionTitle,
}: ClaudeHierarchySlideProps) {
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
        className="mt-10 flex-1"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.17, duration: 0.35 }}
      >
        <table className="w-full border-collapse font-sans text-lg">
          <thead>
            <tr className="border-b border-warm-gray text-left text-muted">
              <th className="pb-3 pr-6 font-medium">Level</th>
              <th className="pb-3 pr-6 font-medium">Location</th>
              <th className="pb-3 pr-6 font-medium">Priority</th>
              <th className="pb-3 font-medium">When loaded</th>
            </tr>
          </thead>
          <tbody>
            {hierarchyData.map((row, index) => (
              <motion.tr
                key={row.level}
                className="border-b border-warm-gray/50"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 + index * 0.05, duration: 0.3 }}
              >
                <td className="py-3 pr-6 font-medium text-main">{row.level}</td>
                <td className="py-3 pr-6">
                  <code className="rounded bg-warm-gray px-2 py-1 font-mono text-base text-accent">
                    {row.location}
                  </code>
                </td>
                <td className="py-3 pr-6">
                  <span
                    className={`inline-block rounded px-2 py-0.5 font-mono text-sm text-charcoal ${priorityColors[row.priority]}`}
                  >
                    {row.priority}
                  </span>
                </td>
                <td className="py-3 text-muted">{row.when}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        <motion.div
          className="mt-8 text-lg text-muted"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.35 }}
        >
          <span className="text-main">Key insight:</span> Project overrides global, subfolder loads
          on demand. Check active files with{' '}
          <code className="rounded bg-warm-gray px-2 py-1 font-mono text-base text-accent">
            /memory
          </code>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
