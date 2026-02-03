import { AnimatePresence } from 'framer-motion';
import { useCallback, useState } from 'react';
import { NavDots } from './components/NavDots';
import { ProgressBar } from './components/ProgressBar';
import { SlideCounter } from './components/SlideCounter';
import { ContentSlide } from './components/slides/ContentSlide';
import { CoverSlide } from './components/slides/CoverSlide';
import { SectionSlide } from './components/slides/SectionSlide';
import { useSlideNavigation } from './hooks/useSlideNavigation';

type SlideData =
  | { id: number; type: 'cover'; title: string; subtitle?: string }
  | { id: number; type: 'section'; number: string; title: string }
  | { id: number; type: 'content'; title: string; content: string };

const slides: SlideData[] = [
  { id: 1, type: 'cover', title: 'AI Agents', subtitle: 'for Developers' },
  { id: 2, type: 'section', number: '01', title: 'Foundations' },
  {
    id: 3,
    type: 'content',
    title: 'Tokens & Context',
    content: 'Understanding the building blocks of AI language models.',
  },
  { id: 4, type: 'section', number: '02', title: 'Tools & APIs' },
  {
    id: 5,
    type: 'content',
    title: 'Function Calling',
    content: 'How AI agents interact with external systems.',
  },
  { id: 6, type: 'section', number: '03', title: 'Building Agents' },
  {
    id: 7,
    type: 'content',
    title: 'Agent Architecture',
    content: 'Designing robust and reliable AI agents.',
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
        <ContentSlide key={slide.id} title={slide.title}>
          {slide.content}
        </ContentSlide>
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
