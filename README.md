# StealthScraper Lite

**A clean, privacy-respecting, dependency-free Markdown web scraper built for surgical precision.**

> Fetch a web page, strip it to text, and save it as a clean `.md` file — all without touching `node_modules` or leaking a single byte more than you must.

---

## 🤝 Project Origins

<same content as original up to Features section>

---

## ✨ Features

- 🧼 **Clean Content Extraction** – Pulls readable text from `<main>`, `<article>`, `<section>`, then falls back to `<body>` or full HTML
- 🧠 **HTML Entity Decoding** – Decodes both named and numeric entities
- 📊 **Markdown Table Support** – Converts HTML `<table>` elements to Markdown table syntax
- 🛡️ **Terminal-Safe Output** – Escaped, sanitized, and filesystem-safe
- 📁 **Organized Output** – Files saved to `~/Downloads/stealth-scraper/` by default
- 👁️ **Preview Mode** – Use `--preview` to view in terminal instead of saving
- 🪶 **100% Dependency-Free** – No installs, no `node_modules`, no nonsense
- 🕵️ **Private by Design** – No outbound data or telemetry

---

## 🔧 Installation

```bash
git clone https://github.com/your-username/stealthscraper-lite.git
cd stealthscraper-lite
```

---

## 🚀 Usage

```bash
node stealthScraper-lite.v2.2.js
```

- Paste a URL when prompted.
- File will be saved as `.md` in your Downloads under `stealth-scraper`.

```bash
node stealthScraper-lite.v2.2.js --preview
```

---

## 🛣️ Version Journey

This tool didn’t just get built — it *evolved* like a crusty mech in a junkyard turned war machine.

- **`clean.js`**: Rewritten from a Python-JS hybrid into proper modular Node.js.
- **`v2.0`**: Added smart fallback from `<main>` to full `<body>`.
- **`v2.1`**: Added junk filters to clean up headers/footers/menus.
- **`v2.2`**: Converted HTML `<table>` to Markdown. Created a dedicated output folder. Became the final form… for now.

---

## 🧠 Why This Exists

Other scrapers are bloated, tracked, overengineered. This one exists to be:

- ✈️ Aircraft-manual ready
- 🔒 CLI + airgap friendly
- 🥷 Surgical, disposable, fast

---

## 📜 License

MIT — because freedom should be clean and forkable.

---

## 👑 Built By

**Amor** (the caveman with a vision), **ChatGPT** (the enabler), and **a lot of yelling at Copilot.**

---

## 🙌 I Want to Hear From You

Did you use StealthScraper Lite on a weird page?  
Save some ancient documentation?  
Turn it into a daily automation tool?

**Tell me. Seriously. I want to know.**

Open an [issue](https://github.com/McJuniorstein/stealthscraper-lite/issues) and say hi, or tag me [@McJuniorstein](https://github.com/McJuniorstein) with what you did.

> This project was built for personal use — but I'd love to see what *you* make it do.

