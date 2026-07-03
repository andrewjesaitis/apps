import React from "react";

// Draggable counterpart to DetailPanel's read-only Bar. Native range input for
// accessibility and keyboard support; end labels match Bar (invert => the
// transparency axis reads "colored" … "transparent").
export default function SliderBar({
  label,
  value,
  color,
  invert,
  onChange,
}: {
  label: string;
  value: number;
  color: string;
  invert?: boolean;
  onChange: (v: number) => void;
}) {
  return (
    <div className="bar">
      <div className="bar-head">
        <span className="bar-label">{label}</span>
        <span className="bar-value">{value.toFixed(1)}</span>
      </div>
      <input
        className="bar-range"
        type="range"
        min={0}
        max={10}
        step={0.1}
        value={value}
        aria-label={label}
        style={{ accentColor: color }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="bar-ends">
        <span>{invert ? "colored" : "low"}</span>
        <span>{invert ? "transparent" : "high"}</span>
      </div>
    </div>
  );
}
