export type PillarKey = 'environment' | 'society' | 'culture' | 'finance'

export type PillarDefinition = {
  key: PillarKey
  label: string
  projectTypes: string[]
  phrases: string[]
  criteria: string[]
  archetype: string
}

export type BriefSeed = {
  title: string
  projectType: string
  brief: string
  primaryPillar: PillarKey
  secondaryPillars: PillarKey[]
  criteria: string[]
  tags: string[]
}

export const pillarDefinitions: Record<PillarKey, PillarDefinition> = {
  environment: {
    key: 'environment',
    label: 'Environment',
    projectTypes: [
      'low-impact product system',
      'circular service model',
      'resource-positive place strategy',
    ],
    phrases: [
      'reduces material waste and ecological pressure',
      'prioritizes circular resources and measurable impact reduction',
      'protects natural systems with visible material accountability',
    ],
    criteria: ['E1', 'E5', 'E13', 'E14'],
    archetype: 'Eco-Optimized Brief',
  },
  society: {
    key: 'society',
    label: 'Society',
    projectTypes: [
      'community benefit platform',
      'inclusive access program',
      'social impact service',
    ],
    phrases: [
      'expands access, participation, and everyday usefulness',
      'centers equity, safety, and shared community benefit',
      'strengthens social value for underserved users',
    ],
    criteria: ['S1', 'S8', 'S11', 'S16'],
    archetype: 'Equity-Centered Brief',
  },
  culture: {
    key: 'culture',
    label: 'Culture',
    projectTypes: [
      'cultural experience system',
      'heritage-informed brand concept',
      'place-based storytelling framework',
    ],
    phrases: [
      'honors local identity, meaning, and creative expression',
      'turns cultural memory into a respectful contemporary experience',
      'makes representation visible through form, language, and ritual',
    ],
    criteria: ['C2', 'C4', 'C5', 'C6'],
    archetype: 'Culture-Led Brief',
  },
  finance: {
    key: 'finance',
    label: 'Finance',
    projectTypes: [
      'market-ready venture concept',
      'scalable business model',
      'commercial innovation pilot',
    ],
    phrases: [
      'can be delivered with a credible path to financial resilience',
      'balances user value with clear market demand and operating logic',
      'turns cost, revenue, and delivery limits into clear design constraints',
    ],
    criteria: ['F1', 'F2', 'F3', 'F4'],
    archetype: 'Viability-Driven Brief',
  },
}

export const pillarOrder: PillarKey[] = [
  'environment',
  'society',
  'culture',
  'finance',
]

