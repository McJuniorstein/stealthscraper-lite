# StealthScraper Lite

**A clean, privacy-respecting, dependency-free Markdown web scraper built for surgical precision.**

> Fetch a web page, strip it to text, and save it as a clean `.md` file — all without touching `node_modules` or leaking a single byte more than you must.

---

## 🤝 Project Origins

### ☠️ The Lost Folder

Before this sleek little script emerged, there was **The Folder** — a monstrous 200MB npm-generated abomination.

It began innocently enough: install `node-fetch`, add `cheerio`, maybe a helper or two. But by the time the dust settled, we were staring down a `node_modules/` directory with more licenses than lines of code, half the internet downloaded, and three separate versions of `whatwg-url`.

The folder has since been deleted... but not forgotten.

Let it stand as a warning:

> "If your scraper pulls in 300 dependencies just to save a webpage as text, you’re not writing software — you’re building a liability."

This tool is the result of a proudly chaotic collaboration fueled by curiosity, caffeine, and a redneck aircraft inspector with zero formal code training:

* 🪓 A self-proclaimed caveman typing with meat hammers
* 🤖 ChatGPT, acting as an architect, QA analyst, and voice of reason
* 🧠 GitHub Copilot, given precise tasks and stern judgment until she earned her wings

> "This project exists to answer one question: What happens when a redneck gets AI tools sharp enough to cut steel, and the patience to weaponize simplicity?"

---

## ✨ Features

* 🧼 **Clean Content Extraction** – Pulls readable text from `<body>`, with smart fallback to `<main>` or `<article>`
* 🧠 **HTML Entity Decoding** – Decodes both named and numeric entities (e.g. `&eacute;`, `&#8211;`)
* 🛡️ **Terminal-Safe Output** – Strips unsafe characters to prevent escape code injection
* ⏳ **Timeout-Protected Requests** – Auto-aborts if a server hangs beyond 10 seconds
* 📁 **Safe Filename Handling** – Sanitizes and truncates page titles into filesystem-safe Markdown names
* 👁️ **Preview Mode** – Use `--preview` to print the result to terminal instead of saving
* 🪶 **100% Dependency-Free** – No `node-fetch`, no `cheerio`, no `npm install`
* 🕵️ **Private by Design** – Makes no outbound calls except the target URL

---

## 🔧 Installation

Clone this repo or download `stealthScraper-lite.js` directly:

```bash
git clone https://github.com/your-username/stealthscraper-lite.git
cd stealthscraper-lite
```

---

## 🚀 Usage

### Basic:

```bash
node stealthScraper-lite.js https://example.com
```

### Preview:

```bash
node stealthScraper-lite.js https://example.com --preview
```

* Markdown will be saved to your `~/Downloads` folder.
* If `--preview` is used, it prints to terminal instead.

---

## 🧠 Why This Exists

Other scrapers require hundreds of megabytes of dependencies, install trackers, or leak user data through hidden analytics. This script was built for:

* ✈️ **Offline-readability workflows**
* 🔒 **Minimal surface automation**
* 🥷 **Covert ops (personal, investigative, or educational)**
* 🛠️ **Redneck engineering meets AI assistance**

It’s not perfect for every site. But for docs, articles, recipes, and simple static pages? It’s a ghost.

---

## ⚠️ Security Notes

* All terminal output is sanitized to prevent terminal escape vulnerabilities
* Filenames are scrubbed of dangerous characters and limited to 50 characters
* Page title fallback: `untitled.md` if title parsing fails
* No telemetry, no external logs, no tracking

---

## 🛠️ Future Ideas

* [ ] Better entity decoding coverage (edge cases)
* [ ] Optional image listing mode (`--list-images`)
* [ ] Configurable save location
* [ ] Full CLI interface using `process.argv` parsing

---

## 📜 License

MIT — because freedom should be clean and forkable.

---

## 🚫 Ethical Statement

This project does **not support** scraping gated, paywalled, or copyrighted content without permission. It is built for personal offline use, open content, public documentation, and educational sites.

Use responsibly. Stay stealthy.

---

## 👑 Author

**Built by Amor. Hardened by Gabriela. Audited by ChatGPT. Steered by sheer determination and caffeine.**

> *"If `node_modules` touches my scraper, I’ll burn it in a ritual fire."*
