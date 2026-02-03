import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Slide from './components/Slide';

const slides = [
  {
    id: 1,
    title: 'Welcome',
    content: 'AI Workshop - Interactive Presentation',
  },
  { id: 2, title: 'Introduction', content: 'Getting started with AI' },
  { id: 3, title: 'Summary', content: 'Thank you!' },
];

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-linear-to-br from-slate-900 to-slate-800">
      <AnimatePresence mode="wait">
        <Slide key={slides[currentSlide].id} slide={slides[currentSlide]} />
      </AnimatePresence>

      <div className="absolute bottom-8 flex gap-4">
        <button
          type="button"
          onClick={prevSlide}
          className="rounded-lg bg-white/10 px-6 py-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={nextSlide}
          className="rounded-lg bg-white/10 px-6 py-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          Next
        </button>
      </div>

      <div className="absolute bottom-8 right-8 text-white/50">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
}
