export const mockRoutines = [
  {
    day: "Lunes",
    focus: "Tren superior",
    exercises: [
      { id: "bench-press", name: "Press de banca", sets: 4, reps: "8–10", rest: "90 s" },
      { id: "lat-pulldown", name: "Jalón al pecho", sets: 3, reps: "10–12", rest: "75 s" },
      { id: "shoulder-press", name: "Press de hombros", sets: 3, reps: "10–12", rest: "75 s" },
    ],
  },
  {
    day: "Martes",
    focus: "Tren inferior",
    exercises: [
      { id: "squat", name: "Sentadilla", sets: 4, reps: "8–10", rest: "90 s" },
      { id: "leg-press", name: "Prensa de piernas", sets: 3, reps: "10–12", rest: "75 s" },
      { id: "leg-curl", name: "Curl femoral", sets: 3, reps: "12–15", rest: "60 s" },
    ],
  },
  {
    day: "Miércoles",
    focus: "Recuperación activa",
    exercises: [
      { id: "walk", name: "Caminata ligera", sets: 1, reps: "20 min", rest: "A elección" },
      { id: "mobility", name: "Movilidad general", sets: 2, reps: "8–10 min", rest: "A elección" },
    ],
  },
  {
    day: "Jueves",
    focus: "Espalda y brazos",
    exercises: [
      { id: "seated-row", name: "Remo sentado", sets: 4, reps: "8–12", rest: "90 s" },
      { id: "face-pull", name: "Face pull", sets: 3, reps: "12–15", rest: "60 s" },
      { id: "bicep-curl", name: "Curl de bíceps", sets: 3, reps: "10–12", rest: "60 s" },
    ],
  },
  {
    day: "Viernes",
    focus: "Piernas y core",
    exercises: [
      { id: "deadlift", name: "Peso muerto rumano", sets: 3, reps: "8–10", rest: "90 s" },
      { id: "lunges", name: "Zancadas", sets: 3, reps: "10 por lado", rest: "75 s" },
      { id: "plank", name: "Plancha", sets: 3, reps: "30–45 s", rest: "60 s" },
    ],
  },
  {
    day: "Sábado",
    focus: "Cardio",
    exercises: [
      { id: "bike", name: "Bicicleta estática", sets: 1, reps: "25 min", rest: "A elección" },
      { id: "stretch", name: "Estiramientos", sets: 1, reps: "10 min", rest: "A elección" },
    ],
  },
  {
    day: "Domingo",
    focus: "Descanso",
    exercises: [
      { id: "rest-day", name: "Día de descanso", sets: 1, reps: "A tu ritmo", rest: "—" },
    ],
  },
];

export function getInitialWorkoutSchedule() {
  const today = new Date();
  const mondayOffset = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);

  return [
    { dayOffset: 0, activity: "Tren superior", type: "Musculación", status: "completed" },
    { dayOffset: 1, activity: "Tren inferior", type: "Musculación", status: "completed" },
    { dayOffset: 3, activity: "Espalda y brazos", type: "Musculación", status: "planned" },
    { dayOffset: 5, activity: "Spinning", type: "Cardio", status: "planned" },
  ].map((workout, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + workout.dayOffset);
    return {
      id: `demo-workout-${index}`,
      date: localDateISO(date),
      activity: workout.activity,
      type: workout.type,
      status: workout.status,
    };
  });
}

export const mockWeightRecords = [
  { id: "weight-demo-1", date: daysAgo(28), weight: 72.8, notes: "Registro de ejemplo" },
  { id: "weight-demo-2", date: daysAgo(21), weight: 72.5, notes: "Registro de ejemplo" },
  { id: "weight-demo-3", date: daysAgo(14), weight: 72.9, notes: "Registro de ejemplo" },
  { id: "weight-demo-4", date: daysAgo(7), weight: 72.2, notes: "Registro de ejemplo" },
  { id: "weight-demo-5", date: daysAgo(1), weight: 72.4, notes: "Registro de ejemplo" },
];

export function daysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return localDateISO(date);
}

function localDateISO(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export const demoProfile = {
  name: "Alex Demo",
  email: "fitzone.demo@demo.cl",
  height: "",
  goal: "",
  photoUrl: "",
};
