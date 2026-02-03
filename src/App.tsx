import { AnimatePresence } from 'framer-motion';
import { useCallback, useState } from 'react';
import { NavDots } from './components/NavDots';
import { ProgressBar } from './components/ProgressBar';
import { SlideCounter } from './components/SlideCounter';
import { ContentSlide } from './components/slides/ContentSlide';
import { CoverSlide } from './components/slides/CoverSlide';
import { SectionSlide } from './components/slides/SectionSlide';
import { TokenizerSlide } from './components/slides/TokenizerSlide';
import { useSlideNavigation } from './hooks/useSlideNavigation';

type SlideData =
  | { id: number; type: 'cover'; title: string; subtitle?: string }
  | { id: number; type: 'section'; number: string; title: string }
  | {
      id: number;
      type: 'content';
      title: string;
      content: string;
      sectionNumber?: string;
      sectionTitle?: string;
    }
  | { id: number; type: 'tokenizer'; title: string; sectionNumber?: string; sectionTitle?: string };

const slides: SlideData[] = [
  { id: 1, type: 'cover', title: 'AI Agents', subtitle: 'for Developers' },
  { id: 2, type: 'section', number: '01', title: 'Foundations' },
  {
    id: 3,
    type: 'content',
    title: 'Tokens & Context',
    content: 'Understanding the building blocks of AI language models.',
    sectionNumber: '01',
    sectionTitle: 'Foundations',
  },
  {
    id: 4,
    type: 'tokenizer',
    title: 'Token Counter',
    sectionNumber: '01',
    sectionTitle: 'Foundations',
  },
  { id: 5, type: 'section', number: '02', title: 'Tools & APIs' },
  {
    id: 6,
    type: 'content',
    title: 'Function Calling',
    content: 'How AI agents interact with external systems.',
    sectionNumber: '02',
    sectionTitle: 'Tools & APIs',
  },
  { id: 7, type: 'section', number: '03', title: 'Building Agents' },
  {
    id: 8,
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
