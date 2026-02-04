import { AnimatePresence } from 'framer-motion';
import { useCallback, useState } from 'react';
import { NavDots } from './components/NavDots';
import { ProgressBar } from './components/ProgressBar';
import { SlideCounter } from './components/SlideCounter';
import { AgentListSlide } from './components/slides/AgentListSlide';
import { ClaudeHierarchySlide } from './components/slides/ClaudeHierarchySlide';
import { ContentSlide } from './components/slides/ContentSlide';
import { ContextGraphSlide } from './components/slides/ContextGraphSlide';
import { CoverSlide } from './components/slides/CoverSlide';
import { ImageSlide } from './components/slides/ImageSlide';
import { LLMDemoSlide } from './components/slides/LLMDemoSlide';
import { LostMiddleSlide } from './components/slides/LostMiddleSlide';
import { SDDWorkflowSlide } from './components/slides/SDDWorkflowSlide';
import { SectionSlide } from './components/slides/SectionSlide';
import { SubscriptionValueSlide } from './components/slides/SubscriptionValueSlide';
import { TokenizerSlide } from './components/slides/TokenizerSlide';
import { useSlideNavigation } from './hooks/useSlideNavigation';

type ContentItem = string | string[];
type SlideContent = string | ContentItem[];

type SlideData =
  | { id: number; type: 'cover'; title: string; subtitle?: string }
  | { id: number; type: 'section'; number: string; title: string }
  | {
      id: number;
      type: 'content';
      title: string;
      content: SlideContent;
      sectionNumber?: string;
      sectionTitle?: string;
    }
  | { id: number; type: 'tokenizer'; title: string; sectionNumber?: string; sectionTitle?: string }
  | { id: number; type: 'llm-demo'; title: string; sectionNumber?: string; sectionTitle?: string }
  | {
      id: number;
      type: 'context-graph';
      title: string;
      sectionNumber?: string;
      sectionTitle?: string;
    }
  | {
      id: number;
      type: 'lost-middle';
      title: string;
      sectionNumber?: string;
      sectionTitle?: string;
    }
  | {
      id: number;
      type: 'image';
      title: string;
      imageSrc: string;
      imageAlt?: string;
      sectionNumber?: string;
      sectionTitle?: string;
    }
  | {
      id: number;
      type: 'agent-list';
      title: string;
      sectionNumber?: string;
      sectionTitle?: string;
    }
  | {
      id: number;
      type: 'subscription-value';
      title: string;
      sectionNumber?: string;
      sectionTitle?: string;
    }
  | {
      id: number;
      type: 'claude-hierarchy';
      title: string;
      sectionNumber?: string;
      sectionTitle?: string;
    }
  | {
      id: number;
      type: 'sdd-workflow';
      title: string;
      sectionNumber?: string;
      sectionTitle?: string;
    };

