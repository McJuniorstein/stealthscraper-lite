// FINAL POLISH: Refactor the script with these tiny but important tweaks:
//
// 1. Move `decodeEntities(str)` OUT of `main()` and define it as a separate top-level function
//    - This keeps the script modular and easier to maintain
//
// 2. Combine the tag-stripping and entity-decoding logic into a helper function:
//    function cleanText(htmlFragment)
//    - It should remove all HTML tags and decode HTML entities using `decodeEntities()`
//    - Collapse whitespace as a final step
//
// 3. Replace the inline cleaning logic inside `main()` with:
//    const text = cleanText(content);
//
// These small changes improve readability, modularity, and consistency.
//
// Keep everything else exactly the same.
// Use only built-in Node.js modules.
// Keep it under 120 lines.
// Then run `main()` at the end as before.

// FINAL OBJECTIVE: Refactor this stealth scraper into a clean, modular, silent tool
//
// The script should:
//
// 1. Wrap everything inside an async function called `main()`
// 2. Replace all raw HTML parsing with calls to:
//    - `extractContent(html)` → gets <body>, <main>, or <article> content
//    - `decodeEntities(str)` → decodes named and numeric HTML entities
// 3. Use `fetchWithTimeout(url, 10000)` to safely fetch the page and fail after 10s
// 4. Extract the <title> tag and sanitize it for use as a filename
// 5. Add a `--preview` CLI flag. If present, print the output instead of saving.
// 6. If not using preview, save the content as a Markdown file to ~/Downloads
// 7. Add logging for which tag was used (body → main → article) as source
//
// No external dependencies. Use only Node's built-in `fs`, `http`, `https`, `os`, and `path`.
//
// Keep it under 120 lines. Keep it clean. Keep it stealthy.
//
// Then call `main()` at the bottom.



//You're working on a stealth web scraper written in vanilla Node.js (no external libraries).

//The current version:
-// Uses `http`/`https` to fetch a page
- //Extracts the `<title>` and `<body>` via regex
- //Strips HTML and decodes a few basic entities
- //Saves to `~/Downloads` as a .md file

//Your task is to upgrade it with these 4 features:

1.// ⏱️ Add a request timeout of 10 seconds. If the server hangs, exit gracefully with an error message.
2.// 👁️ Add a `--preview` CLI flag. If present, print the markdown to the console instead of saving it to a file.
3. //🧪 Add fallback content detection: if `<body>` is missing or mostly empty, attempt to extract content from `<main>` or `<article>` instead.
4.// 💬 Replace the current entity decoder with one that decodes both named and numeric HTML entities like `&#8211;` or `&eacute;`.

//Do not add any libraries or dependencies. Use only core Node.js modules and custom helper functions.

//Keep the script modular, readable, and under 120 lines. Stealth and simplicity are top priorities.//

// Lightweight web scraper: fetches a URL, extracts visible text from <body>, saves as Markdown.
// Usage: node stealthScraper-lite.js https://example.com

const http = require('http');
const https = require('https');
const fs = require('fs');
const os = require('os');
const path = require('path');

// Get URL from command line
const url = process.argv[2];
if (!url) {
    console.error('Usage: node stealthScraper-lite.js <url>');
    process.exit(1);
}

// Fetch URL with timeout (returns a Promise that resolves with response data)
function fetchWithTimeout(url, timeout = 10000) {
    const client = url.startsWith('https') ? https : http;
    return new Promise((resolve, reject) => {
        const req = client.get(url, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        });
        req.on('error', reject);
        req.setTimeout(timeout, () => {
            req.abort();
            reject(new Error('Request timed out after ' + timeout/1000 + 's'));
        });
    });
}

// Extracts main visible content from HTML, with fallback to <main> or <article>
function extractContent(html) {
    // Try <body>
    let match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    let content = match ? match[1] : '';
    let source = 'body';
    // Remove script/style/noscript
    content = content.replace(/<script[\s\S]*?<\/script>/gi, '')
                     .replace(/<style[\s\S]*?<\/style>/gi, '')
                     .replace(/<noscript[\s\S]*?<\/noscript>/gi, '');
    // If empty or too short, try <main>
    if (!content.trim() || content.replace(/<[^>]+>/g, '').trim().length < 40) {
        match = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
        if (match) {
            content = match[1];
            source = 'main';
        }
    }
    // If still empty, try <article>
    if (!content.trim() || content.replace(/<[^>]+>/g, '').trim().length < 40) {
        match = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
        if (match) {
            content = match[1];
            source = 'article';
        }
    }
    console.log('📦 Extracted from: body → main → article (used:', source, ')');
    return content;
}

// Remove all HTML tags, decode entities, and collapse whitespace
function cleanText(htmlFragment) {
    let text = htmlFragment.replace(/<[^>]+>/g, '');
    text = decodeEntities(text);
    return text.replace(/\s{2,}/g, ' ').trim();
}

// Decode HTML entities (named and numeric)
function decodeEntities(str) {
    const entities = {
        amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
        copy: '©', reg: '®', euro: '€', ndash: '–', mdash: '—', hellip: '…',
        rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', eacute: 'é', aacute: 'á',
        oacute: 'ó', uacute: 'ú', iacute: 'í', egrave: 'è', agrave: 'à', ograve: 'ò',
        ugrave: 'ù', igrave: 'ì', ecirc: 'ê', acirc: 'â', ocirc: 'ô', ucirc: 'û', icirc: 'î'
        // Add more as needed
    };
    // Named entities
    str = str.replace(/&([a-zA-Z]+);/g, (m, n) => entities[n] || m);
    // Decimal numeric entities
    str = str.replace(/&#(\d+);/g, (m, n) => String.fromCharCode(Number(n)));
    // Hex numeric entities
    str = str.replace(/&#x([0-9a-fA-F]+);/g, (m, n) => String.fromCharCode(parseInt(n, 16)));
    return str;
}

// Fetch the page
fetchWithTimeout(url).then(data => {
        // Extract <title>
        let titleMatch = data.match(/<title[^>]*>([^<]*)<\/title>/i);
        let title = titleMatch ? titleMatch[1] : 'untitled';
        // Sanitize title for filename
        let safeTitle = title.replace(/[\/\\?%*:|"<>]/g, '').replace(/\s+/g, '_').slice(0, 50);

        // Extract content
        let content = extractContent(data);

        // Remove all HTML tags, decode entities, and collapse whitespace
        const text = cleanText(content);

        // Prepare Markdown content
        let md = `# ${title}\n\n${text}\n`;

        // Check for --preview flag
        const preview = process.argv.includes('--preview');
        if (preview) {
            console.log(md);
        } else {
            // Save to Downloads
            const downloads = path.join(os.homedir(), 'Downloads');
            const filePath = path.join(downloads, `${safeTitle}.md`);
            fs.writeFile(filePath, md, err => {
                if (err) {
                    console.error('Failed to save file:', err.message);
                } else {
                    console.log('Saved:', filePath);
                }
            });
        }
    }).catch(err => {
        console.error('Request failed:', err.message);
    });