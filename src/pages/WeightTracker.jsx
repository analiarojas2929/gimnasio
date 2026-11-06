import { useMemo, useState } from "react";
import { CalendarDays, Pencil, Plus, Scale, Trash2, X } from "lucide-react";
import { mockWeightRecords } from "../data/mockRoutines.js";
import useLocalStorage from "../hooks/useLocalStorage.js";

const todayISO = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const emptyForm = () => ({ date: todayISO(), weight: "", notes: "" });

export default function WeightTracker() {
  const [records, setRecords] = useLocalStorage("fitzone-demo-weights", mockWeightRecords);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const sortedRecords = useMemo(
    () => [...records].sort((a, b) => b.date.localeCompare(a.date)),
    [records],
  );

  function resetForm() {
    setForm(emptyForm());
    setEditingId("");
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const weight = Number(form.weight);
    if (!form.date || form.date > todayISO()) {
      setError("Selecciona una fecha válida, no futura.");
      return;
    }
    if (!Number.isFinite(weight) || weight < 1 || weight > 500) {
      setError("Ingresa un peso válido entre 1 y 500 kg.");
      return;
    }

    if (editingId) {
      setRecords((current) =>
        current.map((record) =>
          record.id === editingId ? { ...record, ...form, weight } : record,
        ),
      );
    } else {
      setRecords((current) => [
        ...current,
        { id: crypto.randomUUID(), ...form, weight },
      ]);
    }
    resetForm();
  }

  function beginEdit(record) {
    setEditingId(record.id);
    setForm({ date: record.date, weight: String(record.weight), notes: record.notes || "" });
    setError("");
    document.getElementById("weight-date")?.focus();
  }

  function deleteRecord(id) {
    setRecords((current) => current.filter((record) => record.id !== id));
    if (editingId === id) resetForm();
  }

  return (
    <div className="space-y-7">
      <section>
        <p className="eyebrow">Registro personal</p>
        <h1 className="display-font mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Mi peso</h1>
        <p className="mt-2 text-sm text-white/50">Registra tus datos como referencia personal, sin asumir un objetivo específico.</p>
      </section>

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <form onSubmit={handleSubmit} noValidate className="h-fit rounded-xl border border-white/[0.08] bg-card p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon"><Scale size={19} aria-hidden="true" /></span>
            <h2 className="font-semibold">{editingId ? "Editar registro" : "Añadir registro"}</h2>
          </div>
          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="weight-date" className="mb-2 block text-sm font-medium text-white/75">Fecha</label>
              <input
                id="weight-date"
                type="date"
                max={todayISO()}
                required
                value={form.date}
                onChange={(event) => { setForm((current) => ({ ...current, date: event.target.value })); setError(""); }}
                className="h-11 w-full rounded-lg border border-white/10 bg-[#111111] px-3 text-sm text-white"
              />
            </div>
            <div>
              <label htmlFor="weight-value" className="mb-2 block text-sm font-medium text-white/75">Peso (kg)</label>
              <div className="relative">
                <input
                  id="weight-value"
                  type="number"
                  min="1"
                  max="500"
                  step="0.1"
                  inputMode="decimal"
                  required
                  value={form.weight}
                  onChange={(event) => { setForm((current) => ({ ...current, weight: event.target.value })); setError(""); }}
                  placeholder="Ej. 72.5"
                  className="h-11 w-full rounded-lg border border-white/10 bg-[#111111] px-3 pr-12 text-sm text-white placeholder:text-white/30"
                />
                <span className="absolute inset-y-0 right-3 flex items-center text-xs text-white/40">kg</span>
              </div>
            </div>
            <div>
              <label htmlFor="weight-notes" className="mb-2 block text-sm font-medium text-white/75">Observaciones <span className="text-white/35">(opcional)</span></label>
              <textarea
                id="weight-notes"
                rows="3"
                maxLength="300"
                value={form.notes}
                onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                placeholder="Un comentario para tu registro..."
                className="w-full resize-y rounded-lg border border-white/10 bg-[#111111] px-3 py-2.5 text-sm text-white placeholder:text-white/30"
              />
            </div>
          </div>
          {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="submit" className="button-primary">
              <Plus size={16} aria-hidden="true" /> {editingId ? "Guardar cambios" : "Guardar registro"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="button-secondary">
                <X size={15} aria-hidden="true" /> Cancelar
              </button>
            )}
          </div>
        </form>

        <section className="rounded-xl border border-white/[0.08] bg-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold">Historial de registros</h2>
              <p className="mt-1 text-xs text-white/45">{records.length} {records.length === 1 ? "registro" : "registros"} · guardado en este navegador</p>
            </div>
            <CalendarDays size={19} className="text-neon" aria-hidden="true" />
          </div>
          {sortedRecords.length ? (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[400px] text-left text-sm">
                <thead className="text-xs text-white/40">
                  <tr className="border-b border-white/10">
                    <th scope="col" className="pb-3 font-medium">Fecha</th>
                    <th scope="col" className="pb-3 font-medium">Peso</th>
                    <th scope="col" className="pb-3 font-medium">Observaciones</th>
                    <th scope="col" className="pb-3 text-right font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRecords.map((record) => (
                    <tr key={record.id} className="border-b border-white/[0.06] last:border-0">
                      <td className="py-4 text-white/65">{formatDate(record.date)}</td>
                      <td className="py-4 font-semibold text-white">{record.weight} kg</td>
                      <td className="max-w-40 truncate py-4 text-xs text-white/40">{record.notes || "—"}</td>
                      <td className="py-4">
                        <div className="flex justify-end gap-1">
                          <button type="button" aria-label={`Editar registro del ${formatDate(record.date)}`} onClick={() => beginEdit(record)} className="flex h-8 w-8 items-center justify-center rounded text-white/50 hover:bg-white/10 hover:text-neon"><Pencil size={15} aria-hidden="true" /></button>
                          <button type="button" aria-label={`Eliminar registro del ${formatDate(record.date)}`} onClick={() => deleteRecord(record.id)} className="flex h-8 w-8 items-center justify-center rounded text-white/50 hover:bg-white/10 hover:text-red-300"><Trash2 size={15} aria-hidden="true" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-5 flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed border-white/10 px-6 text-center">
              <Scale size={25} className="text-white/30" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium">Aún no tienes registros</p>
              <p className="mt-1 text-xs text-white/45">Añade uno cuando quieras hacer seguimiento.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function formatDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" });
}
