import { AnimatePresence } from 'framer-motion';
import { useCallback, useState } from 'react';
import { NavDots } from './components/NavDots';
import { ProgressBar } from './components/ProgressBar';
import { SlideCounter } from './components/SlideCounter';
import { ContentSlide } from './components/slides/ContentSlide';
import { CoverSlide } from './components/slides/CoverSlide';
import { LLMDemoSlide } from './components/slides/LLMDemoSlide';
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
  | { id: number; type: 'llm-demo'; title: string; sectionNumber?: string; sectionTitle?: string };

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
    content:
      'LLMs are statistical pattern matchers — understanding this unlocks better prompting strategies.',
    sectionNumber: '01',
    sectionTitle: 'Foundations',
  },
  { id: 8, type: 'section', number: '02', title: 'Tools & APIs' },
  {
    id: 9,
    type: 'content',
    title: 'Function Calling',
    content: 'How AI agents interact with external systems.',
    sectionNumber: '02',
    sectionTitle: 'Tools & APIs',
  },
  { id: 10, type: 'section', number: '03', title: 'Building Agents' },
  {
    id: 11,
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
