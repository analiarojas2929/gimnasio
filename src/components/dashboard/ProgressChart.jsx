import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from "recharts";

const axisProps = {
  axisLine: false,
  tickLine: false,
  tick: { fill: "#858585", fontSize: 11 },
};

function ChartTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-[#202020] px-3 py-2 text-xs shadow-xl">
      <p className="mb-1 text-white/50">{label}</p>
      <p className="font-semibold text-neon">
        {payload[0].value} {unit}
      </p>
    </div>
  );
}

export default function ProgressChart({
  title,
  data,
  dataKey,
  unit,
  type = "line",
  emptyMessage = "Aún no hay datos para mostrar.",
}) {
  const Chart = type === "bar" ? BarChart : LineChart;
  const hasData = data.length > 0;

  return (
    <section className="rounded-xl border border-white/[0.08] bg-card p-5 sm:p-6">
      <h2 className="font-semibold">{title}</h2>
      {hasData ? (
        <div className="mt-5 h-64 w-full" role="img" aria-label={`${title}, gráfico de ${unit}`}>
          <ResponsiveContainer width="100%" height="100%">
            <Chart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#ffffff12" vertical={false} />
              <XAxis dataKey="label" {...axisProps} tickMargin={10} />
              <YAxis
                {...axisProps}
                width={48}
                domain={type === "bar" ? [0, "auto"] : ["auto", "auto"]}
              />
              <Tooltip content={<ChartTooltip unit={unit} />} />
              {type === "bar" ? (
                <Bar dataKey={dataKey} fill="#B6FF3B" radius={[4, 4, 0, 0]} maxBarSize={38} />
              ) : (
                <Line
                  type="monotone"
                  dataKey={dataKey}
                  stroke="#B6FF3B"
                  strokeWidth={2.5}
                  dot={{ fill: "#B6FF3B", strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, fill: "#B6FF3B" }}
                />
              )}
            </Chart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="mt-5 flex h-64 items-center justify-center rounded-lg border border-dashed border-white/10 px-6 text-center text-sm text-white/45">
          {emptyMessage}
        </div>
      )}
    </section>
  );
}
