import type { FormEvent } from "react";

type QuickProjectScanFormProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function QuickProjectScanForm({ value, onChange, onSubmit }: QuickProjectScanFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-5 shadow-[0_18px_50px_rgba(45,39,28,0.08)] sm:p-6"
    >
      <label className="grid gap-3 text-sm font-extrabold text-[#1f241f]">
        Project description
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
          rows={12}
          className="min-h-[20rem] resize-y rounded-md border border-[#c9c4b8] bg-white px-4 py-4 text-base font-medium leading-7 outline-none transition placeholder:text-[#8d877c] focus:border-[#28775e] focus:ring-4 focus:ring-[#85bba8]/35"
          placeholder="Example: We designed a bilingual exhibition guide for a local museum. It was printed locally on recycled paper, used minimal ink coverage, and was developed through workshops with community members..."
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm leading-6 text-[#5f5a50]">
          This snapshot uses transparent rule-assisted matching against SD Standard v2 draft
          criteria. It suggests criteria to review; it does not certify or verify the project.
        </p>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-[#1f241f] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#28775e] focus:outline-none focus:ring-4 focus:ring-[#85bba8] disabled:cursor-not-allowed disabled:opacity-55"
          disabled={value.trim().length < 12}
        >
          Generate impact snapshot
        </button>
      </div>
    </form>
  );
}
