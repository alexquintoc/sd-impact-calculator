type PillarSliderProps = {
  label: string
  color: string
  value: number
  onChange: (value: number) => void
}

export function PillarSlider({ label, color, value, onChange }: PillarSliderProps) {
  const inputId = `${label.toLowerCase()}-slider`

  return (
    <label className="pillar-slider" htmlFor={inputId}>
      <span className="pillar-slider__header">
        <span>{label}</span>
        <strong>{value}</strong>
      </span>
      <input
        id={inputId}
        type="range"
        min="0"
        max="100"
        value={value}
        style={{ accentColor: color }}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  )
}
