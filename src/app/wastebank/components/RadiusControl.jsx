"use client";
export default function RadiusControl({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-slate-600">Radius</span>
      <input type="range" min={1000} max={10000} step={500} value={value}
        onChange={(e) => onChange?.(Number(e.target.value))} className="w-24" />
      <span className="text-slate-600 w-16">{(value / 1000).toFixed(1)} km</span>
    </div>
  );
}
