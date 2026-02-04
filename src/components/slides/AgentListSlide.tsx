import { motion } from 'framer-motion';

interface Agent {
  name: string;
  url: string;
  description: string;
  logo: string;
}

const agents: Agent[] = [
  {
    name: 'Claude Code',
    url: 'https://docs.anthropic.com/en/docs/claude-code',
    description: 'Anthropic CLI agent for software development',
    logo: '/images/logo/claude.svg',
  },
  {
    name: 'OpenAI Codex',
    url: 'https://github.com/openai/codex',
    description: 'OpenAI terminal-based coding assistant',
    logo: '/images/logo/openai.svg',
  },
  {
    name: 'OpenCode',
    url: 'https://opencode.ai/',
    description: 'Open-source AI coding agent',
    logo: '/images/logo/opencode.svg',
  },
];

interface AgentListSlideProps {
  title: string;
  sectionNumber?: string;
  sectionTitle?: string;
}

export function AgentListSlide({ title, sectionNumber, sectionTitle }: AgentListSlideProps) {
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

      <div className="mt-12 flex flex-1 items-center justify-center gap-8">
        {agents.map((agent, index) => (
          <motion.a
            key={agent.name}
            href={agent.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex h-64 w-72 flex-col justify-between rounded-lg border border-warm-gray bg-charcoal p-6 hover:border-accent hover:bg-warm-gray/30"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 + index * 0.1, duration: 0.35 }}
          >
            <img
              src={agent.logo}
              alt={`${agent.name} logo`}
              className="absolute top-4 right-4 size-10 opacity-60 transition-opacity group-hover:opacity-100"
            />
            <div>
              <h3 className="font-sans text-2xl font-semibold text-main group-hover:text-accent">
                {agent.name}
              </h3>
              <p className="mt-3 font-sans text-lg text-muted">{agent.description}</p>
            </div>
            <span className="font-mono text-sm text-accent opacity-0 transition-opacity group-hover:opacity-100">
              Open docs →
            </span>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
