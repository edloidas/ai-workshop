import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

interface LLMDemoSlideProps {
  title: string;
  sectionNumber?: string;
  sectionTitle?: string;
}

type Stage = 'tokens' | 'embed' | 'probs' | 'sample';

interface DemoStep {
  input: string;
  tokens: string[];
  probabilities: { token: string; prob: number }[];
  sample: string;
}

const DEMO_SEQUENCE: DemoStep[] = [
  {
    input: 'The capital of France is',
    tokens: ['The', ' capital', ' of', ' France', ' is'],
    probabilities: [
      { token: 'Paris', prob: 0.92 },
      { token: 'Lyon', prob: 0.03 },
      { token: 'a', prob: 0.02 },
      { token: 'the', prob: 0.01 },
      { token: '...', prob: 0.02 },
    ],
    sample: ' Paris',
  },
  {
    input: 'The capital of France is Paris',
    tokens: ['The', ' capital', ' of', ' France', ' is', ' Paris'],
    probabilities: [
      { token: '.', prob: 0.85 },
      { token: ',', prob: 0.08 },
      { token: '!', prob: 0.03 },
      { token: ' and', prob: 0.02 },
      { token: '...', prob: 0.02 },
    ],
    sample: '.',
  },
];

const STAGES: Stage[] = ['tokens', 'embed', 'probs', 'sample'];

// ? Use cycling colors for visual variety (same as TokenizerSlide)
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

// * Tokens Stage Component

