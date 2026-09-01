import { GeneratedBriefCard } from './components/GeneratedBriefCard'
import { PillarSlider } from './components/PillarSlider'
import { pillarDefinitions, pillarOrder } from './data/brief-generator-data'
import { useBriefGenerator } from './lib/useBriefGenerator'
import './App.css'

const resources = [
  {
    title: 'Knowledge Base',
    description: 'Explore the SD Standard criteria, terms, and guidance notes.',
    href: '/knowledge-base/',
    linkText: 'Open Knowledge Base',
  },
  {
    title: 'Impact Calculator',
    description: 'Evaluate a design project against the SD Standard criteria.',
    href: '/calculator/',
    linkText: 'Open Impact Calculator',
  },
  {
    title: 'Design Brief Generator',
    description:
      'Generate ambitious design brief concepts by balancing environment, society, culture, and finance.',
    href: '/brief-generator/',
    linkText: 'Open Brief Generator',
  },
]

function IndexPage() {
  return (
    <main className="app-shell index-page">
      <section className="intro index-hero">
        <p className="eyebrow">Sustainable Design Standard</p>
        <h1>SD Standard</h1>
        <p>
          Tools and resources for applying sustainable design criteria to
          communication design projects.
        </p>
      </section>

      <section className="resource-grid" aria-label="SD Standard resources">
        {resources.map((resource) => (
          <a className="resource-card" href={resource.href} key={resource.title}>
            <span>
              <span className="resource-card__accent" />
              <h2>{resource.title}</h2>
              <p>{resource.description}</p>
            </span>
            <strong>{resource.linkText} -&gt;</strong>
          </a>
        ))}
      </section>
    </main>
  )
}

function BriefGeneratorApp() {
  const { values, language, brief, text, pillars, updateValue, generateAnother } = useBriefGenerator()

  return (
    <main lang={language} className="app-shell">
      <section className="intro">
        <p className="eyebrow">{text.prototype}</p>
        <h1>{text.title}</h1>
        <p>
          {text.introduction}
        </p>
      </section>

      <section className="generator-layout">
        <div className="controls-panel">
          <div className="controls-heading">
            <h2>{text.priorities}</h2>
            <p>{text.instructions}</p>
          </div>

          <div className="slider-stack">
            {pillarOrder.map((pillar) => (
              <PillarSlider
                key={pillar}
                color={pillarDefinitions[pillar].color}
                label={pillars[pillar].label}
                value={values[pillar]}
                onChange={updateValue(pillar)}
              />
            ))}
          </div>

          <div className="value-grid" aria-label={text.currentValues}>
            {pillarOrder.map((pillar) => (
              <div key={pillar}>
                <span>{pillars[pillar].label}</span>
                <strong>{values[pillar]}</strong>
              </div>
            ))}
          </div>

          <button
            className="generate-button"
            type="button"
            onClick={generateAnother}
          >
            {text.generate}
          </button>
        </div>

        <GeneratedBriefCard brief={brief} language={language} />
      </section>
    </main>
  )
}

function App() {
  const pathname = window.location.pathname

  if (/^\/brief-generator\/?$/.test(pathname)) {
    return <BriefGeneratorApp />
  }

  return <IndexPage />
}

export default App
