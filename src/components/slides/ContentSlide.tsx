import {motion} from 'framer-motion';
import type {ReactNode} from 'react';

type ContentItem = string | string[];
type SlideContent = string | ContentItem[];

interface ContentSlideProps {
  title: string;
  children?: SlideContent;
  sectionNumber?: string;
  sectionTitle?: string;
}

function parseInlineMarkdown(text: string): ReactNode {
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  // Combined regex for all inline patterns
  const regex = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`(.+?)`)|(\[(.+?)\]\((.+?)\))/g;
  let match = regex.exec(text);

  while (match !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      // Bold: **text**
      parts.push(
        <strong key={match.index} className="font-semibold text-main">
          {match[2]}
        </strong>,
      );
    } else if (match[3]) {
      // Italic: *text*
      parts.push(<em key={match.index}>{match[4]}</em>);
    } else if (match[5]) {
      // Code: `code`
      parts.push(
        <code
          key={match.index}
          className="rounded bg-warm-gray px-1.5 py-0.5 font-mono text-[0.9em] text-accent"
        >
          {match[6]}
        </code>,
      );
    } else if (match[7]) {
      // Link: [text](url)
      parts.push(
        <a
          key={match.index}
          href={match[9]}
          className="text-accent underline underline-offset-2 hover:text-main"
          target="_blank"
          rel="noopener noreferrer"
        >
          {match[8]}
        </a>,
      );
    }

    lastIndex = match.index + match[0].length;
    match = regex.exec(text);
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts;
}

function renderContent(content: SlideContent | undefined): ReactNode {
  if (!content) return null;
  if (typeof content === 'string') return parseInlineMarkdown(content);

  return (
    <ul className="list-disc space-y-3 pl-6">
      {content.map((item) =>
        typeof item === 'string' ? (
          <li key={item}>{parseInlineMarkdown(item)}</li>
        ) : (
          <li key={item.join('-')}>
            <span>{parseInlineMarkdown(item.at(0) ?? '')}</span>
            <ul className="mt-2 list-[circle] space-y-2 pl-6">
              {item.slice(1).map((subitem) => (
                <li key={subitem}>{parseInlineMarkdown(subitem)}</li>
              ))}
            </ul>
          </li>
        ),
      )}
    </ul>
  );
}

export function ContentSlide({ title, children, sectionNumber, sectionTitle }: ContentSlideProps) {
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
        className="font-sans text-5xl font-semibold text-main"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.07, duration: 0.35 }}
      >
        {title}
      </motion.h2>
      <motion.div
        className="mt-12 flex-1 font-sans text-2xl leading-relaxed text-muted"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.17, duration: 0.35 }}
      >
        {renderContent(children)}
      </motion.div>
    </motion.div>
  );
}
