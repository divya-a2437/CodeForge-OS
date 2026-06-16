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
    <div className="space-y-4">
      <div>
        <label 
          className="text-xs font-semibold uppercase tracking-wider minimal-muted block mb-3" 
          htmlFor="project-prompt"
        >
          Project brief
        </label>
        <textarea
          id="project-prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          rows={4}
          className="w-full minimal-border rounded-none border-0 border-b bg-transparent px-0 py-3 text-sm font-normal text-black outline-none transition placeholder-gray-400 focus:border-black focus:ring-0"
          placeholder="Describe what you want the team to build"
          disabled={disabled}
        />
      </div>
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled}
          className="inline-flex items-center justify-center text-sm font-medium text-black transition-opacity hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {disabled ? (
            <>
              <span className="inline-flex gap-1">
                <span className="h-1 w-1 rounded-full bg-black opacity-60 animate-dot-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="h-1 w-1 rounded-full bg-black opacity-60 animate-dot-bounce" style={{ animationDelay: '200ms' }}></span>
                <span className="h-1 w-1 rounded-full bg-black opacity-60 animate-dot-bounce" style={{ animationDelay: '400ms' }}></span>
              </span>
              <span className="ml-2">Running</span>
            </>
          ) : (
            'Launch'
          )}
        </button>
      </div>
    </div>
  );
}
