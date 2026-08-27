// Inline SVG bar/line charts for numerical reasoning questions.
//
// Real numerical assessments (SHL Verify, Talent Q, cut-e) are overwhelmingly
// exhibit-driven, and a large share of those exhibits are charts rather than
// tables — reading a value off an axis is a distinct skill from reading a
// table cell. Rendered as plain SVG so it works offline with no chart library.

export type ChartSeries = { label: string; values: number[]; color: string }

export type ChartData = {
  title: string
  type: 'bar' | 'line'
  categories: string[]
  series: ChartSeries[]
  yLabel?: string
  note?: string
}

const W = 560
const H = 260
const PAD = { top: 16, right: 16, bottom: 40, left: 52 }

function niceMax(v: number): number {
  if (v <= 0) return 10
  const mag = Math.pow(10, Math.floor(Math.log10(v)))
  return Math.ceil(v / (mag / 2)) * (mag / 2)
}

export default function TestChart({ data }: { data: ChartData }) {
  const all = data.series.flatMap(s => s.values)
  const max = niceMax(Math.max(...all, 0))
  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const y = (v: number) => PAD.top + plotH - (v / max) * plotH
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(max * f * 100) / 100)

  const slot = plotW / data.categories.length
  const xCentre = (i: number) => PAD.left + slot * i + slot / 2

  return (
    <div className="bg-brand-darker border border-white/10 rounded-xl p-4 mb-4 overflow-x-auto">
      <p className="text-white font-semibold text-sm mb-1">{data.title}</p>
      {data.yLabel && <p className="text-gray-500 text-xs mb-2">{data.yLabel}</p>}

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[460px]" role="img" aria-label={data.title}>
        {/* gridlines + y axis labels */}
        {ticks.map(t => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
            <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" className="fill-gray-500" fontSize={11}>{t}</text>
          </g>
        ))}

        {/* x axis labels */}
        {data.categories.map((c, i) => (
          <text key={c} x={xCentre(i)} y={H - PAD.bottom + 18} textAnchor="middle" className="fill-gray-400" fontSize={11}>{c}</text>
        ))}

        {data.type === 'bar'
          ? data.series.map((s, si) => {
              const bw = (slot * 0.62) / data.series.length
              return s.values.map((v, i) => (
                <rect
                  key={`${s.label}-${i}`}
                  x={xCentre(i) - (bw * data.series.length) / 2 + si * bw}
                  y={y(v)}
                  width={bw - 2}
                  height={Math.max(0, PAD.top + plotH - y(v))}
                  fill={s.color}
                  rx={2}
                />
              ))
            })
          : data.series.map(s => (
              <g key={s.label}>
                <polyline
                  fill="none"
                  stroke={s.color}
                  strokeWidth={2.5}
                  points={s.values.map((v, i) => `${xCentre(i)},${y(v)}`).join(' ')}
                />
                {s.values.map((v, i) => (
                  <circle key={i} cx={xCentre(i)} cy={y(v)} r={3.5} fill={s.color} />
                ))}
              </g>
            ))}
      </svg>

      {data.series.length > 1 && (
        <div className="flex flex-wrap gap-3 mt-2">
          {data.series.map(s => (
            <span key={s.label} className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ background: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      )}
      {data.note && <p className="text-gray-500 text-xs mt-2 italic">{data.note}</p>}
    </div>
  )
}