const slides: SlideData[] = [
  { id: 1, type: 'cover', title: 'AI Agents', subtitle: 'for Developers' },
  { id: 2, type: 'section', number: '01', title: 'Foundations' },
  {
    id: 3,
    type: 'content',
    title: 'Large Language Models',
    content: [
      '**GPT**, **Claude**, **Gemini**, **LLaMA** are *autoregressive Transformers* in their core',
      'Predicts the next token from all previous tokens',
      'Tokens `IDs` → convert to `embeddings` → use `Transformer` → predict next token',
      'Not *understanding* — statistical continuation',
    ],
    sectionNumber: '01',
    sectionTitle: 'Foundations',
  },
  {
    id: 4,
    type: 'llm-demo',
    title: 'How LLMs Generate Text',
    sectionNumber: '01',
    sectionTitle: 'Foundations',
  },
  {
    id: 5,
    type: 'content',
    title: 'Why This Matters',
    content: [
      [
        '**Hallucinations**',
        'Model generates *plausible continuation*, not verified facts',
        'If `X is Y` appeared often in training data, model outputs it confidently — even if wrong',
      ],
      [
        '**Chain-of-Thought works**',
        'Thinking aloud produces intermediate tokens, increasing quality on complex tasks',
        'These tokens become context, literally shifting the probability distribution',
        'Reasoning Models — from prompt to built-in feature',
      ],
      [
        '**Format affects quality**',
        'Model learned from billions of documents',
        'Requesting structured formats (JSON, HTML) triggers higher-quality patterns',
      ],
    ],
    sectionNumber: '01',
    sectionTitle: 'Foundations',
  },
  {
    id: 6,
    type: 'image',
    title: 'You are absolutely right',
    imageSrc: '/images/joke-air.jpg',
    sectionNumber: '01',
    sectionTitle: 'Foundations',
  },
  {
    id: 7,
    type: 'content',
    title: 'Sycophancy',
    content: [
      'Model trained to be helpful → tends to agree, even when wrong',
      [
        '**Why it happens**',
        'RLHF: humans prefer confirming answers → model learns to please',
        'Training data: assistants agree and help, rarely argue',
      ],
      [
        '**Practical solutions**',
        '❌ *"Is this correct?"* → ✅ *"Find problems in this code"*',
        'Ask for criticism: *"Act as strict reviewer. Find at least 3 issues"*',
        'Devil\'s advocate: *"Argue why this solution is bad"*',
      ],
    ],
    sectionNumber: '01',
    sectionTitle: 'Foundations',
  },
  {
    id: 8,
    type: 'tokenizer',
    title: 'Token Counter',
    sectionNumber: '01',
    sectionTitle: 'Foundations',
  },
  {
    id: 9,
    type: 'content',
    title: 'Key Takeaway',
    content: [
      'LLMs are statistical pattern matchers — understanding this unlocks better prompting',
      'Same prompt → different answers. Verify results through repeated generations',
      'No *correct answer inside* — only probability distribution',
    ],
    sectionNumber: '01',
    sectionTitle: 'Foundations',
  },
  { id: 10, type: 'section', number: '02', title: 'Context' },
  {
    id: 11,
    type: 'context-graph',
    title: 'Context Window Comparison',
    sectionNumber: '02',
    sectionTitle: 'Context',
  },
  {
    id: 12,
    type: 'content',
    title: 'Context Window Basics',
    content: [
      [
        '**Context window = everything the model "sees"**',
        'Each API request sends the *full context* from scratch',
        'Model has no memory between requests — complete reload every time',
      ],
      [
        '**The Amnesia Analogy**',
        'Imagine someone with complete amnesia reading their diary from page 1 every morning',
        "They only 'remember' what's written, and only while reading",
        'Tomorrow? Start from page 1 again',
      ],
      [
        '**Cost Implications**',
        'Long conversations = exponential cost growth',
        '50 messages × 500 tokens = `25K tokens` per request by end',
        'Prompt caching helps — cached tokens cost less, but you still pay for them',
      ],
    ],
    sectionNumber: '02',
    sectionTitle: 'Context',
  },
  {
    id: 13,
    type: 'lost-middle',
    title: 'Lost in the Middle',
    sectionNumber: '02',
    sectionTitle: 'Context',
  },
  {
    id: 14,
    type: 'content',
    title: 'Lost in the Middle',
    content: [
      [
        '**System prompt at the beginning**',
        'Critical instructions, persona definitions, and constraints go here',
        'Models pay strongest attention to the start of context',
      ],
      [
        '**Last message = highest weight**',
        'Recent user input and assistant responses get priority',
        'Use this for immediate task focus and clarifications',
      ],
      [
        '**Middle = reference material zone**',
        'RAG documents, conversation history, and examples often land here',
        'Information can be *"lost"* — retrieval accuracy drops significantly',
      ],
    ],
    sectionNumber: '02',
    sectionTitle: 'Context',
  },
  {
    id: 15,
    type: 'content',
    title: 'Mitigation Strategies',
    content: [
      [
        '**Repeat critical instructions**',
        'Place key constraints at both the beginning and end of long contexts',
        'The *sandwich* approach ensures important rules are not forgotten',
      ],
      [
        '**Newer models handle this better**',
        'Claude 3+ and recent GPT models are trained specifically for long context retrieval',
        'The *lost in the middle* effect is reduced, but not eliminated completely',
      ],
    ],
    sectionNumber: '02',
    sectionTitle: 'Context',
  },
  {
    id: 16,
    type: 'content',
    title: 'Context Rot',
    content: [
      'Long sessions → quality degradation',

      [
        '**Contradiction accumulation**',
        'Conflicting instructions in history confuse the model',
        'Earlier guidance gets diluted by later contradictions',
      ],
      [
        '**Instruction dilution**',
        'System prompt ratio shrinks: `2K` instructions vs `100K` dialogue tokens',
        'Critical rules get drowned in conversation noise, style drifts',
      ],
      [
        '**Compaction artifacts**',
        'Auto-summarization near context limit loses details',
        'Agents compress history, dropping nuances',
      ],
    ],
    sectionNumber: '02',
    sectionTitle: 'Context',
  },
  {
    id: 17,
    type: 'content',
    title: 'Fighting Context Rot',
    content: [
      [
        '**New session for new task**',
        "Don't continue feature B in feature A's session",
        'Fresh context = fresh quality baseline',
      ],
      'Don\'t fear starting over — sometimes it\'s more efficient than "healing" an old one',
      '`AGENTS.md` is your anchor — reloaded every session',
    ],
    sectionNumber: '02',
    sectionTitle: 'Context',
  },
  { id: 18, type: 'section', number: '03', title: 'Agents' },
  {
    id: 19,
    type: 'content',
    title: 'What is an Agent?',
    content: [
      'Chat answers questions. Agents *take actions* to achieve goals.',
      '**Agent = Model + Tools + Orchestration Loop**',
      [
        '**The Loop**',
        'User gives task → Model plans next step → Tool executes action',
        'Result feeds back → Model decides next step → Repeat until done',
      ],
      'Tools = real side effects: files, terminals, APIs, databases',
      'Guardrails: token budgets, step limits, approvals, sandboxing',
      '**Mental model:** A careful junior dev with tools — works independently, you review the output',
    ],
    sectionNumber: '03',
    sectionTitle: 'Agents',
  },
  {
    id: 20,
    type: 'content',
    title: 'Agents vs IDE Chats',
    content: [
      'IDEs now have agent modes too — Copilot, Cursor, Windsurf. So why CLI?',
      [
        '**CLI runs anywhere**',
        'Local machine, remote server, CI/CD pipeline, Docker container. Just use SSH, bro',
      ],
      [
        '**CLI integrates with everything**',
        'Shell scripts, automation pipelines, cron jobs, webhooks',
      ],
      [
        '**CLI gets the investment**',
        'Anthropic → Claude Code, OpenAI → Codex CLI',
        'Latest models and first-party tools with cutting-edge features ship here first',
        'IDEs catch up later, often with reduced capabilities',
      ],
      'IDE agents = convenience. CLI agents = power and flexibility',
    ],
    sectionNumber: '03',
    sectionTitle: 'Agents',
  },
  {
    id: 21,
    type: 'content',
    title: 'Why not Copilot?',
    content: [
      "Copilot works — but it's not best fit for agents",
      [
        '**Limited CLI support**',
        "Only OpenCode integrates with Copilot's Subscription",
        "Codex and Claude Code don't support it — locked to their own",
      ],
      [
        '**Older models, slower updates**',
        'Copilot Pro uses GPT-5.1 Codex — not the latest agentic reasoning models',
        'Newer models like Opus 4.5 have stricter limits',
      ],
      ['**No unique value**', 'Everything Copilot offers is available through other subscriptions'],
    ],
    sectionNumber: '03',
    sectionTitle: 'Agents',
  },
  {
    id: 22,
    type: 'agent-list',
    title: 'Agents We Will Explore',
    sectionNumber: '03',
    sectionTitle: 'Agents',
  },
  {
    id: 23,
    type: 'content',
    title: 'OpenAI Codex',
    content: [
      "Codex comes in three flavors: **Web**, **CLI**, and **App** — we'll focus on the CLI",
      [
        '**The CLI**',
        'Built in Rust — fast and stable',
        'Works with your existing OpenAI subscription',
      ],
      [
        '**Models**',
        'GPT-5.2 and GPT-5.2 Codex available',
        'Codex variants are fine-tuned for agentic workflows and tool use',
      ],
      [
        '**GitHub integration**',
        'Assign Codex to issues or mention in comments — like GitHub Copilot',
      ],
    ],
    sectionNumber: '03',
    sectionTitle: 'Agents',
  },
  {
    id: 24,
    type: 'content',
    title: 'Working with Codex',
    content: [
      [
        '**Slower but smarter**',
        'Tasks can take several minutes (40% faster recently, but still slow)',
        'Trade speed for heavy reasoning and tough problems',
      ],
      [
        '**Direct and literal**',
        "Give specific instructions — it won't improvise",
        'Great for backend work and code reviews',
      ],
    ],
    sectionNumber: '03',
    sectionTitle: 'Agents',
  },
  {
    id: 25,
    type: 'content',
    title: 'OpenCode',
    content: [
      'Open-source CLI agent with a **Vim-flavored**, IDE-in-terminal experience',
      [
        '**The Stack**',
        'Written in TypeScript, runs on Bun (built in Zig)',
        'Keyboard-driven UI — smooth and fast, but no mouse support',
      ],
      [
        '**Models**',
        'Free Chinese models: Kimi K2.5, GLM 4.7',
        'Works with OpenAI subscription or Copilot — *not* Anthropic (API only)',
      ],
      [
        '**GitHub integration**',
        'Can mention `/opencode` or `/oc` in issues and PRs, but clunky DX',
        '[Workflows](https://opencode.ai/docs/github/) are the recommended approach',
      ],
    ],
    sectionNumber: '03',
    sectionTitle: 'Agents',
  },
  {
    id: 26,
    type: 'content',
    title: 'Claude Code',
    content: [
      'The **first CLI agent** — launched January 2025, set the standard for the category',
      [
        '**The Stack**',
        'Closed-source, written in TypeScript, runs on Bun',
        'Native to terminal — works great with hotkeys *and* mouse',
      ],
      [
        '**Models**',
        'Currently supports Anthropic models only',
        'Can hack to use other providers via OpenRouter API',
      ],
      [
        '**The Apple Strategy**',
        'Anthropic locks you into their ecosystem with top-notch integrations',
        'Claude Desktop, Claude Code, plugins, API — everything works together seamlessly',
      ],
    ],
    sectionNumber: '03',
    sectionTitle: 'Agents',
  },
  {
    id: 27,
    type: 'content',
    title: 'Working with Claude Code',
    content: [
      [
        '**Opus 4.5 — the daily driver**',
        'SOTA across the board — fast, smart, reliable',
        'Not #1 in every benchmark, but consistently excellent everywhere',
      ],
      [
        '**Does extra work**',
        'Tends to anticipate needs — you can be less specific with instructions',
        'More *human* in conversation, better at following complex instructions',
      ],
      [
        '**Anthropic subscription perks**',
        'Access to Claude Desktop, Projects, MCP servers, and more',
        'One subscription covers chat, API credits, and agent usage',
      ],
    ],
    sectionNumber: '03',
    sectionTitle: 'Agents',
  },
  {
    id: 28,
    type: 'subscription-value',
    title: 'Why Subscription?',
    sectionNumber: '03',
    sectionTitle: 'Agents',
  },
  { id: 29, type: 'section', number: '04', title: 'Claude Code' },
  {
    id: 30,
    type: 'content',
    title: 'CLAUDE.md',
    content: [
      'Loaded at the start of **every session** — your persistent instructions',
      'Not documentation for humans — *instructions for the model*',
      'Define: tech stack, conventions, forbidden patterns, project knowledge',
      [
        '**Why this matters**',
        '**Consistency:** Every session starts with identical instructions',
        '**No repetition:** No need to say *"use TypeScript strict"* every time',
        '**Project context:** Model knows your codebase before the first question',
      ],
      [
        '**Boris Cherny, creator of Claude Code:**',
        '*"Invest in your CLAUDE.md. After every correction, end with: Update your CLAUDE.md so you don\'t make that mistake again."*',
        '*"Claude is really good at writing rules for itself."*',
      ],
    ],
    sectionNumber: '04',
    sectionTitle: 'Claude Code',
  },
  {
    id: 31,
    type: 'content',
    title: 'CLAUDE.md in Practice',
    content: [
      '[AGENTS.md](https://agents.md/) — same principles work across Codex, OpenCode, Cursor, etc.',
      [
        '**Memory management**',
        '`/memory` command — view and edit global and local memory',
        '*"Add this to your memory"* — Claude updates its own instructions',
      ],
      [
        '**Hierarchical loading**',
        '`~/.claude/CLAUDE.md` — global, applies to all projects',
        '`./CLAUDE.md` — project root, team-shared conventions',
        '`./src/components/CLAUDE.md` — subfolder-specific, loaded when path is accessed',
      ],
    ],
    sectionNumber: '04',
    sectionTitle: 'Claude Code',
  },
  {
    id: 32,
    type: 'claude-hierarchy',
    title: 'Memory Files Hierarchy',
    sectionNumber: '04',
    sectionTitle: 'Claude Code',
  },
  {
    id: 33,
    type: 'content',
    title: 'Skills',
    content: [
      '[agentskills.io](https://agentskills.io/home) — open format for agent capabilities',
      '*"CLAUDE.md says here\'s what you need to know. Skills say here\'s how to do things."*',
      [
        '**Progressive disclosure**',
        'Agent reads only `name` + `description` at startup',
        'Full instructions load only when skill is activated',
      ],
      [
        '**Where to store**',
        '`~/.claude/skills/` — personal, for all projects',
        '`.claude/skills/` — project-specific, shared via git',
      ],
      'Has a lot of built-in skills, can work with documents, images, etc.',
      '*Ask Claude Code to create an HTML with all tools and skills available.*',
    ],
    sectionNumber: '04',
    sectionTitle: 'Claude Code',
  },
  {
    id: 34,
    type: 'content',
    title: 'MCP (Model Context Protocol)',
    content: [
      'Open standard for connecting AI to external systems — like **USB-C for LLMs**',
      [
        '**Architecture**',
        '`Host` (Claude Code) → `MCP Client` → `MCP Server` (GitHub, Slack, Postgres)',
        'Servers provide **tools**, **resources**, and **prompts**',
      ],
      [
        '**How it works**',
        'At startup, Client discovers available tools via JSON Schema definitions',
        'Claude sees *what* it can call and *with what parameters* — not the implementation',
        'Tool calls go to server → results return to context',
      ],
      [
        '**Loaded on demand**',
        'Like Skills — only `name` + `description` loaded initially',
        'Full tool definitions load when needed — no context pollution',
      ],
      '`context7` — recommended MCP for fetching up-to-date library documentation',
    ],
    sectionNumber: '04',
    sectionTitle: 'Claude Code',
  },
  {
    id: 35,
    type: 'content',
    title: 'Pro Tips',
    content: [
      [
        '**Work in Parallel**',
        'Spin up 3–5 git worktrees, each with its own Claude session',
        'Shell aliases (`za`, `zb`, `zc`) for instant switching between tasks',
      ],
      [
        '**Plan Mode for Complex Tasks**',
        'Pour energy into the plan → Claude 1-shots the implementation',
        'When things go sideways, switch back to plan mode and re-plan',
      ],
      [
        '**Terminal Setup**',
        'Ghostty for rendering quality; `/statusline` for context & branch',
        'Voice dictation (`fn` x2) — you speak 3x faster than you type',
      ],
      [
        '**Use Subagents**',
        '*"use subagents"* — throw more compute at hard problems',
        'Offload tasks to keep your main context window clean',
      ],
    ],
    sectionNumber: '04',
    sectionTitle: 'Claude Code',
  },
  {
    id: 36,
    type: 'content',
    title: 'SDD — Spec Driven Development',
    content: [
      'A systematic approach to AI-assisted development that maximizes agent effectiveness',
      [
        '**Core Principle**',
        'Write specifications *before* code — PRD, tasks, then implementation',
        'Agents work best with clear context and atomic tasks',
      ],
      [
        '**Why SDD works**',
        'AI agents lack long-term memory — specs persist across sessions',
        'Clear task boundaries prevent context rot and scope creep',
        'Multiple AI tools excel at different phases (research vs implementation)',
      ],
    ],
    sectionNumber: '04',
    sectionTitle: 'Claude Code',
  },
  {
    id: 37,
    type: 'sdd-workflow',
    title: 'SDD Workflow',
    sectionNumber: '04',
    sectionTitle: 'Claude Code',
  },
  {
    id: 38,
    type: 'image',
    title: 'Questions?',
    imageSrc: '/images/joke-claude.png',
  },
];