export const briefSeeds: BriefSeed[] = [
  {
    title: 'Solar-Powered Online Publication',
    projectType: 'online publication',
    brief:
      'Design an online publication for climate reporting that runs on renewable hosting, publishes an energy budget beside each story, and commissions local illustrators to explain repair, reuse, and adaptation work.',
    primaryPillar: 'environment',
    secondaryPillars: ['culture', 'finance'],
    criteria: ['E1', 'E5', 'E13', 'C4', 'F2'],
    tags: ['energy', 'editorial', 'climate literacy'],
  },
  {
    title: 'Park-Feeding Food Packaging',
    projectType: 'food packaging system',
    brief:
      'Design a takeaway food packaging system made from compostable fiber with printed park drop-off maps, seed-safe ink, and a collection loop that turns lunch waste into soil for neighborhood green spaces.',
    primaryPillar: 'environment',
    secondaryPillars: ['society', 'finance'],
    criteria: ['E1', 'E14', 'S8', 'S16', 'F3'],
    tags: ['packaging', 'compost', 'parks'],
  },
  {
    title: 'Recyclable Exhibition In A Box',
    projectType: 'traveling exhibition',
    brief:
      'Design a flat-pack traveling exhibition that ships in its own display crates, uses mono-material panels, and includes take-home prompts for visitors to audit waste in their school or workplace.',
    primaryPillar: 'environment',
    secondaryPillars: ['culture', 'society'],
    criteria: ['E1', 'E5', 'E13', 'C2', 'S11'],
    tags: ['exhibition', 'flat-pack', 'waste audit'],
  },
  {
    title: 'Carbon-Literate Social Detox',
    projectType: 'social media campaign',
    brief:
      'Design a social media detox campaign that replaces one week of scrolling with printable neighborhood challenges, low-data reminders, and verified emissions offsets for every participating cohort.',
    primaryPillar: 'environment',
    secondaryPillars: ['society', 'finance'],
    criteria: ['E13', 'E14', 'S1', 'S8', 'F1'],
    tags: ['social media', 'wellbeing', 'offsets'],
  },
  {
    title: 'Sun-Powered Indigenous Practices Film',
    projectType: 'documentary video',
    brief:
      'Design a short documentary video series about local Indigenous land practices, powered during production by portable solar kits and released with community-approved captions, credits, and teaching notes.',
    primaryPillar: 'environment',
    secondaryPillars: ['culture', 'society'],
    criteria: ['E5', 'E13', 'C2', 'C5', 'S16'],
    tags: ['documentary', 'solar', 'Indigenous knowledge'],
  },
  {
    title: 'Heat-Safe Wayfinding System',
    projectType: 'wayfinding system',
    brief:
      'Design a pedestrian wayfinding system that maps shade, drinking water, cool interiors, and bus stops using durable low-ink signage installed along heat-vulnerable routes.',
    primaryPillar: 'environment',
    secondaryPillars: ['society', 'finance'],
    criteria: ['E14', 'S1', 'S8', 'S11', 'F3'],
    tags: ['wayfinding', 'heat resilience', 'public space'],
  },
  {
    title: 'Repair-First Product Label',
    projectType: 'product label',
    brief:
      'Design a product label that shows repair difficulty, spare-part availability, material origin, and end-of-life options as clearly as nutrition facts on food packaging.',
    primaryPillar: 'environment',
    secondaryPillars: ['finance', 'society'],
    criteria: ['E1', 'E5', 'E13', 'F2', 'S8'],
    tags: ['labeling', 'repair', 'materials'],
  },
  {
    title: 'Rainwater Festival Identity',
    projectType: 'event identity system',
    brief:
      'Design an event identity system for a rainwater festival with reusable banners, refill station graphics, and ticketing that funds small cistern installations after the event closes.',
    primaryPillar: 'environment',
    secondaryPillars: ['culture', 'finance'],
    criteria: ['E5', 'E14', 'C4', 'C6', 'F1'],
    tags: ['event', 'water', 'reuse'],
  },
  {
    title: 'Low-Bandwidth Climate Report',
    projectType: 'digital report',
    brief:
      'Design a low-bandwidth digital report that turns climate risk data into fast-loading charts, downloadable posters, and neighborhood checklists for planners and residents.',
    primaryPillar: 'environment',
    secondaryPillars: ['society', 'finance'],
    criteria: ['E13', 'E14', 'S11', 'S16', 'F4'],
    tags: ['report', 'low-bandwidth', 'climate risk'],
  },
  {
    title: 'Circular Pop-Up Swap Installation',
    projectType: 'pop-up installation',
    brief:
      'Design a modular pop-up installation where residents swap household goods, learn quick repair skills, and see a live tally of waste diverted from landfill.',
    primaryPillar: 'environment',
    secondaryPillars: ['society', 'culture'],
    criteria: ['E1', 'E5', 'S8', 'S16', 'C6'],
    tags: ['installation', 'swap', 'repair'],
  },
  {
    title: 'Biodiversity Museum Labels',
    projectType: 'museum label system',
    brief:
      'Design a museum label system that links specimens to local habitat restoration tasks, citizen science routes, and small actions visitors can complete within a week.',
    primaryPillar: 'environment',
    secondaryPillars: ['culture', 'society'],
    criteria: ['E13', 'E14', 'C2', 'C4', 'S11'],
    tags: ['museum', 'biodiversity', 'citizen science'],
  },
  {
    title: 'Accessible Clinic Toolkit',
    projectType: 'public health toolkit',
    brief:
      'Design a public health toolkit for clinics that uses plain-language cards, multilingual posters, and appointment reminders built with patients who often miss care because of cost, work, or transport.',
    primaryPillar: 'society',
    secondaryPillars: ['culture', 'finance'],
    criteria: ['S1', 'S8', 'S11', 'C5', 'F3'],
    tags: ['health', 'accessibility', 'clinics'],
  },
  {
    title: 'Community Cooling Archive',
    projectType: 'community archive',
    brief:
      'Design a community archive that gathers resident heatwave stories, maps informal cooling spaces, and turns the findings into policy postcards and public listening sessions.',
    primaryPillar: 'society',
    secondaryPillars: ['environment', 'culture'],
    criteria: ['S1', 'S16', 'E14', 'C2', 'C6'],
    tags: ['archive', 'heat', 'policy'],
  },
  {
    title: 'Tenant Rights Poster Campaign',
    projectType: 'poster campaign',
    brief:
      'Design a tenant rights poster campaign with tear-off legal resources, building-lobby translations, and QR-light versions that work for residents with older phones.',
    primaryPillar: 'society',
    secondaryPillars: ['culture', 'finance'],
    criteria: ['S1', 'S8', 'S11', 'C5', 'F4'],
    tags: ['housing', 'posters', 'rights'],
  },
  {
    title: 'Food Pantry Wayfinding',
    projectType: 'wayfinding system',
    brief:
      'Design a food pantry wayfinding system that protects privacy, shortens waiting time, and helps volunteers direct visitors without forcing people to repeat personal information.',
    primaryPillar: 'society',
    secondaryPillars: ['finance', 'culture'],
    criteria: ['S1', 'S8', 'S16', 'F3', 'C5'],
    tags: ['food access', 'wayfinding', 'privacy'],
  },
  {
    title: 'Caregiver Repair Manual',
    projectType: 'repair manual',
    brief:
      'Design a repair manual for donated mobility aids, using illustrated steps, parts sourcing notes, and volunteer training pages that help caregivers keep equipment in service longer.',
    primaryPillar: 'society',
    secondaryPillars: ['environment', 'finance'],
    criteria: ['S8', 'S11', 'E1', 'E5', 'F2'],
    tags: ['caregiving', 'repair', 'mobility'],
  },
  {
    title: 'Mutual Aid Card Deck',
    projectType: 'educational card deck',
    brief:
      'Design an educational card deck that helps neighborhood groups plan mutual aid roles, shared supplies, communication trees, and emergency check-ins before a crisis begins.',
    primaryPillar: 'society',
    secondaryPillars: ['culture', 'environment'],
    criteria: ['S1', 'S16', 'C6', 'E14', 'S11'],
    tags: ['mutual aid', 'education', 'emergency'],
  },
  {
    title: 'Low-Bandwidth Benefits Website',
    projectType: 'low-bandwidth website',
    brief:
      'Design a low-bandwidth website that helps families compare public benefits, gather documents, and print a one-page action plan at libraries, schools, and community centers.',
    primaryPillar: 'society',
    secondaryPillars: ['finance', 'culture'],
    criteria: ['S1', 'S8', 'S11', 'F4', 'C5'],
    tags: ['benefits', 'low-bandwidth', 'families'],
  },
  {
    title: 'Youth Safety Social Campaign',
    projectType: 'social media campaign',
    brief:
      'Design a youth safety social media campaign co-authored with students, using short videos, printable pledge cards, and local service links instead of fear-based messaging.',
    primaryPillar: 'society',
    secondaryPillars: ['culture', 'finance'],
    criteria: ['S1', 'S16', 'C4', 'C5', 'F1'],
    tags: ['youth', 'safety', 'campaign'],
  },
  {
    title: 'Inclusive Hiring Digital Report',
    projectType: 'digital report',
    brief:
      'Design a digital report that shows employers how inclusive hiring changes retention, with real worker stories, plain charts, and a practical budget for accessibility upgrades.',
    primaryPillar: 'society',
    secondaryPillars: ['finance', 'culture'],
    criteria: ['S8', 'S11', 'S16', 'F2', 'C5'],
    tags: ['hiring', 'report', 'accessibility'],
  },
  {
    title: 'Mobile Library Pop-Up',
    projectType: 'pop-up installation',
    brief:
      'Design a mobile library pop-up for transit stops that lends books, phone chargers, and service guides while collecting resident requests for future neighborhood programming.',
    primaryPillar: 'society',
    secondaryPillars: ['culture', 'finance'],
    criteria: ['S1', 'S8', 'C6', 'F3', 'S16'],
    tags: ['library', 'transit', 'public service'],
  },
  {
    title: 'Accessible Ballot Explainer',
    projectType: 'online publication',
    brief:
      'Design an accessible ballot explainer with audio summaries, large-print downloads, and community translations that help first-time voters understand local measures.',
    primaryPillar: 'society',
    secondaryPillars: ['culture', 'finance'],
    criteria: ['S1', 'S11', 'S16', 'C5', 'F4'],
    tags: ['voting', 'accessibility', 'publication'],
  },
  {
    title: 'Neighborhood Memory Archive',
    projectType: 'community archive',
    brief:
      'Design a community archive that preserves storefront signs, family photographs, oral histories, and migration maps before redevelopment erases everyday neighborhood memory.',
    primaryPillar: 'culture',
    secondaryPillars: ['society', 'finance'],
    criteria: ['C2', 'C4', 'C5', 'S16', 'F1'],
    tags: ['archive', 'redevelopment', 'memory'],
  },
  {
    title: 'Indigenous Plant Label System',
    projectType: 'museum label system',
    brief:
      'Design a museum label system for Indigenous plant knowledge with community review, language pronunciation guides, and clear limits on what should not be extracted or commercialized.',
    primaryPillar: 'culture',
    secondaryPillars: ['environment', 'society'],
    criteria: ['C2', 'C5', 'C6', 'E13', 'S16'],
    tags: ['museum', 'plants', 'language'],
  },
  {
    title: 'Festival Of Repair Identity',
    projectType: 'event identity system',
    brief:
      'Design an event identity system for a festival of repair, combining local craft motifs, tool-lending signage, maker profiles, and sponsor packages for neighborhood businesses.',
    primaryPillar: 'culture',
    secondaryPillars: ['environment', 'finance'],
    criteria: ['C4', 'C6', 'E1', 'E5', 'F1'],
    tags: ['festival', 'repair', 'craft'],
  },
  {
    title: 'Language Access Card Deck',
    projectType: 'educational card deck',
    brief:
      'Design an educational card deck that helps public agencies test language access, recognize cultural nuance, and rewrite confusing service instructions with community reviewers.',
    primaryPillar: 'culture',
    secondaryPillars: ['society', 'finance'],
    criteria: ['C2', 'C5', 'C6', 'S1', 'F4'],
    tags: ['language', 'public service', 'training'],
  },
  {
    title: 'Street Vendor Documentary',
    projectType: 'documentary video',
    brief:
      'Design a documentary video about street vendor knowledge, pairing portraits, route maps, food histories, and permit explainers that can support both dignity and legal reform.',
    primaryPillar: 'culture',
    secondaryPillars: ['society', 'finance'],
    criteria: ['C2', 'C4', 'S8', 'S16', 'F1'],
    tags: ['documentary', 'vendors', 'food culture'],
  },
  {
    title: 'Cultural Compost Packaging',
    projectType: 'food packaging',
    brief:
      'Design a food packaging line for a cultural market that tells ingredient origin stories, uses compostable materials, and funds apprenticeships for young cooks and designers.',
    primaryPillar: 'culture',
    secondaryPillars: ['environment', 'finance'],
    criteria: ['C4', 'C6', 'E1', 'E14', 'F2'],
    tags: ['packaging', 'market', 'apprenticeship'],
  },
  {
    title: 'Heritage Walk Wayfinding',
    projectType: 'wayfinding system',
    brief:
      'Design a heritage walk wayfinding system with bilingual plaques, audio memories, shade-route overlays, and small-business coupons that keep foot traffic local.',
    primaryPillar: 'culture',
    secondaryPillars: ['society', 'finance'],
    criteria: ['C2', 'C4', 'C5', 'S16', 'F1'],
    tags: ['wayfinding', 'heritage', 'local business'],
  },
  {
    title: 'Migration Story Poster Campaign',
    projectType: 'poster campaign',
    brief:
      'Design a poster campaign that shares migration stories through portraits, family objects, and public prompts, then routes viewers to community-led legal and cultural resources.',
    primaryPillar: 'culture',
    secondaryPillars: ['society', 'environment'],
    criteria: ['C2', 'C5', 'S1', 'S16', 'E5'],
    tags: ['migration', 'posters', 'community resources'],
  },
  {
    title: 'Living Recipe Online Publication',
    projectType: 'online publication',
    brief:
      'Design an online publication for living recipes, where elders, farmers, and cooks document seasonal food knowledge with low-data pages and clear permissions for reuse.',
    primaryPillar: 'culture',
    secondaryPillars: ['environment', 'society'],
    criteria: ['C2', 'C4', 'C6', 'E13', 'S16'],
    tags: ['recipes', 'publication', 'seasonal food'],
  },
  {
    title: 'Ceremony-Safe Pop-Up Installation',
    projectType: 'pop-up installation',
    brief:
      'Design a pop-up installation for cultural ceremonies that uses modular screens, respectful photography rules, reusable materials, and a host guide for non-extractive visitor behavior.',
    primaryPillar: 'culture',
    secondaryPillars: ['society', 'environment'],
    criteria: ['C2', 'C5', 'C6', 'S16', 'E1'],
    tags: ['installation', 'ceremony', 'visitor guidance'],
  },
  {
    title: 'Market-Ready Refill Label',
    projectType: 'product label',
    brief:
      'Design a product label for a refillable household cleaner that makes deposit pricing, refill locations, scent options, and impact savings obvious at shelf distance.',
    primaryPillar: 'finance',
    secondaryPillars: ['environment', 'society'],
    criteria: ['F1', 'F2', 'E1', 'E13', 'S8'],
    tags: ['refill', 'label', 'retail'],
  },
  {
    title: 'Sponsor-Ready Impact Report',
    projectType: 'digital report',
    brief:
      'Design a sponsor-ready digital report for a community arts nonprofit, showing audience reach, local spending, accessibility gains, and carbon-light production choices.',
    primaryPillar: 'finance',
    secondaryPillars: ['culture', 'environment'],
    criteria: ['F1', 'F2', 'F4', 'C6', 'E13'],
    tags: ['report', 'sponsorship', 'arts'],
  },
  {
    title: 'Circular Loyalty Campaign',
    projectType: 'social media campaign',
    brief:
      'Design a social media campaign for a repair shop network that turns repeat repairs into loyalty rewards, publishes repair wins, and makes service pricing easy to compare.',
    primaryPillar: 'finance',
    secondaryPillars: ['environment', 'society'],
    criteria: ['F1', 'F3', 'E1', 'E5', 'S8'],
    tags: ['repair', 'loyalty', 'pricing'],
  },
  {
    title: 'Transit Retail Wayfinding',
    projectType: 'wayfinding system',
    brief:
      'Design a transit-station wayfinding system that guides commuters to local vendors, public services, and refill points while giving small businesses affordable ad placements.',
    primaryPillar: 'finance',
    secondaryPillars: ['society', 'environment'],
    criteria: ['F1', 'F3', 'S8', 'S11', 'E14'],
    tags: ['transit', 'retail', 'vendors'],
  },
  {
    title: 'Subscription Repair Manual',
    projectType: 'repair manual',
    brief:
      'Design a subscription repair manual for shared appliances, with illustrated diagnostics, parts bundles, maintenance calendars, and a pricing model that rewards longer product life.',
    primaryPillar: 'finance',
    secondaryPillars: ['environment', 'society'],
    criteria: ['F2', 'F3', 'E1', 'E5', 'S8'],
    tags: ['subscription', 'repair', 'appliances'],
  },
  {
    title: 'Affordable Solar Kit Packaging',
    projectType: 'food packaging',
    brief:
      'Design an affordable solar cooking kit package for street food vendors, with rugged instructions, financing information, maintenance diagrams, and visible fuel-cost savings.',
    primaryPillar: 'finance',
    secondaryPillars: ['environment', 'society'],
    criteria: ['F1', 'F2', 'E13', 'E14', 'S8'],
    tags: ['solar', 'vendors', 'packaging'],
  },
  {
    title: 'Pop-Up Marketplace Identity',
    projectType: 'event identity system',
    brief:
      'Design an event identity system for a pop-up marketplace that gives microvendors shared signage, transparent fee tiers, waste sorting graphics, and reusable booth templates.',
    primaryPillar: 'finance',
    secondaryPillars: ['society', 'environment'],
    criteria: ['F1', 'F3', 'S8', 'S16', 'E1'],
    tags: ['marketplace', 'microvendors', 'reuse'],
  },
  {
    title: 'Investor Climate Card Deck',
    projectType: 'educational card deck',
    brief:
      'Design an educational card deck that helps founders explain climate risk, customer value, pricing, and community safeguards during early investor conversations.',
    primaryPillar: 'finance',
    secondaryPillars: ['environment', 'society'],
    criteria: ['F1', 'F2', 'F4', 'E13', 'S11'],
    tags: ['investment', 'climate risk', 'founders'],
  },
  {
    title: 'Lean Museum Membership Campaign',
    projectType: 'poster campaign',
    brief:
      'Design a museum membership poster campaign that sells flexible community passes, highlights local artists, and explains how each pass funds free school visits.',
    primaryPillar: 'finance',
    secondaryPillars: ['culture', 'society'],
    criteria: ['F1', 'F2', 'C4', 'C6', 'S1'],
    tags: ['museum', 'membership', 'schools'],
  },
  {
    title: 'Low-Cost Skills Website',
    projectType: 'low-bandwidth website',
    brief:
      'Design a low-bandwidth website for paid neighborhood skill exchanges, with clear rates, trust signals, service categories, and offline flyers that bring non-digital users into the network.',
    primaryPillar: 'finance',
    secondaryPillars: ['society', 'culture'],
    criteria: ['F1', 'F3', 'F4', 'S8', 'C6'],
    tags: ['skills', 'low-bandwidth', 'local economy'],
  },
  {
    title: 'Revenue-Generating Public Health Toolkit',
    projectType: 'public health toolkit',
    brief:
      'Design a public health toolkit that clinics can license affordably, customize quickly, and use to reduce missed appointments through printed reminders and culturally specific outreach templates.',
    primaryPillar: 'finance',
    secondaryPillars: ['society', 'culture'],
    criteria: ['F2', 'F3', 'F4', 'S1', 'C5'],
    tags: ['health', 'licensing', 'templates'],
  },
]
