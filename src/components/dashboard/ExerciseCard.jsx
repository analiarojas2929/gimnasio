import { Check, Dumbbell } from "lucide-react";

export default function ExerciseCard({
  exercise,
  completed,
  load,
  onToggle,
  onLoadChange,
}) {
  return (
    <article className="flex flex-col gap-4 rounded-lg border border-white/[0.08] bg-[#111111] p-4 sm:flex-row sm:items-center">
      <button
        type="button"
        onClick={onToggle}
        aria-label={`${completed ? "Desmarcar" : "Marcar"} ${exercise.name} como completado`}
        aria-pressed={completed}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded border transition-colors ${
          completed
            ? "border-neon bg-neon text-ink"
            : "border-white/25 text-transparent hover:border-neon"
        }`}
      >
        <Check size={15} aria-hidden="true" />
      </button>
      <div className="min-w-0 flex-1">
        <h3 className={`font-semibold ${completed ? "text-white/50 line-through" : "text-white"}`}>
          {exercise.name}
        </h3>
        <p className="mt-1 text-xs text-white/45">
          {exercise.sets} series <span className="px-1">·</span> {exercise.reps} reps
          <span className="px-1">·</span> Descanso {exercise.rest}
        </p>
      </div>
      <label className="flex items-center gap-2 text-xs text-white/50">
        <Dumbbell size={15} className="text-neon" aria-hidden="true" />
        <span className="sr-only">Peso levantado en kg para {exercise.name}</span>
        <input
          type="number"
          min="0"
          step="0.5"
          inputMode="decimal"
          placeholder="kg"
          value={load ?? ""}
          onChange={(event) => onLoadChange(event.target.value)}
          className="h-9 w-20 rounded border border-white/10 bg-ink px-2 text-sm text-white placeholder:text-white/35"
        />
        kg
      </label>
    </article>
  );
}
