import { motion } from 'framer-motion';

interface SlideProps {
  slide: {
    id: number;
    title: string;
    content: string;
  };
}

export default function Slide({ slide }: SlideProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.05, y: -20 }}
      transition={{
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="flex flex-col items-center justify-center text-center"
    >
      <h1 className="mb-4 text-6xl font-bold text-white">{slide.title}</h1>
      <p className="text-2xl text-white/70">{slide.content}</p>
    </motion.div>
  );
}
