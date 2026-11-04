# Dhyan Patel — Portfolio

A responsive personal portfolio for applied AI and full-stack engineering. Original generative canvas artwork, subtle scroll reveals, dark/light themes, project filtering, accessible project dialogs, and a downloadable public resume. No portrait, phone number, analytics, or third-party runtime requests.

## Run locally

Requires Node.js 20 or newer. There are no npm dependencies to install.

```sh
npm run dev
```

Open http://127.0.0.1:4173. To validate and build:

```sh
npm run check
npm run build
npm run preview
```

## Edit content

- `src/index.html`: profile, experience, toolkit, project summaries, contact links.
- `src/main.js`: project stories and interactions, including the original canvas sculpture.
- `src/styles.css`: responsive layouts and theme tokens.
- `src/assets/Dhyan_Patel_Resume.pdf`: public resume; the contact header contains only the requested Gmail address and LinkedIn.

The original resume stays outside this repository. Do not replace the public copy with a version containing a phone number. All visible email links use `dhyanpatel2632003@gmail.com`.

## Content sources

Personal details and experience are based on the user-supplied November 2026 resume and the DA-IICT Find-Your-Advisor entry in Dhyan_CV.pdf. The user confirmed the DA-IICT internship dates as May–August 2023. Projects were checked against the public READMEs for [TrustMed AI](https://github.com/DhyanICT/Trusted_Medical_AI), [Computer-Use Automation](https://github.com/DhyanICT/Computer-Use-Automation), [Proofboard](https://github.com/DhyanICT/deepspace_proofboard), and [Task Board](https://github.com/DhyanICT/Task_Board_NextPlay). TrustMed's project details explicitly identify the seven-query retrieval baseline. Proofboard credits AI-assisted implementation. Project illustrations are authored concept views, not screenshots of the apps. The LinkedIn profile URL was confirmed from the supplied resume and GitHub profile; LinkedIn profile content was not accessible during authoring.

## Deployment

The included GitHub Actions workflow checks, builds, and deploys `dist/` to GitHub Pages on pushes to `main`. In repository **Settings → Pages**, select **GitHub Actions** as the source. All local asset paths are relative, so project Pages subpaths work without configuration. The site can also be hosted on any static host using `dist/`.

`.openai/hosting.json` identifies the private Sites preview and its static output directory. This does not replace the GitHub repository.

## Accessibility and motion

Semantic sections, keyboard focus indicators, a skip link, native modal focus handling, labelled controls, and `prefers-reduced-motion` support are included. Canvas animation pauses when offscreen or when the tab is hidden. Content remains visible when JavaScript is unavailable.

## Fonts

Self-hosted variable Manrope, DM Mono, and Instrument Serif in WOFF2 format, licensed under the SIL Open Font License. License texts are in `src/assets/`.

November 2026 content refresh: the user confirmed the title Software Development Intern and supplied the updated SportX1 responsibilities and 88 merged PRs. Earlier roles were tightened without changing their dates. TrustMed’s card labels the 87.5% Recall@15 metric as a seven-query baseline. Font payloads total about 83 KB, including regular and italic display serif. Scroll reveals fall back after four seconds and are forced visible for print.
