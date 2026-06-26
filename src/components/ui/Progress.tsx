interface ProgressProps {
  total: number;
  current: number; // 1-based current step
}

export default function Progress({ total, current }: ProgressProps) {
  return (
    <div className="flex gap-2 mb-7">
      {Array.from({ length: total }).map((_, i) => {
        const step = i + 1;
        const isDone   = step < current;
        const isActive = step === current;
        return (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-400 ${
              isDone   ? "w-3 bg-sky-500"
            : isActive ? "w-8 bg-gradient-to-r from-sky-500 to-cyan-400"
            :             "w-3 bg-sky-200"
            }`}
          />
        );
      })}
    </div>
  );
}
