import { useMemo, useState } from 'react'
import { GeneratedBriefCard } from './components/GeneratedBriefCard'
import { PillarSlider } from './components/PillarSlider'
import { pillarDefinitions, pillarOrder } from './data/brief-generator-data'
import { generateBrief, type BriefGeneratorValues } from './lib/generateBrief'
import './App.css'

const initialValues: BriefGeneratorValues = {
  environment: 62,
  society: 55,
  culture: 48,
  finance: 52,
}

function App() {
  const [values, setValues] = useState<BriefGeneratorValues>(initialValues)
  const [briefVariant, setBriefVariant] = useState(0)

  const brief = useMemo(
    () => generateBrief(values, briefVariant),
    [values, briefVariant],
  )

  const updateValue =
    (pillar: keyof BriefGeneratorValues) => (nextValue: number) => {
      setValues((currentValues) => ({
        ...currentValues,
        [pillar]: nextValue,
      }))
      setBriefVariant(0)
    }

  return (
    <main className="app-shell">
      <section className="intro">
        <p className="eyebrow">Experimental prototype</p>
        <h1>SD Brief Generator</h1>
        <p>
          Shape an early design brief by balancing environmental, social,
          cultural, and financial priorities. The brief updates live as the
          sliders move.
        </p>
      </section>

      <section className="generator-layout">
        <div className="controls-panel">
          <div className="controls-heading">
            <h2>Impact priorities</h2>
            <p>Adjust each pillar from 0 to 100.</p>
          </div>

          <div className="slider-stack">
            {pillarOrder.map((pillar) => (
              <PillarSlider
                key={pillar}
                label={pillarDefinitions[pillar].label}
                value={values[pillar]}
                onChange={updateValue(pillar)}
              />
            ))}
          </div>

          <div className="value-grid" aria-label="Current slider values">
            {pillarOrder.map((pillar) => (
              <div key={pillar}>
                <span>{pillarDefinitions[pillar].label}</span>
                <strong>{values[pillar]}</strong>
              </div>
            ))}
          </div>

          <button
            className="generate-button"
            type="button"
            onClick={() => setBriefVariant((currentVariant) => currentVariant + 1)}
          >
            Generate another brief
          </button>
        </div>

        <GeneratedBriefCard brief={brief} />
      </section>
    </main>
  )
}

export default App
