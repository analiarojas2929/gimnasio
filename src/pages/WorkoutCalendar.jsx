import { useMemo, useState } from "react";
import { CalendarDays, Check, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { getInitialWorkoutSchedule } from "../data/mockRoutines.js";
import useLocalStorage from "../hooks/useLocalStorage.js";

const todayISO = () => dateISO(new Date());
const newPlan = () => ({ date: todayISO(), activity: "", type: "Musculación" });
const weekdayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export default function WorkoutCalendar() {
  const [workouts, setWorkouts] = useLocalStorage("fitzone-demo-workouts", getInitialWorkoutSchedule());
  const [month, setMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [form, setForm] = useState(newPlan);
  const [error, setError] = useState("");
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const monthLabel = month.toLocaleDateString("es-CL", { month: "long", year: "numeric" });
  const cells = useMemo(() => {
    const first = new Date(year, monthIndex, 1);
    const offset = (first.getDay() + 6) % 7;
    const count = new Date(year, monthIndex + 1, 0).getDate();
    return [
      ...Array.from({ length: offset }, (_, index) => ({ key: `blank-${index}` })),
      ...Array.from({ length: count }, (_, index) => {
        const day = index + 1;
        return { key: `${year}-${monthIndex}-${day}`, day, date: dateISO(new Date(year, monthIndex, day)) };
      }),
    ];
  }, [monthIndex, year]);
  const selectedWorkouts = workouts
    .filter((workout) => workout.date === selectedDate)
    .sort((a, b) => a.activity.localeCompare(b.activity));

  function moveMonth(amount) {
    const next = new Date(year, monthIndex + amount, 1);
    setMonth(next);
    setSelectedDate(dateISO(next));
  }

  function addPlan(event) {
    event.preventDefault();
    if (!form.date || !form.activity.trim() || form.activity.trim().length < 2) {
      setError("Ingresa una actividad y una fecha válida.");
      return;
    }
    setWorkouts((current) => [
      ...current,
      { id: crypto.randomUUID(), date: form.date, activity: form.activity.trim(), type: form.type, status: "planned" },
    ]);
    setSelectedDate(form.date);
    setMonth(new Date(`${form.date}T12:00:00`));
    setForm(newPlan());
    setError("");
  }

  function toggleWorkout(id) {
    setWorkouts((current) =>
      current.map((workout) =>
        workout.id === id
          ? { ...workout, status: workout.status === "completed" ? "planned" : "completed" }
          : workout,
      ),
    );
  }

  function deleteWorkout(id) {
    setWorkouts((current) => current.filter((workout) => workout.id !== id));
  }

  return (
    <div className="space-y-7">
      <section>
        <p className="eyebrow">Planifica tu semana</p>
        <h1 className="display-font mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Calendario</h1>
        <p className="mt-2 text-sm text-white/50">Organiza tus sesiones y marca las que ya realizaste.</p>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border border-white/[0.08] bg-card p-4 sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-white/45">Calendario de entrenamientos</p>
              <h2 className="display-font mt-1 text-xl font-bold capitalize">{monthLabel}</h2>
            </div>
            <div className="flex gap-2">
              <button type="button" aria-label="Mes anterior" onClick={() => moveMonth(-1)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/70 hover:text-neon"><ChevronLeft size={17} /></button>
              <button type="button" aria-label="Mes siguiente" onClick={() => moveMonth(1)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/70 hover:text-neon"><ChevronRight size={17} /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {weekdayNames.map((day) => <div key={day} className="pb-2 text-[0.65rem] font-semibold uppercase tracking-wide text-white/35">{day}</div>)}
            {cells.map((cell) => {
              if (!cell.day) return <div key={cell.key} />;
              const dayWorkouts = workouts.filter((workout) => workout.date === cell.date);
              const isSelected = selectedDate === cell.date;
              const isToday = todayISO() === cell.date;
              const completed = dayWorkouts.some((workout) => workout.status === "completed");
              return (
                <button
                  key={cell.key}
                  type="button"
                  aria-label={`${cell.day} de ${monthLabel}${dayWorkouts.length ? `, ${dayWorkouts.length} entrenamientos` : ""}`}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedDate(cell.date)}
                  className={`relative mx-auto flex aspect-square w-full max-w-12 flex-col items-center justify-center rounded-lg text-sm transition-colors ${
                    isSelected ? "bg-neon font-bold text-ink" : isToday ? "border border-neon/50 text-neon" : "text-white/75 hover:bg-white/[0.06]"
                  }`}
                >
                  {cell.day}
                  {dayWorkouts.length > 0 && (
                    <span className={`absolute bottom-1 h-1 w-1 rounded-full ${isSelected ? "bg-ink" : completed ? "bg-neon" : "bg-white/50"}`} />
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-5 flex flex-wrap gap-4 border-t border-white/[0.08] pt-4 text-xs text-white/45">
            <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-white/50" /> Planificado</span>
            <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-neon" /> Completado</span>
          </div>
          <div className="mt-6 border-t border-white/[0.08] pt-5">
            <h3 className="text-sm font-semibold">Sesiones · {formatDate(selectedDate)}</h3>
            {selectedWorkouts.length ? (
              <ul className="mt-3 space-y-2">
                {selectedWorkouts.map((workout) => (
                  <li key={workout.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-white/[0.08] bg-[#111111] p-3">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${workout.status === "completed" ? "bg-neon/10 text-neon" : "bg-white/[0.06] text-white/50"}`}>
                      {workout.status === "completed" ? <Check size={17} /> : <CalendarDays size={17} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">{workout.activity}</span>
                      <span className="block text-xs text-white/40">{workout.type} · {workout.status === "completed" ? "Completada" : "Planificada"}</span>
                    </span>
                    <button type="button" onClick={() => toggleWorkout(workout.id)} className={`rounded px-3 py-2 text-xs font-semibold ${workout.status === "completed" ? "border border-white/10 text-white/60 hover:text-white" : "bg-neon text-ink hover:bg-white"}`}>
                      {workout.status === "completed" ? "Deshacer" : "Marcar completada"}
                    </button>
                    <button type="button" aria-label={`Eliminar ${workout.activity}`} onClick={() => deleteWorkout(workout.id)} className="flex h-8 w-8 items-center justify-center rounded text-white/40 hover:text-red-300"><X size={16} /></button>
                  </li>
                ))}
              </ul>
            ) : <p className="mt-3 text-sm text-white/45">No tienes sesiones para este día.</p>}
          </div>
        </section>

        <form onSubmit={addPlan} noValidate className="h-fit rounded-xl border border-white/[0.08] bg-card p-5 sm:p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon"><Plus size={19} aria-hidden="true" /></span>
          <h2 className="mt-4 font-semibold">Planificar entrenamiento</h2>
          <p className="mt-1 text-xs text-white/45">Añade una sesión a tu calendario demo.</p>
          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="workout-activity" className="mb-2 block text-sm font-medium text-white/75">Actividad</label>
              <input id="workout-activity" required minLength="2" value={form.activity} onChange={(event) => { setForm((current) => ({ ...current, activity: event.target.value })); setError(""); }} placeholder="Ej. Tren superior" className="h-11 w-full rounded-lg border border-white/10 bg-[#111111] px-3 text-sm text-white placeholder:text-white/30" />
            </div>
            <div>
              <label htmlFor="workout-type" className="mb-2 block text-sm font-medium text-white/75">Tipo</label>
              <select id="workout-type" value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))} className="h-11 w-full rounded-lg border border-white/10 bg-[#111111] px-3 text-sm text-white">
                <option>Musculación</option><option>Funcional</option><option>Spinning</option><option>Yoga</option><option>Cardio</option><option>Otro</option>
              </select>
            </div>
            <div>
              <label htmlFor="workout-date" className="mb-2 block text-sm font-medium text-white/75">Fecha</label>
              <input id="workout-date" type="date" required value={form.date} onChange={(event) => { setForm((current) => ({ ...current, date: event.target.value })); setError(""); }} className="h-11 w-full rounded-lg border border-white/10 bg-[#111111] px-3 text-sm text-white" />
            </div>
          </div>
          {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
          <button type="submit" className="button-primary mt-5 w-full"><Plus size={16} aria-hidden="true" /> Añadir al calendario</button>
        </form>
      </div>
    </div>
  );
}

function dateISO(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" });
}
