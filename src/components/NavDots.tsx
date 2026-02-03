import { motion } from 'framer-motion';

interface NavDotsProps {
  current: number;
  total: number;
  onNavigate: (index: number) => void;
}

export function NavDots({ current, total, onNavigate }: NavDotsProps) {
  return (
    <div className="fixed top-1/2 right-6 z-10 flex -translate-y-1/2 flex-col gap-1.5">
      {Array.from({ length: total }, (_, index) => {
        const dotId = `nav-dot-${index}`;
        return (
          <button
            key={dotId}
            type="button"
            onClick={() => onNavigate(index)}
            className="group relative flex h-2 w-2 items-center justify-center outline-none cursor-pointer"
            aria-label={`Go to slide ${index + 1}`}
          >
            <motion.div
              className="h-1.5 w-1.5 rounded-full"
              initial={false}
              animate={{
                scale: current === index ? 1.33 : 1,
                backgroundColor: current === index ? '#D97757' : '#3D3D3D',
              }}
              whileHover={{
                scale: 1.5,
                backgroundColor: current === index ? '#D97757' : '#7BC4B5',
              }}
              transition={{ duration: 0.1 }}
            />
          </button>
        );
      })}
    </div>
  );
}
