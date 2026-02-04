import { AnimatePresence } from 'framer-motion';
import { useCallback, useState } from 'react';
import { NavDots } from './components/NavDots';
import { ProgressBar } from './components/ProgressBar';
import { SlideCounter } from './components/SlideCounter';
import { AgentListSlide } from './components/slides/AgentListSlide';
import { ContentSlide } from './components/slides/ContentSlide';
import { ContextGraphSlide } from './components/slides/ContextGraphSlide';
import { CoverSlide } from './components/slides/CoverSlide';
import { ImageSlide } from './components/slides/ImageSlide';
import { LLMDemoSlide } from './components/slides/LLMDemoSlide';
import { LostMiddleSlide } from './components/slides/LostMiddleSlide';
import { SectionSlide } from './components/slides/SectionSlide';
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
    type: 'agent-list',
    title: 'Agents We Will Explore',
    sectionNumber: '03',
    sectionTitle: 'Agents',
  },
  {
    id: 22,
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
    id: 23,
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
    id: 24,
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
    id: 25,
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
    id: 26,
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
