export function ProjectInput({
  prompt,
  setPrompt,
  onSubmit,
  disabled
}: {
  prompt: string;
  setPrompt: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}) {
  return (
    <div className="glass-surface rounded-3xl border border-slate-800 p-6 shadow-lg shadow-slate-950/10">
      <label className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400" htmlFor="project-prompt">
        Software requirement
      </label>
      <textarea
        id="project-prompt"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        rows={5}
        className="mt-4 w-full rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-4 text-sm text-slate-100 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-500/30"
        placeholder="Describe the product you want the Band to build"
        disabled={disabled}
      />
      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled}
        className="mt-5 inline-flex items-center justify-center rounded-3xl bg-slate-200 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {disabled ? 'Running workflow…' : 'Launch Band'}
      </button>
    </div>
  );
}
