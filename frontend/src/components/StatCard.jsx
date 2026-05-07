export default function StatCard({ label, value, helper }) {
  return (
    <div className="glass-panel rounded-[1.75rem] p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-4 font-display text-3xl font-bold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-300">{helper}</p>
    </div>
  );
}
