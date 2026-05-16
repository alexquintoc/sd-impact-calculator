import type { FormEvent } from "react";
import type { CalculatorCriteriaData } from "@/calculator/registry";
import type { QuickProjectScanInput } from "../types";

type QuickProjectScanFormProps = {
  criteriaData: CalculatorCriteriaData;
  value: QuickProjectScanInput;
  onChange: (value: QuickProjectScanInput) => void;
  onSubmit: () => void;
};

const PROJECT_FORMATS = [
  "Website",
  "PDF",
  "Poster",
  "Packaging",
  "Campaign",
  "Exhibit",
  "Signage",
  "Motion graphics",
  "Social media",
  "Other",
];

export function QuickProjectScanForm({
  criteriaData,
  value,
  onChange,
  onSubmit,
}: QuickProjectScanFormProps) {
  const projectCategories = criteriaData.projectCategories ?? [];
  const projectTypes = criteriaData.projectTypes ?? [];
  const filteredTypes = value.projectCategory
    ? projectTypes.filter((type) => type.category === value.projectCategory)
    : projectTypes;

  const updateValue = (patch: Partial<QuickProjectScanInput>) => {
    onChange({ ...value, ...patch });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-6 shadow-[0_18px_50px_rgba(45,39,28,0.08)]"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-[#1f241f]">
          Project name
          <input
            value={value.projectName}
            onChange={(event) => updateValue({ projectName: event.target.value })}
            required
            className="rounded-md border border-[#c9c4b8] bg-white px-3 py-2 text-base font-medium outline-none focus:border-[#28775e] focus:ring-4 focus:ring-[#85bba8]/35"
            placeholder="Community garden campaign"
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-[#1f241f]">
          Project format
          <select
            value={value.projectFormat}
            onChange={(event) => updateValue({ projectFormat: event.target.value })}
            className="rounded-md border border-[#c9c4b8] bg-white px-3 py-2 text-base font-medium outline-none focus:border-[#28775e] focus:ring-4 focus:ring-[#85bba8]/35"
          >
            <option value="">Select format</option>
            {PROJECT_FORMATS.map((format) => (
              <option key={format} value={format}>
                {format}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-bold text-[#1f241f]">
          Project category
          <select
            value={value.projectCategory}
            onChange={(event) =>
              updateValue({ projectCategory: event.target.value, projectType: "" })
            }
            className="rounded-md border border-[#c9c4b8] bg-white px-3 py-2 text-base font-medium outline-none focus:border-[#28775e] focus:ring-4 focus:ring-[#85bba8]/35"
          >
            <option value="">Any category</option>
            {projectCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-bold text-[#1f241f]">
          Project type
          <select
            value={value.projectType}
            onChange={(event) => {
              const selectedType = projectTypes.find((type) => type.id === event.target.value);
              updateValue({
                projectType: event.target.value,
                projectCategory: selectedType?.category ?? value.projectCategory,
              });
            }}
            className="rounded-md border border-[#c9c4b8] bg-white px-3 py-2 text-base font-medium outline-none focus:border-[#28775e] focus:ring-4 focus:ring-[#85bba8]/35"
          >
            <option value="">Any type</option>
            {filteredTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold text-[#1f241f]">
        Brief project description
        <textarea
          value={value.description}
          onChange={(event) => updateValue({ description: event.target.value })}
          required
          rows={7}
          className="resize-y rounded-md border border-[#c9c4b8] bg-white px-3 py-2 text-base font-medium leading-7 outline-none focus:border-[#28775e] focus:ring-4 focus:ring-[#85bba8]/35"
          placeholder="Describe materials, audience, production, accessibility, cultural context, budget goals, or any sustainability choices already planned."
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm leading-6 text-[#5f5a50]">
          This prototype uses rule-based keyword matching. It suggests what appears relevant,
          then leaves final judgment to the full SD Standard review.
        </p>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-[#1f241f] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#28775e] focus:outline-none focus:ring-4 focus:ring-[#85bba8]"
        >
          Scan project
        </button>
      </div>
    </form>
  );
}
