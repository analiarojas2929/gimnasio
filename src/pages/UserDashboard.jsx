import { useMemo } from "react";
import { Activity, ArrowRight, CalendarCheck, Dumbbell, Scale } from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "../components/dashboard/StatCard.jsx";
import ProgressChart from "../components/dashboard/ProgressChart.jsx";
import useLocalStorage from "../hooks/useLocalStorage.js";
import { demoProfile, getInitialWorkoutSchedule, mockRoutines, mockWeightRecords } from "../data/mockRoutines.js";
import { authService } from "../services/authService.js";

const todayISO = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

export default function UserDashboard() {
  const user = authService.getCurrentUser();
  const [weights] = useLocalStorage("fitzone-demo-weights", mockWeightRecords);
  const [workouts] = useLocalStorage("fitzone-demo-workouts", getInitialWorkoutSchedule());
  const [progress] = useLocalStorage("fitzone-demo-routine-progress", {});
  const dayIndex = (new Date().getDay() + 6) % 7;
  const routineNames = ["Tren superior", "Tren inferior", "Recuperación activa", "Espalda y brazos", "Piernas y core", "Cardio", "Descanso"];
  const todayRoutine = mockRoutines[dayIndex];
  const monday = new Date();
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const weekStart = todayISOFor(monday);
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  const weekEnd = todayISOFor(sunday);
  const completedThisWeek = workouts.filter(
    (workout) =>
      workout.status === "completed" &&
      workout.date >= weekStart &&
      workout.date <= weekEnd,
  ).length;
  const recent = [...workouts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const weeklyData = useMemo(() => {
    const labels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    return labels.map((label, index) => {
      const date = new Date();
      const offset = (date.getDay() + 6) % 7;
      date.setDate(date.getDate() - offset + index);
      const key = todayISOFor(date);
      return {
        label,
        trainings: workouts.filter((item) => item.date === key && item.status === "completed").length,
      };
    });
  }, [workouts]);
  const latestWeight = weights.length
    ? [...weights].sort((a, b) => b.date.localeCompare(a.date))[0].weight
    : null;
  const todayProgress = progress[todayISO()] || {};
  const completionPercent = Math.round(
    (Object.values(todayProgress).filter((item) => item.completed).length / todayRoutine.exercises.length) * 100,
  );

  return (
    <div className="space-y-7">
      <section>
        <p className="eyebrow">Tu resumen</p>
        <h1 className="display-font mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Hola, {(user?.name || demoProfile.name).split(" ")[0]} <span aria-hidden="true">✦</span>
        </h1>
        <p className="mt-2 text-sm text-white/50">Un paso a la vez. Esto es lo que pasa en tu espacio.</p>
      </section>

      <section aria-label="Resumen de actividad" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Peso más reciente" value={latestWeight === null ? "—" : `${latestWeight} kg`} detail={latestWeight === null ? "Añade tu primer registro" : "Solo como referencia personal"} icon={Scale} />
        <StatCard label="Entrenamientos esta semana" value={completedThisWeek} detail="Sesiones marcadas como completadas" icon={Activity} />
        <StatCard label="Rutina de hoy" value={routineNames[dayIndex]} detail={`${completionPercent}% de ejercicios completados`} icon={Dumbbell} />
        <StatCard label="Próxima sesión" value={upcomingWorkout(workouts)?.activity || "A tu ritmo"} detail={upcomingWorkout(workouts)?.date || "Planifica desde calendario"} icon={CalendarCheck} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
        <ProgressChart title="Tu semana de entrenamientos" data={weeklyData} dataKey="trainings" unit="sesiones" type="bar" />
        <article className="rounded-xl border border-white/[0.08] bg-card p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Actividad reciente</h2>
            <Link to="/dashboard/calendario" className="text-xs font-semibold text-neon hover:text-white">Ver calendario</Link>
          </div>
          <ul className="mt-5 space-y-4">
            {recent.length ? recent.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.status === "completed" ? "bg-neon/10 text-neon" : "bg-white/[0.06] text-white/45"}`}>
                  {item.status === "completed" ? <CalendarCheck size={17} /> : <Dumbbell size={17} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{item.activity}</span>
                  <span className="block text-xs text-white/40">{formatDate(item.date)}</span>
                </span>
                <span className={`text-[0.65rem] font-semibold ${item.status === "completed" ? "text-neon" : "text-white/40"}`}>
                  {item.status === "completed" ? "Completada" : "Planificada"}
                </span>
              </li>
            )) : <li className="py-8 text-center text-sm text-white/45">Todavía no hay actividad. Planifica una sesión para empezar.</li>}
          </ul>
          <Link to="/dashboard/rutinas" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-neon hover:text-white">
            Ir a mis rutinas <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </article>
      </section>

      <p className="text-xs leading-5 text-white/35">
        Rutinas y métricas mostradas son datos de ejemplo para organizar tu actividad; no son recomendaciones ni prescripciones personalizadas.
      </p>
    </div>
  );
}

function todayISOFor(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("es-CL", { weekday: "short", day: "numeric", month: "short" });
}

function upcomingWorkout(workouts) {
  const today = todayISO();
  return workouts
    .filter((workout) => workout.status === "planned" && workout.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))[0];
}
