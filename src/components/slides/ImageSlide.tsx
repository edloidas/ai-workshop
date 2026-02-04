import { motion } from 'framer-motion';

interface ImageSlideProps {
  title: string;
  imageSrc: string;
  imageAlt?: string;
  sectionNumber?: string;
  sectionTitle?: string;
}

export function ImageSlide({
  title,
  imageSrc,
  imageAlt,
  sectionNumber,
  sectionTitle,
}: ImageSlideProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="flex h-full w-full flex-col items-center justify-center bg-charcoal px-24 py-16"
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
        className="mb-8 font-sans text-5xl font-semibold text-main"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.07, duration: 0.35 }}
      >
        {title}
      </motion.h2>
      <motion.img
        src={imageSrc}
        alt={imageAlt ?? title}
        className="max-h-[60vh] max-w-full rounded-lg object-contain"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.17, duration: 0.35 }}
      />
    </motion.div>
  );
}
