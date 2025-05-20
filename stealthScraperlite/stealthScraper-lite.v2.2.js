// Node.js Web Scraper v2.2 — Markdown Table Support + Organized Folder
const http = require('http');
const https = require('https');
const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');

// Prompt user for URL
function promptURL() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question('Enter a URL: ', answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// HTTP fetch with timeout
function fetchWithTimeout(url, timeout = 10000) {
  const client = url.startsWith('https') ? https : http;
  return new Promise((resolve, reject) => {
    const req = client.get(url, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.setTimeout(timeout, () => {
      req.abort();
      reject(new Error('Timeout after ' + timeout / 1000 + 's'));
    });
  });
}

// Extract from main > article > section > body > fallback to full HTML
function extractContent(html) {
  let match;
  let content = '';
  let source = '';

  const tagsToTry = ['main', 'article', 'section', 'body'];
  for (const tag of tagsToTry) {
    match = html.match(new RegExp(`<${tag}[^>]*>([\s\S]*?)<\/${tag}>`, 'i'));
    if (match && match[1].replace(/<[^>]+>/g, '').trim().length > 10) {
      content = match[1];
      source = tag;
      break;
    }
  }

  if (!content) {
    content = html; // fallback
    source = 'full HTML';
  }

  console.log('Extracted from:', source);
  return content;
}

// Convert HTML tables to Markdown
function convertTablesToMarkdown(html) {
  return html.replace(/<table[\s\S]*?<\/table>/gi, table => {
    let headers = [];
    let rows = [];

    const headerMatch = table.match(/<thead[^>]*>([\s\S]*?)<\/thead>/i);
    if (headerMatch) {
      const cols = [...headerMatch[1].matchAll(/<th[^>]*>(.*?)<\/th>/gi)];
      headers = cols.map(col => col[1].trim());
    }

    const bodyMatch = table.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
    if (bodyMatch) {
      const rowMatches = [...bodyMatch[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
      for (const row of rowMatches) {
        const cols = [...row[1].matchAll(/<t[dh][^>]*>(.*?)<\/t[dh]>/gi)];
        rows.push(cols.map(col => col[1].trim()));
      }
    }

    if (headers.length === 0 && rows.length > 0) {
      headers = Array(rows[0].length).fill('');
    }

    const md = [];
    if (headers.length) {
      md.push('| ' + headers.join(' | ') + ' |');
      md.push('| ' + headers.map(() => '---').join(' | ') + ' |');
    }
    rows.forEach(row => {
      md.push('| ' + row.join(' | ') + ' |');
    });

    return md.join('\n');
  });
}

// Decode HTML entities
function decodeEntities(str) {
  const entities = {
    amp: '&', lt: '<', gt: '>', quot: '"', apos: "'",
    ndash: '–', mdash: '—', hellip: '…', eacute: 'é',
  };
  str = str.replace(/&([a-zA-Z]+);/g, (m, n) => entities[n] || m);
  str = str.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
  str = str.replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)));
  return str;
}

// Remove clutter lines
function filterLines(text) {
  const lines = text.split('\n');
  const ignoreKeywords = [
    'skip to content', 'popular integrations', 'show more integrations',
    'cookie', 'where to get help', 'license', 'back to top',
    'trending', 'workflow templates', 'explore more categories',
    'login', 'logout', 'navigation', 'insiders', 'search', 'sign in'
  ];

  return lines.filter(line => {
    const l = line.toLowerCase();
    if (l.length < 3) return false;
    if (ignoreKeywords.some(k => l.includes(k))) return false;
    if ((line.match(/http/gi) || []).length > 3) return false;
    return true;
  }).join('\n');
}

// Clean, convert, and format
function cleanText(htmlFragment) {
  let html = convertTablesToMarkdown(htmlFragment);
  let text = html.replace(/<[^>]+>/g, '');
  text = decodeEntities(text);
  text = text.replace(/\s{2,}/g, ' ');
  text = text.replace(/\n{2,}/g, '\n');
  return filterLines(text.trim());
}

// Main runner
async function main() {
  const url = await promptURL();
  if (!/^https?:\/\//i.test(url)) {
    console.error('Invalid URL.');
    return;
  }

  try {
    const html = await fetchWithTimeout(url);
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = (titleMatch ? titleMatch[1] : 'untitled').trim();
    const safeName = title.replace(/[\/\\?%*:|"<>]/g, '').slice(0, 50) || 'untitled';
    const content = cleanText(extractContent(html));
    const markdown = `# ${title}\n\n${content}\n`;

    const outDir = path.join(os.homedir(), 'Downloads', 'stealth-scraper');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const outPath = path.join(outDir, safeName + '.md');
    fs.writeFileSync(outPath, markdown);
    console.log('Saved:', outPath);
  } catch (err) {
    console.error('Error:', err.message);
  }
}
main();
