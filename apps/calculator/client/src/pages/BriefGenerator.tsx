import { useMemo, useState } from "react";
import {
  generateBrief,
  type BriefGeneratorValues,
} from "../../../../brief-generator/src/lib/generateBrief";
import {
  pillarDefinitions,
  pillarOrder,
} from "../../../../brief-generator/src/data/brief-generator-data";

const initialValues: BriefGeneratorValues = {
  environment: 62,
  society: 55,
  culture: 48,
  finance: 52,
};

export default function BriefGenerator() {
  const [values, setValues] = useState<BriefGeneratorValues>(initialValues);
  const [briefVariant, setBriefVariant] = useState(0);

  const brief = useMemo(
    () => generateBrief(values, briefVariant),
    [values, briefVariant]
  );

  const updateValue =
    (pillar: keyof BriefGeneratorValues) => (nextValue: number) => {
      setValues((currentValues) => ({
        ...currentValues,
        [pillar]: nextValue,
      }));
      setBriefVariant(0);
    };

  return (
    <main className="min-h-screen bg-[#f7f5ef] px-5 py-8 text-[#1f241f] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 max-w-3xl">
          <a
            href="/"
            className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e] hover:text-[#1f241f]"
          >
            SD Standard
          </a>
          <h1 className="mt-3 text-5xl font-extrabold leading-none tracking-normal sm:text-6xl">
            SD Brief Generator
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#5f5a50]">
            Shape an early design brief by balancing environmental, social,
            cultural, and financial priorities. The brief updates as the sliders move.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-6 shadow-[0_18px_50px_rgba(45,39,28,0.08)]">
            <div>
              <h2 className="text-2xl font-extrabold">Impact priorities</h2>
              <p className="mt-2 text-sm leading-6 text-[#5f5a50]">
                Adjust each SD Standard pillar from 0 to 100.
              </p>
            </div>

            <div className="mt-7 space-y-6">
              {pillarOrder.map((pillar) => (
                <label key={pillar} className="grid gap-2">
                  <span className="flex items-center justify-between text-sm font-extrabold">
                    <span>{pillarDefinitions[pillar].label}</span>
                    <strong>{values[pillar]}</strong>
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={values[pillar]}
                    onChange={(event) => updateValue(pillar)(Number(event.target.value))}
                    className="w-full accent-[#28775e]"
                  />
                </label>
              ))}
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3">
              {pillarOrder.map((pillar) => (
                <div
                  key={pillar}
                  className="rounded-md border border-[#d9d4c8] bg-white p-3"
                >
                  <p className="text-xs font-bold uppercase text-[#5f5a50]">
                    {pillarDefinitions[pillar].label}
                  </p>
                  <strong className="mt-1 block text-2xl">{values[pillar]}</strong>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setBriefVariant((currentVariant) => currentVariant + 1)}
              className="mt-7 inline-flex w-full items-center justify-center rounded-md bg-[#1f241f] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#28775e] focus:outline-none focus:ring-4 focus:ring-[#85bba8]"
            >
              Generate another brief
            </button>
          </div>

          <article
            className="rounded-lg border border-[#d9d4c8] bg-[#fffdf8] p-6 shadow-[0_18px_50px_rgba(45,39,28,0.08)]"
            aria-live="polite"
          >
            <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
              Generated archetype
            </p>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight">
              {brief.archetype}
            </h2>

            <div className="mt-7">
              <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
                Brief title
              </p>
              <h3 className="mt-2 text-2xl font-extrabold">{brief.title}</h3>
            </div>

            <p className="mt-6 text-lg leading-8 text-[#5f5a50]">
              {brief.briefStatement}
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-[#d9d4c8] bg-white p-4">
                <p className="text-xs font-bold uppercase text-[#5f5a50]">
                  Dominant pillar
                </p>
                <strong className="mt-1 block">
                  {pillarDefinitions[brief.dominantPillar].label}
                </strong>
              </div>
              <div className="rounded-md border border-[#d9d4c8] bg-white p-4">
                <p className="text-xs font-bold uppercase text-[#5f5a50]">
                  Supporting pillar
                </p>
                <strong className="mt-1 block">
                  {pillarDefinitions[brief.supportingPillar].label}
                </strong>
              </div>
            </div>

            <div className="mt-7">
              <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
                Related SD criteria
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {brief.relatedCriteria.map((criterion) => (
                  <li
                    key={criterion}
                    className="rounded-full bg-[#e5efe9] px-3 py-1 text-sm font-bold text-[#1f604d]"
                  >
                    {criterion}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-7">
              <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#28775e]">
                Tags
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {brief.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-[#d9d4c8] bg-white px-3 py-1 text-sm font-bold text-[#5f5a50]"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>

            {brief.tensionWarning ? (
              <div className="mt-7 rounded-md border border-[#d7b75b] bg-[#fff8dc] p-4">
                <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#6b4c00]">
                  Tension warning
                </p>
                <p className="mt-2 text-sm leading-6 text-[#5f4a18]">
                  {brief.tensionWarning}
                </p>
              </div>
            ) : null}
          </article>
        </section>
      </div>
    </main>
  );
}