function TokensStage({ tokens }: { tokens: string[] }) {
  return (
    <motion.div
      className="flex h-full w-full flex-col items-center p-4"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-xs font-medium uppercase tracking-wider text-muted">Tokens</div>
      <div className="flex flex-1 flex-col items-center justify-center gap-1">
        {tokens.map((token, index) => (
          <motion.span
            key={`${index}-${token}`}
            className={`whitespace-pre rounded px-2 py-0.5 font-mono text-xs ${getTokenColor(index)}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
          >
            {token}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

// * Embeddings Stage Component

function EmbedStage() {
  const dotCount = 15;
  const dots = Array.from({ length: dotCount }, (_, i) => i);

  return (
    <motion.div
      className="flex h-full w-full flex-col items-center p-4"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-xs font-medium uppercase tracking-wider text-muted">Embeddings</div>
      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <div className="grid grid-cols-5 gap-1.5">
          {dots.map((i) => (
            <motion.div
              key={i}
              className="size-2.5 rounded-full bg-accent"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 1, 0.6],
              }}
              transition={{
                delay: i * 0.03,
                duration: 0.6,
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
            />
          ))}
        </div>
        <div className="font-mono text-[10px] text-muted/60">[0.12, -0.34, ...]</div>
      </div>
    </motion.div>
  );
}

// * Probabilities Stage Component

function ProbsStage({ probabilities }: { probabilities: { token: string; prob: number }[] }) {
  return (
    <motion.div
      className="flex h-full w-full flex-col items-center p-4"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-xs font-medium uppercase tracking-wider text-muted">Probabilities</div>
      <div className="flex flex-1 flex-col justify-center gap-1.5">
        {probabilities.map((item, index) => (
          <div key={item.token} className="flex w-full items-center gap-1.5">
            <span className="w-10 shrink-0 text-right font-mono text-[10px] text-muted">
              {item.token}
            </span>
            <div className="relative h-3 w-14 shrink-0 overflow-hidden rounded bg-warm-gray">
              <motion.div
                className={`absolute inset-y-0 left-0 rounded ${index === 0 ? 'bg-accent' : 'bg-muted/40'}`}
                initial={{ width: 0 }}
                animate={{ width: `${item.prob * 100}%` }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
              />
            </div>
            <span className="w-8 shrink-0 font-mono text-[10px] text-muted">
              {Math.round(item.prob * 100)}%
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// * Sample Stage Component

function SampleStage({ token }: { token: string }) {
  return (
    <motion.div
      className="flex h-full w-full flex-col items-center p-4"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-xs font-medium uppercase tracking-wider text-muted">Sample</div>
      <div className="flex flex-1 items-center justify-center">
        <motion.div
          className="rounded-lg bg-accent/20 px-4 py-3"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <motion.span
            className="whitespace-pre font-mono text-base font-bold text-accent"
            animate={{
              textShadow: [
                '0 0 10px var(--color-accent)',
                '0 0 20px var(--color-accent)',
                '0 0 10px var(--color-accent)',
              ],
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            → "{token}"
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}

// * Arrow Component

function StageArrow() {
  return <div className="flex items-center justify-center px-2 text-2xl text-muted/40">→</div>;
}

export function LLMDemoSlide({ title, sectionNumber, sectionTitle }: LLMDemoSlideProps) {
  const [stage, setStage] = useState<Stage>('tokens');
  const [iteration, setIteration] = useState(0);
  const [generatedText, setGeneratedText] = useState(DEMO_SEQUENCE[0].input);
  const [isFinished, setIsFinished] = useState(false);

  const currentStep = DEMO_SEQUENCE[iteration];
  const stageIndex = STAGES.indexOf(stage);

  const resetDemo = useCallback(() => {
    setStage('tokens');
    setIteration(0);
    setGeneratedText(DEMO_SEQUENCE[0].input);
    setIsFinished(false);
  }, []);

  // * Auto-advance through stages
  useEffect(() => {
    if (isFinished) return;

    const stageTiming: Record<Stage, number> = {
      tokens: 2000,
      embed: 1700,
      probs: 2500,
      sample: 2500,
    };

    const timer = setTimeout(() => {
      const currentIndex = STAGES.indexOf(stage);

      if (currentIndex < STAGES.length - 1) {
        setStage(STAGES[currentIndex + 1]);
      } else {
        // After sample, update generated text and move to next iteration
        const newText = generatedText + currentStep.sample;
        setGeneratedText(newText);

        if (iteration < DEMO_SEQUENCE.length - 1) {
          setIteration((prev) => prev + 1);
          setStage('tokens');
        } else {
          // Animation complete - stop and wait for click
          setIsFinished(true);
        }
      }
    }, stageTiming[stage]);

    return () => clearTimeout(timer);
  }, [stage, iteration, generatedText, currentStep.sample, isFinished]);

  // * Click to restart
  const handleClick = useCallback(() => {
    if (isFinished) {
      resetDemo();
    }
  }, [isFinished, resetDemo]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className={`flex h-full w-full flex-col bg-charcoal px-24 py-16 ${isFinished ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
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
        className="mt-8 flex flex-1 flex-col gap-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.17, duration: 0.35 }}
      >
        {/* Input display */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium uppercase tracking-wider text-muted">Input:</span>
          <span className="font-mono text-lg text-main">"{currentStep.input}"</span>
        </div>

        {/* Stage pipeline visualization */}
        <div className="flex flex-1 items-center justify-center gap-4">
          {/* Tokens box */}
          <div
            className={`flex h-52 w-36 flex-col overflow-hidden rounded-lg border-2 transition-colors duration-300 ${
              stageIndex >= 0
                ? 'border-accent/60 bg-warm-gray/30'
                : 'border-warm-gray bg-warm-gray/10'
            }`}
          >
            <AnimatePresence mode="wait">
              {stageIndex >= 0 && <TokensStage key="tokens" tokens={currentStep.tokens} />}
            </AnimatePresence>
          </div>

          <StageArrow />

          {/* Embed box */}
          <div
            className={`flex h-52 w-36 flex-col overflow-hidden rounded-lg border-2 transition-colors duration-300 ${
              stageIndex >= 1
                ? 'border-accent/60 bg-warm-gray/30'
                : 'border-warm-gray bg-warm-gray/10'
            }`}
          >
            <AnimatePresence mode="wait">
              {stageIndex >= 1 && <EmbedStage key="embed" />}
            </AnimatePresence>
          </div>

          <StageArrow />

          {/* Probs box */}
          <div
            className={`flex h-52 w-44 flex-col overflow-hidden rounded-lg border-2 transition-colors duration-300 ${
              stageIndex >= 2
                ? 'border-accent/60 bg-warm-gray/30'
                : 'border-warm-gray bg-warm-gray/10'
            }`}
          >
            <AnimatePresence mode="wait">
              {stageIndex >= 2 && (
                <ProbsStage key="probs" probabilities={currentStep.probabilities} />
              )}
            </AnimatePresence>
          </div>

          <StageArrow />

          {/* Sample box */}
          <div
            className={`flex h-52 w-36 flex-col overflow-hidden rounded-lg border-2 transition-colors duration-300 ${
              stageIndex >= 3
                ? 'border-accent/60 bg-warm-gray/30'
                : 'border-warm-gray bg-warm-gray/10'
            }`}
          >
            <AnimatePresence mode="wait">
              {stageIndex >= 3 && <SampleStage key="sample" token={currentStep.sample} />}
            </AnimatePresence>
          </div>
        </div>

        {/* Result display */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium uppercase tracking-wider text-muted">Result:</span>
          <span className="font-mono text-lg text-main">
            "{generatedText}
            {stage === 'sample' && !isFinished && (
              <motion.span
                className="text-accent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {currentStep.sample}
              </motion.span>
            )}
            "
          </span>
        </div>

        {/* Stage indicator */}
        <div className="flex items-center justify-center gap-4 text-sm text-muted">
          <span>
            Stage {stageIndex + 1}/4 · Iteration {iteration + 1}/{DEMO_SEQUENCE.length}
          </span>
          {isFinished && <span className="text-accent">Click to restart</span>}
        </div>
      </motion.div>
    </motion.div>
  );
}
