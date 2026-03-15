# SD Impact Calculator

An open-source, client-side web application that helps designers evaluate projects across four pillars:

Environmental

Social

Cultural

Financial

Projects are assessed using a configurable point-based system. Each pillar has a fixed certification threshold. A project is considered SD Standard Certified only if all four pillars meet or exceed the required score.

The scoring system is fully configurable via an independent JSON file, making the framework adaptable and extensible.

How It Works

Criteria and point values are loaded from:

client/public/data/criteria.json

Each criterion has three possible states:

Meets → adds full points

Not yet → adds 0 points

N/A → adds 0 points (no normalization)

Each pillar has a fixed pass threshold of 50 points.

Overall certification requires passing all four pillars.

Running Locally

Install dependencies:

npm install

Start the development server:

npm run dev

Open the local URL shown in your terminal.

Customizing the Scoring System

The entire point system is decoupled from the application logic.

To modify or replace criteria:

Edit or replace:

client/public/data/criteria.json

No code changes are required as long as the JSON schema remains consistent.

This makes the calculator adaptable for:

Different design disciplines

Regional standards

Institutional frameworks

Future SD Standard revisions

License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0).

This means:

You are free to use, modify, and distribute this software.

If you distribute modified versions, you must also release them under GPL-3.0.

Derivative works must remain open-source under the same license.

See the LICENSE file for full terms.

Contributing

Contributions are welcome.

When contributing:

Keep scoring logic separate from UI logic.

Do not hardcode criteria into the application.

Maintain accessibility and transparency in scoring rules.

Please open an issue or submit a pull request for discussion.

# Documentation:
https://alexquintoc.github.io/sd-standard/