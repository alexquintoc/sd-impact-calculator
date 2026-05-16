# SD Standard (Beta)

The SD Standard is an open framework for evaluating sustainability in visual communication and design projects across four interconnected pillars:

Environmental impact
Social responsibility
Cultural sustainability
Financial sustainability

Originally developed as a criteria-based guideline for communication design projects, the SD Standard is evolving into a modular ecosystem of tools, documentation, and workflows that help designers integrate sustainability thinking into both project planning and project evaluation.

Current Beta Direction

Over the last few development cycles, the SD Standard platform has evolved from a static criteria document into a growing interactive toolkit that includes:

A dynamic impact calculator
A design brief generator
A quick project scan tool
A searchable knowledge base
Structured criteria and terminology datasets
Automated documentation generation
Experimental project reporting workflows

The project is currently being restructured into a modular architecture that separates:

core criteria data
documentation generation
interactive tools
project repositories
future CMS integrations

This architecture is intended to support future expansion into APIs, AI-assisted reporting tools, project databases, and public-facing sustainability dashboards for design projects.

Knowledge Base + Generated Documentation

The repository now includes an automated documentation pipeline that generates criteria, pillar, and terminology documentation directly from structured JSON sources.

The current system automatically generates:

Criteria reference pages
Pillar overview pages
Related terminology pages
Metadata used by the calculator and future reporting tools

This approach allows the SD Standard to maintain a single source of truth for sustainability criteria while supporting multiple interfaces and tools.

Criteria Evolution

The criteria framework is currently undergoing a major v2 restructuring that includes:

clearer criterion IDs and naming conventions
mandatory baseline criteria
improved accessibility and AI-related criteria
support for entity-level vs project-level evaluation
expanded metadata and terminology mapping
compatibility with future scoring and reporting systems

The latest draft reorganizes the framework into:

Mandatory criteria
Environmental criteria
Social criteria
Cultural criteria
Financial criteria
Experimental Features

The platform is actively exploring:

AI-assisted sustainability reporting
Sustainability “linting” for design projects
Portfolio/project sustainability dashboards
TinaCMS-based project repositories
mdBook-powered documentation systems
Structured sustainability metadata for communication projects
Public-facing project profiles and impact summaries
Repository Structure (in progress)

The repository is currently transitioning toward a unified application structure:

Route	Purpose
/	Homepage
/calculator     Impact Calculator
/brief-generator    Sustainable Design Brief Tool
/project-scan   Quick Project Scan
/knowledge-base	Documentation + criteria reference
/projects	Project repository / case studies
/admin	CMS administration

Philosophy

The SD Standard is intentionally designed as:

open-ended rather than prescriptive
adaptable across disciplines
compatible with existing sustainability systems
practical for small studios and independent designers
scalable toward institutional and international use

The project aims to help designers move beyond purely aesthetic or commercial metrics and consider how communication design influences ecological systems, communities, culture, governance, and long-term resilience.

Current Tech Stack:

Next.js
MDbook
TinaCMS
JSON-driven documentation
Tailwind
Netlify/Vercel deployment
GitHub-based content workflows

# Documentation:
https://alexquintoc.github.io/sd-standard/