function renderSlide(slide: SlideData) {
  switch (slide.type) {
    case 'cover':
      return <CoverSlide key={slide.id} title={slide.title} subtitle={slide.subtitle} />;
    case 'section':
      return <SectionSlide key={slide.id} number={slide.number} title={slide.title} />;
    case 'content':
      return (
        <ContentSlide
          key={slide.id}
          title={slide.title}
          sectionNumber={slide.sectionNumber}
          sectionTitle={slide.sectionTitle}
        >
          {slide.content}
        </ContentSlide>
      );
    case 'tokenizer':
      return (
        <TokenizerSlide
          key={slide.id}
          title={slide.title}
          sectionNumber={slide.sectionNumber}
          sectionTitle={slide.sectionTitle}
        />
      );
    case 'llm-demo':
      return (
        <LLMDemoSlide
          key={slide.id}
          title={slide.title}
          sectionNumber={slide.sectionNumber}
          sectionTitle={slide.sectionTitle}
        />
      );
    case 'context-graph':
      return (
        <ContextGraphSlide
          key={slide.id}
          title={slide.title}
          sectionNumber={slide.sectionNumber}
          sectionTitle={slide.sectionTitle}
        />
      );
    case 'lost-middle':
      return (
        <LostMiddleSlide
          key={slide.id}
          title={slide.title}
          sectionNumber={slide.sectionNumber}
          sectionTitle={slide.sectionTitle}
        />
      );
    case 'image':
      return (
        <ImageSlide
          key={slide.id}
          title={slide.title}
          imageSrc={slide.imageSrc}
          imageAlt={slide.imageAlt}
          sectionNumber={slide.sectionNumber}
          sectionTitle={slide.sectionTitle}
        />
      );
    case 'agent-list':
      return (
        <AgentListSlide
          key={slide.id}
          title={slide.title}
          sectionNumber={slide.sectionNumber}
          sectionTitle={slide.sectionTitle}
        />
      );
    case 'subscription-value':
      return (
        <SubscriptionValueSlide
          key={slide.id}
          title={slide.title}
          sectionNumber={slide.sectionNumber}
          sectionTitle={slide.sectionTitle}
        />
      );
    case 'claude-hierarchy':
      return (
        <ClaudeHierarchySlide
          key={slide.id}
          title={slide.title}
          sectionNumber={slide.sectionNumber}
          sectionTitle={slide.sectionTitle}
        />
      );
    case 'sdd-workflow':
      return (
        <SDDWorkflowSlide
          key={slide.id}
          title={slide.title}
          sectionNumber={slide.sectionNumber}
          sectionTitle={slide.sectionTitle}
        />
      );
  }
}

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleGoTo = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  useSlideNavigation({
    currentSlide,
    totalSlides: slides.length,
    onNext: handleNext,
    onPrev: handlePrev,
    onGoTo: handleGoTo,
  });

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-charcoal">
      <AnimatePresence mode="wait">{renderSlide(slides[currentSlide])}</AnimatePresence>

      <NavDots current={currentSlide} total={slides.length} onNavigate={handleGoTo} />

      <SlideCounter current={currentSlide} total={slides.length} />

      <ProgressBar current={currentSlide} total={slides.length} />
    </div>
  );
}
