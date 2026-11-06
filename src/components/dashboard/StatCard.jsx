import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  trend,
}) {
  return (
    <article className="rounded-xl border border-white/[0.08] bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-white/55">{label}</p>
          <p className="display-font mt-3 text-3xl font-bold tracking-tight">
            {value}
          </p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
          <Icon size={19} aria-hidden="true" />
        </span>
      </div>
      {(detail || trend) && (
        <div className="mt-4 flex items-center gap-1.5 text-xs text-white/45">
          {trend === "up" && <ArrowUpRight size={14} className="text-neon" aria-hidden="true" />}
          {trend === "down" && <ArrowDownRight size={14} className="text-neon" aria-hidden="true" />}
          {detail}
        </div>
      )}
    </article>
  );
}
