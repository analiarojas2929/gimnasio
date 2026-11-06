import { useState } from "react";
import { Dumbbell, Info } from "lucide-react";
import ExerciseCard from "../components/dashboard/ExerciseCard.jsx";
import { mockRoutines } from "../data/mockRoutines.js";
import useLocalStorage from "../hooks/useLocalStorage.js";

const routineDateKey = (dayIndex) => {
  const date = new Date();
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7) + dayIndex);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

export default function MyRoutines() {
  const initialDay = (new Date().getDay() + 6) % 7;
  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [progress, setProgress] = useLocalStorage("fitzone-demo-routine-progress", {});
  const [loads, setLoads] = useLocalStorage("fitzone-demo-exercise-loads", []);
  const routine = mockRoutines[selectedDay];
  const key = routineDateKey(selectedDay);
  const today = progress[key] || {};
  const completedCount = routine.exercises.filter((exercise) => today[exercise.id]?.completed).length;
  const percent = Math.round((completedCount / routine.exercises.length) * 100);

  function toggleExercise(exerciseId) {
    setProgress((current) => ({
      ...current,
      [key]: {
        ...current[key],
        [exerciseId]: { ...current[key]?.[exerciseId], completed: !current[key]?.[exerciseId]?.completed },
      },
    }));
  }

  function updateLoad(exercise, value) {
    setProgress((current) => ({
      ...current,
      [key]: {
        ...current[key],
        [exercise.id]: { ...current[key]?.[exercise.id], load: value },
      },
    }));
    const amount = Number(value);
    setLoads((current) => {
      const withoutCurrent = current.filter((entry) => !(entry.exerciseId === exercise.id && entry.date === key));
      return value !== "" && Number.isFinite(amount) && amount > 0
        ? [...withoutCurrent, { exerciseId: exercise.id, exercise: exercise.name, date: key, load: amount }]
        : withoutCurrent;
    });
  }

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Plan de ejemplo</p>
          <h1 className="display-font mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Mis rutinas</h1>
          <p className="mt-2 text-sm text-white/50">Organiza tu entrenamiento y registra lo que quieras seguir.</p>
        </div>
        <div className="w-full max-w-56">
          <div className="mb-2 flex justify-between text-xs text-white/50">
            <span>Rutina del día</span><span>{percent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-neon transition-all" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </section>

      <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Días de rutina">
        {mockRoutines.map((item, index) => (
          <button
            key={item.day}
            type="button"
            role="tab"
            aria-selected={selectedDay === index}
            onClick={() => setSelectedDay(index)}
            className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              selectedDay === index ? "bg-neon text-ink" : "border border-white/10 bg-card text-white/60 hover:text-white"
            }`}
          >
            {item.day}
          </button>
        ))}
      </div>

      <section className="rounded-xl border border-white/[0.08] bg-card p-5 sm:p-6">
        <div className="flex items-center gap-3 border-b border-white/[0.08] pb-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-neon/10 text-neon"><Dumbbell size={20} aria-hidden="true" /></span>
          <div>
            <h2 className="font-semibold">{routine.day} · {routine.focus}</h2>
            <p className="mt-1 text-xs text-white/45">{routine.exercises.length} ejercicios sugeridos · rutina editable de ejemplo</p>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          {routine.exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              completed={Boolean(today[exercise.id]?.completed)}
              load={today[exercise.id]?.load ?? ""}
              onToggle={() => toggleExercise(exercise.id)}
              onLoadChange={(value) => updateLoad(exercise, value)}
            />
          ))}
        </div>
        <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-white/40">
          <Info size={15} className="mt-0.5 shrink-0 text-neon" aria-hidden="true" />
          Contenido ilustrativo para organizar tu actividad. Ajusta la rutina según tus preferencias y consulta a un profesional si lo necesitas.
        </p>
      </section>
    </div>
  );
}
