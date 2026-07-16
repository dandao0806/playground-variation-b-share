# Plymouth Rock Design Playground

A private sandbox for designing Plymouth Rock screens with **real PRCINS UI
components**. Describe what you want to Claude Code in plain English, and it
builds the page — no hand-coding required.

Use this repo as a reusable template. Copy it, run it locally, then prompt
Claude Code to prototype new screens on top.

---

## What's in the playground

- **Welcome** — landing page with quick links (Component Library, Figma
  Library, Code Connect Guides, Design Skills).
- **Example 1 — Premium Preview** — full auto-quote flow with sticky footer,
  progress stepper, tier tabs, coverage accordions.
- **Empty** — a blank starter page you can prompt Claude to fill.
- **Code Connect Guide** *(linked from Welcome)* — how our Figma components
  connect to the real code library.
- **Design Skills** *(linked from Welcome)* — catalog of installable AI
  instruction packs.

## Run it locally

You need [Node.js](https://nodejs.org) 18+ installed. Then, from the project
folder:

```
npm install
npm run dev
```

Open http://localhost:5173/ in your browser.

## Use it as a template

Anyone on the team can start a new prototype like this:

1. On GitHub, open this repo and click **Use this template → Create a new
   repository**.
2. Clone the new repo to your machine:
   ```
   git clone <your-new-repo-url>
   cd <your-new-repo>
   npm install
   npm run dev
   ```
3. Open http://localhost:5173/, click **Empty**, and start prompting
   Claude Code.

## Prototyping workflow

The whole point of this playground is that you don't build pages by hand.

1. In your terminal, `cd` into the project folder and run:
   ```
   claude
   ```
2. Describe the screen you want. Example:
   > On the empty page, build an auto insurance quote summary with coverage
   > details, a monthly price, and a Continue button.
3. Refresh the browser — the page appears.
4. For Figma-based prompts, copy the frame's dev-mode link from Figma and
   paste it into Claude Code with your instructions. Because our design
   system uses **Code Connect**, Claude will pull the real PRCINS UI
   components instead of recreating look-alikes.

For details, see the **Code Connect Guide** and **Design Skills** pages
inside the playground.

## PRCINS design system

The playground mirrors the PRCINS UI Angular library so React prototypes look
1:1 with production:

- **Color tokens** — full `--prcins-*` scale in `src/styles.css`
  (primary blue `#0078d6`, secondary orange `#ff7826`, plus success / info /
  warning / error / neutral 50–900).
- **Typography** — Manrope for titles, Open Sans for body (matches the
  library's `typography/primary` and `typography/secondary` tokens).
- **Components** — React ports of the PRCINS `Button`, `Alert`, `Link`, and
  `Accordion` in `src/components/`, consuming the same tokens.

When new components exist in the library, add matching React ports here.

## Push changes to GitHub

Once the repo is set up (see the one-time setup below), the everyday flow to
save your work back to GitHub is three commands:

```
git add .
git commit -m "Short description of what you changed"
git push
```

Run those in the project folder any time you want to publish your changes.

## Project structure

```
public/                  # static assets (favicon, plymouth-rock-logo.svg)
src/
  components/            # PRCINS-aligned React components
    Accordion.jsx
    Alert.jsx
    Button.jsx
    CodeBlock.jsx
    Link.jsx
  pages/                 # one file per playground page
    CodeConnectGuidePage.jsx
    DesignSkillsPage.jsx
    EmptyExamplePage.jsx
    EmptyPage.jsx        # Welcome page
    PremiumPreviewPage.jsx  # Example 1
    PrototypingSkillPage.jsx
  App.jsx                # routing + sidebar/topbar shell
  main.jsx               # Vite entry
  styles.css             # PRCINS tokens + all component styles
index.html
vite.config.js
CHANGELOG.md
LICENSE                  # internal-use only
```

## License

Internal Plymouth Rock use only. See [LICENSE](./LICENSE).
