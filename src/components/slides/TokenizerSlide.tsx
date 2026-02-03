import { motion } from 'framer-motion';
import { decode, encode } from 'gpt-tokenizer';
import { useState } from 'react';

interface TokenizerSlideProps {
  title: string;
  sectionNumber?: string;
  sectionTitle?: string;
}

export function TokenizerSlide({ title, sectionNumber, sectionTitle }: TokenizerSlideProps) {
  const [text, setText] = useState(
    'Hello, world! This is a tokenizer demo. Try typing something to see how text is split into tokens.',
  );

  const tokens = encode(text);
  const tokenCount = tokens.length;

  // ? Use cycling colors for visual variety
  const TOKEN_COLORS = [
    'bg-teal/20 text-teal',
    'bg-accent/20 text-accent',
    'bg-purple/20 text-purple',
    'bg-blue/20 text-blue',
    'bg-yellow/20 text-yellow',
    'bg-pink/20 text-pink',
  ];

  const getTokenColor = (index: number) => {
    return TOKEN_COLORS[index % TOKEN_COLORS.length];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="flex h-full w-full flex-col bg-charcoal px-24 py-16"
    >
      {sectionNumber && sectionTitle && (
        <motion.div
          className="mb-4 flex items-center gap-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0, duration: 0.35 }}
        >
          <span className="flex h-8 w-8 items-center justify-center bg-accent font-mono text-sm font-medium text-charcoal">
            {sectionNumber}
          </span>
          <span className="font-sans text-lg text-muted">{sectionTitle}</span>
        </motion.div>
      )}
      <motion.h2
        className="font-sans text-5xl font-semibold text-main"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.07, duration: 0.35 }}
      >
        {title}
      </motion.h2>

      <motion.div
        className="mt-12 flex flex-1 flex-col gap-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.17, duration: 0.35 }}
      >
        <textarea
          spellCheck={false}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.stopPropagation()}
          className="h-40 w-full resize-none rounded-lg border border-warm-gray bg-warm-gray/50 p-4 font-mono text-lg text-main placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="Type something to see tokens..."
        />

        <motion.div
          className="font-sans text-3xl text-muted"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.27, duration: 0.35 }}
        >
          <span className="font-bold text-accent">{tokenCount}</span>{' '}
          {tokenCount === 1 ? 'token' : 'tokens'}
        </motion.div>

        <motion.div
          className="flex flex-wrap gap-1 overflow-y-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.37, duration: 0.35 }}
        >
          {tokens.map((tokenId, index) => {
            const tokenText = decode([tokenId]);
            return (
              <span
                key={`${index}-${tokenId}`}
                className={`whitespace-pre rounded-md px-1.25 py-0.25 font-mono text-sm ${getTokenColor(index)}`}
              >
                {tokenText}
              </span>
            );
          })}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
