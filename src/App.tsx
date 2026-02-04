import {AnimatePresence} from 'framer-motion';
import {useCallback, useState} from 'react';
import {NavDots} from './components/NavDots';
import {ProgressBar} from './components/ProgressBar';
import {SlideCounter} from './components/SlideCounter';
import {ContentSlide} from './components/slides/ContentSlide';
import {ContextGraphSlide} from './components/slides/ContextGraphSlide';
import {CoverSlide} from './components/slides/CoverSlide';
import {LLMDemoSlide} from './components/slides/LLMDemoSlide';
import {LostMiddleSlide} from './components/slides/LostMiddleSlide';
import {SectionSlide} from './components/slides/SectionSlide';
import {TokenizerSlide} from './components/slides/TokenizerSlide';
import {useSlideNavigation} from './hooks/useSlideNavigation';

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
        'If `X wrote book Y` appeared often in training data, model outputs it confidently — even if wrong',
      ],
      [
        '**Chain-of-Thought works**',
        'Thinking aloud produces intermediate tokens',
        'These tokens become context, literally shifting the probability distribution',
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
    type: 'tokenizer',
    title: 'Token Counter',
    sectionNumber: '01',
    sectionTitle: 'Foundations',
  },
  {
    id: 7,
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
  { id: 8, type: 'section', number: '02', title: 'Context' },
  {
    id: 9,
    type: 'context-graph',
    title: 'Context Window Comparison',
    sectionNumber: '02',
    sectionTitle: 'Context',
  },
  {
    id: 10,
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
    id: 11,
    type: 'lost-middle',
    title: 'Lost in the Middle',
    sectionNumber: '02',
    sectionTitle: 'Context',
  },
  {
    id: 12,
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
    id: 13,
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
    id: 14,
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
    id: 15,
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
  { id: 16, type: 'section', number: '03', title: 'Building Agents' },
  {
    id: 17,
    type: 'content',
    title: 'Agent Architecture',
    content: 'Designing robust and reliable AI agents.',
    sectionNumber: '03',
    sectionTitle: 'Building Agents',
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
