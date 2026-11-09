// node make-html.js <in.md> <out.html> <title>  — small Markdown to self-contained HTML report. Local files only.
const fs = require('fs');
const [inp, out, title] = process.argv.slice(2);
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pills = { 'Seen live': 'ok', 'Earlier run': 'warn', 'Bundle': 'info', 'Check on screen': 'bad', 'Skipped for now': 'mute' };
const inline = s => {
  const codes = []; let t = s.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
  t = esc(t).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2">$1</a>');
  t = t.replace(/\[(serial|zoho-live|wait|mail|rec)\]/g, '<span class="pill info">$1</span>');
  for (const [k, c] of Object.entries(pills)) t = t.replace(new RegExp(`(^|[ .+])(${k})(?=[. +]|$)`, 'g'), `$1<span class="pill ${c}">$2</span>`);
  return t.replace(/\u0000(\d+)\u0000/g, (_, i) => { const c = codes[+i]; const m = /^\[(.*)\]$/.test(c); return `<code>${esc(c)}</code>`; });
};
const lines = fs.readFileSync(inp, 'utf8').split(/\r?\n/); let h = '', i = 0; let h1 = '';
const cells = l => l.trim().replace(/^\||\|$/g, '').split('|').map(x => x.trim());
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); const toc = [];
while (i < lines.length) {
  const l = lines[i];
  if (!l.trim()) { i++; continue; }
  let m;
  if ((m = l.match(/^(#{1,3}) (.*)/))) { const n = m[1].length; if (n === 1) h1 = m[2]; else { const id = slug(m[2]); if (n === 2) toc.push([id, m[2]]); h += `<h${n} id="${id}">${inline(m[2])}</h${n}>`; } i++; continue; }
  if (l.trim().startsWith('|') && (lines[i + 1] || '').match(/^\s*\|[-| :]+\|\s*$/)) {
    const hd = cells(l); i += 2; let rows = '';
    while (i < lines.length && lines[i].trim().startsWith('|')) { rows += '<tr>' + cells(lines[i]).map((c, k) => `<td${k === 0 ? ' class="id"' : ''}>${inline(c)}</td>`).join('') + '</tr>'; i++; }
    h += `<div class="scroll"><table><thead><tr>${hd.map(c => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`; continue;
  }
  if (/^\s*(- |\d+\. )/.test(l)) {
    const ord = /^\d+\. /.test(l); const start = ord ? parseInt(l) : 1; let items = [];
    while (i < lines.length && (/^\s*(- |\d+\. )/.test(lines[i]))) {
      const nest = /^\s{2,}- /.test(lines[i]); const txt = lines[i].replace(/^\s*(- |\d+\. )/, '');
      if (nest && items.length) items[items.length - 1].sub.push(txt); else { if (ord !== /^\d+\. /.test(lines[i])) break; items.push({ n: ord ? parseInt(lines[i]) : 0, txt, sub: [] }); }
      i++;
    }
    const tag = ord ? 'ol' : 'ul';
    h += `<${tag}${ord ? ` start="${start}"` : ''}>` + items.map(x => `<li${ord ? ` value="${x.n}"` : ''}>${inline(x.txt)}${x.sub.length ? '<ul>' + x.sub.map(s => `<li>${inline(s)}</li>`).join('') + '</ul>' : ''}</li>`).join('') + `</${tag}>`; continue;
  }
  h += `<p>${inline(l)}</p>`; i++;
}
const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title><style>
:root{--bg:#f6f7f9;--surface:#fff;--fg:#1b2230;--muted:#5a6476;--line:#dde2ea;--accent:#1f5f8b;--code:#eef1f5;--ok:#1e7a46;--oks:#e7f4ec;--warn:#8a5a00;--warns:#fbf1dc;--bad:#b3261e;--bads:#fbeaea;--info:#1f5f8b;--infos:#e6f0f7;--mute:#5a6476;--mutes:#e9ecf1}
@media (prefers-color-scheme:dark){:root{--bg:#12161d;--surface:#1a2029;--fg:#e3e8ef;--muted:#9aa5b5;--line:#2c3440;--accent:#7fb6dc;--code:#232a35;--ok:#8fd3aa;--oks:#17301f;--warn:#e9c46a;--warns:#332a14;--bad:#f2a29c;--bads:#3a1f1e;--info:#7fb6dc;--infos:#1c2d3b;--mute:#9aa5b5;--mutes:#262d38;color-scheme:dark}}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.6 "Segoe UI",system-ui,sans-serif}.wrap{max-width:1040px;margin:0 auto;padding:32px 16px 64px}
h1{font-size:1.8rem;line-height:1.25;margin:0 0 10px}h2{font-size:1.25rem;margin:34px 0 10px;padding-top:14px;border-top:1px solid var(--line)}h3{font-size:1.02rem;margin:20px 0 8px}p{margin:8px 0;max-width:78ch}
ul,ol{margin:8px 0;padding-left:1.5em;max-width:82ch}li{margin:4px 0}nav{background:var(--surface);border:1px solid var(--line);border-radius:6px;padding:10px 14px;font-size:.9rem;display:flex;flex-wrap:wrap;gap:4px 16px;margin:14px 0}
a{color:var(--accent)}code{font-family:Consolas,monospace;font-size:.86em;background:var(--code);padding:1px 5px;border-radius:4px;overflow-wrap:anywhere}
.scroll{overflow-x:auto;border:1px solid var(--line);border-radius:6px;background:var(--surface);margin:10px 0}table{border-collapse:collapse;width:100%;font-size:.9rem}th,td{text-align:left;padding:8px 11px;border-bottom:1px solid var(--line);vertical-align:top}tr:last-child td{border-bottom:0}th{color:var(--muted);font-size:.78rem;text-transform:uppercase;letter-spacing:.04em;background:var(--bg)}td.id{font-family:Consolas,monospace;font-size:.84rem;white-space:nowrap}
.pill{display:inline-block;font-size:.74rem;font-weight:600;padding:0 7px;border-radius:999px;white-space:nowrap}.ok{background:var(--oks);color:var(--ok)}.warn{background:var(--warns);color:var(--warn)}.bad{background:var(--bads);color:var(--bad)}.info{background:var(--infos);color:var(--info)}.mute{background:var(--mutes);color:var(--mute)}
</style></head><body><div class="wrap"><h1>${inline(h1)}</h1><nav>${toc.map(([id, t]) => `<a href="#${id}">${esc(t.replace(/\*\*/g, ''))}</a>`).join('')}</nav>${h}</div></body></html>`;
fs.writeFileSync(out, page); console.log('wrote', out, (page.length / 1024 | 0) + ' KB', toc.length + ' sections');
