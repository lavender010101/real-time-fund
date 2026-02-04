'use client';

export default function Stat({ label, value, delta }) {
  const dir = delta > 0 ? 'up' : delta < 0 ? 'down' : '';
  return (
    <div className="stat">
      <span className="label">{label}</span>
      <span className={`value ${dir}`}>{value}</span>
    </div>
  );
}


