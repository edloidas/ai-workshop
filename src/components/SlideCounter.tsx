interface SlideCounterProps {
  current: number;
  total: number;
}

export function SlideCounter({ current, total }: SlideCounterProps) {
  return (
    <div className="fixed bottom-4 left-6 font-mono text-sm text-muted">
      {String(current + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
    </div>
  );
}
