import { useMemo, useState } from "react";
import { Activity, Scale } from "lucide-react";
import ProgressChart from "../components/dashboard/ProgressChart.jsx";
import { mockWeightRecords } from "../data/mockRoutines.js";
import useLocalStorage from "../hooks/useLocalStorage.js";

const FILTERS = [
  { label: "1 mes", days: 30 },
  { label: "3 meses", days: 90 },
  { label: "1 año", days: 365 },
];

export default function MyProgress() {
  const [period, setPeriod] = useState(90);
  const [weights] = useLocalStorage("fitzone-demo-weights", mockWeightRecords);
  const [workouts] = useLocalStorage("fitzone-demo-workouts", []);
  const [loads] = useLocalStorage("fitzone-demo-exercise-loads", []);
  const [exerciseId, setExerciseId] = useState("");
  const threshold = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - period);
    return dateISO(date);
  }, [period]);

  const weightData = useMemo(
    () =>
      weights
        .filter((record) => record.date >= threshold)
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((record) => ({ label: shortDate(record.date), weight: Number(record.weight) })),
    [threshold, weights],
  );
  const workoutData = useMemo(
    () =>
      workouts
        .filter((workout) => workout.status === "completed" && workout.date >= threshold)
        .reduce((weeks, workout) => {
          const date = new Date(`${workout.date}T12:00:00`);
          date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
          const week = dateISO(date);
          const current = weeks.find((item) => item.key === week);
          if (current) current.trainings += 1;
          else weeks.push({ key: week, label: shortDate(week), trainings: 1 });
          return weeks;
        }, [])
        .sort((a, b) => a.key.localeCompare(b.key)),
    [threshold, workouts],
  );
  const exercises = useMemo(
    () => [...new Map(loads.map((item) => [item.exerciseId, { id: item.exerciseId, name: item.exercise }])).values()],
    [loads],
  );
  const selectedExercise = exercises.find((item) => item.id === exerciseId) || exercises[0];
  const loadData = selectedExercise
    ? loads
        .filter((item) => item.exerciseId === selectedExercise.id && item.date >= threshold)
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((item) => ({ label: shortDate(item.date), load: Number(item.load) }))
    : [];

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Tu recorrido</p>
          <h1 className="display-font mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Mi progreso</h1>
          <p className="mt-2 text-sm text-white/50">Visualiza tus propios registros a lo largo del tiempo.</p>
        </div>
        <div className="flex gap-2" aria-label="Filtrar periodo">
          {FILTERS.map((filter) => (
            <button
              key={filter.days}
              type="button"
              aria-pressed={period === filter.days}
              onClick={() => setPeriod(filter.days)}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                period === filter.days ? "bg-neon text-ink" : "border border-white/10 bg-card text-white/55 hover:text-white"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        <ProgressChart
          title="Evolución del peso"
          data={weightData}
          dataKey="weight"
          unit="kg"
          emptyMessage="No hay registros de peso en este periodo. Puedes añadirlos desde Mi peso."
        />
        <ProgressChart
          title="Entrenamientos por semana"
          data={workoutData}
          dataKey="trainings"
          unit="sesiones"
          type="bar"
          emptyMessage="Todavía no hay sesiones completadas en este periodo."
        />
      </div>

      <section className="rounded-xl border border-white/[0.08] bg-card p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon"><Activity size={19} aria-hidden="true" /></span>
            <div>
              <h2 className="font-semibold">Evolución de cargas</h2>
              <p className="mt-1 text-xs text-white/45">Solo se muestran los pesos registrados en tus rutinas.</p>
            </div>
          </div>
          {exercises.length > 0 && (
            <label className="text-xs text-white/50">
              <span className="sr-only">Seleccionar ejercicio</span>
              <select
                value={selectedExercise?.id || ""}
                onChange={(event) => setExerciseId(event.target.value)}
                className="h-10 min-w-48 rounded-lg border border-white/10 bg-[#111111] px-3 text-sm text-white"
              >
                {exercises.map((exercise) => <option key={exercise.id} value={exercise.id}>{exercise.name}</option>)}
              </select>
            </label>
          )}
        </div>
        <div className="mt-5">
          {selectedExercise ? (
            <ProgressChart title={selectedExercise.name} data={loadData} dataKey="load" unit="kg" emptyMessage="No hay cargas registradas para este ejercicio en el periodo." />
          ) : (
            <div className="flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed border-white/10 text-center">
              <Scale size={24} className="text-white/30" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium">Aún no hay cargas registradas</p>
              <p className="mt-1 text-xs text-white/45">Registra el peso levantado en Mis rutinas para ver su evolución.</p>
            </div>
          )}
        </div>
      </section>
      <p className="text-xs leading-5 text-white/35">Los gráficos representan únicamente los registros locales de esta demo y no evalúan objetivos de salud.</p>
    </div>
  );
}

function dateISO(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function shortDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("es-CL", { day: "numeric", month: "short" });
}
