// Builds spec-crm-hierarchy-preference.html from the .md next to it.
// Usage: node tools/make-spec-html.js
// Handles the Markdown the spec uses: #/##/### headings, tables, "-" lists, "1." lists, ---, **bold**, *italic*, `code`, [links](url).
// Scenario tables get tag chips, and a search box filters rows across all tables.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'spec-crm-hierarchy-preference.md');
const out = path.join(root, 'spec-crm-hierarchy-preference.html');
const md = fs.readFileSync(src, 'utf8').replace(/\r\n/g, '\n');

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const slug = s => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function inline(s) {
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
  s = esc(s);
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
  s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => {
    const c = codes[+i];
    const tag = c.match(/^\[(func|ui|api|sec|data|conc|perf|i18n|a11y|compat|serial)\]$/);
    return tag ? `<span class="tag t-${tag[1]}">${tag[1]}</span>` : `<code>${esc(c)}</code>`;
  });
  s = s.replace(/🔒/g, '<span class="lock" title="needs the lower-profile account">🔒</span>');
  return s;
}

const cells = l => l.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());

const lines = md.split('\n');
let html = '';
const toc = [];
let i = 0;
let title = 'Spec';
while (i < lines.length) {
  const l = lines[i];
  if (!l.trim()) { i++; continue; }
  let m;
  if ((m = l.match(/^(#{1,3}) (.*)$/))) {
    const lvl = m[1].length, text = m[2];
    if (lvl === 1) { title = text; html += `<h1>${inline(text)}</h1>`; }
    else {
      const id = slug(text);
      if (lvl === 2) toc.push({ id, text });
      html += `<h${lvl} id="${id}">${inline(text)}</h${lvl}>`;
    }
    i++; continue;
  }
  if (/^---+$/.test(l.trim())) { html += '<hr>'; i++; continue; }
  if (l.trim().startsWith('|')) {
    const rows = [];
    while (i < lines.length && lines[i].trim().startsWith('|')) rows.push(lines[i++]);
    const head = cells(rows[0]);
    const body = rows.slice(2).map(cells);
    const isMeta = head.every(h => !h);
    const scen = head[0] === 'ID';
    html += `<div class="tw"><table class="${isMeta ? 'meta' : ''}${scen ? ' scen' : ''}">`;
    if (!isMeta) html += '<thead><tr>' + head.map(h => `<th>${inline(h)}</th>`).join('') + '</tr></thead>';
    html += '<tbody>' + body.map(r => '<tr>' + r.map((c, k) =>
      `<td${scen && k === 0 ? ' class="id"' : ''}>${inline(c)}</td>`).join('') + '</tr>').join('') + '</tbody></table></div>';
    continue;
  }
  if (/^\s*(- |\d+\. )/.test(l)) {
    // nested lists by indentation
    const stack = [];
    const open = (type, ind) => { html += `<${type}>`; stack.push({ type, ind }); };
    while (i < lines.length && /^\s*(- |\d+\. )/.test(lines[i])) {
      const mm = lines[i].match(/^(\s*)(- |\d+\. )(.*)$/);
      const ind = mm[1].length, type = mm[2] === '- ' ? 'ul' : 'ol';
      while (stack.length && stack[stack.length - 1].ind > ind) { html += `</li></${stack.pop().type}>`; }
      if (!stack.length || stack[stack.length - 1].ind < ind) open(type, ind);
      else html += '</li>';
      html += `<li>${inline(mm[3])}`;
      i++;
    }
    while (stack.length) html += `</li></${stack.pop().type}>`;
    continue;
  }
  const para = [];
  while (i < lines.length && lines[i].trim() && !/^(#|\||- |\d+\. |---)/.test(lines[i].trim())) para.push(lines[i++].trim());
  html += `<p>${inline(para.join(' '))}</p>`;
}

const rowCount = (md.match(/^\| [A-Z]\d+[a-z]? \||^\| E2E-\d+ \||^\| Z\d+ \|/gm) || []).length;

const page = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>CRM Hierarchy Preference Spec</title>
<style>
:root{--bg:#f6f7f9;--card:#fff;--ink:#1d2433;--mute:#5d6678;--line:#e1e5ec;--acc:#2457c5;--head:#eef2f8;--code:#f0f2f6}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#12151b;--card:#1a1f27;--ink:#e6e9ef;--mute:#9aa3b2;--line:#2c333f;--acc:#7aa2ff;--head:#222936;--code:#252c38}}
:root[data-theme="dark"]{--bg:#12151b;--card:#1a1f27;--ink:#e6e9ef;--mute:#9aa3b2;--line:#2c333f;--acc:#7aa2ff;--head:#222936;--code:#252c38}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.5 "Segoe UI",system-ui,sans-serif}
.wrap{display:grid;grid-template-columns:250px minmax(0,1fr);max-width:1500px;margin:0 auto}
nav{position:sticky;top:0;height:100vh;overflow:auto;padding:20px 14px;border-right:1px solid var(--line)}
nav b{display:block;margin-bottom:8px}
nav a{display:block;color:var(--mute);text-decoration:none;padding:3px 6px;border-radius:4px;font-size:13px}
nav a:hover{background:var(--head);color:var(--ink)}
main{padding:24px 28px 80px;min-width:0}
h1{font-size:26px;margin:0 0 6px}
h2{font-size:20px;margin:32px 0 10px;padding-top:6px;border-top:2px solid var(--line)}
h3{font-size:16px;margin:20px 0 8px}
hr{border:0;border-top:1px solid var(--line);margin:24px 0}
a{color:var(--acc)}
code{background:var(--code);padding:1px 5px;border-radius:4px;font:12.5px Consolas,monospace;word-break:break-word}
.tw{overflow-x:auto;margin:10px 0 16px;background:var(--card);border:1px solid var(--line);border-radius:8px}
table{border-collapse:collapse;width:100%}
th,td{text-align:left;vertical-align:top;padding:7px 10px;border-bottom:1px solid var(--line)}
th{background:var(--head);font-weight:600;position:sticky;top:0}
tr:last-child td{border-bottom:0}
table.meta td:first-child{font-weight:600;white-space:nowrap;width:130px;color:var(--mute)}
td.id{font-weight:700;white-space:nowrap;color:var(--acc)}
.tag{display:inline-block;font-size:11px;padding:0 6px;border-radius:9px;margin:1px 2px;background:var(--code);color:var(--mute);border:1px solid var(--line)}
.t-sec{background:#fde8e8;color:#a32020;border-color:#f3c4c4}.t-serial{background:#fff3dc;color:#8a5a00;border-color:#f1d9a6}
.t-api{background:#e5efff;color:#1d4fae;border-color:#c3d6fb}.t-perf{background:#efe6ff;color:#5b2fb0;border-color:#d8c6fb}
.t-data{background:#e3f6ee;color:#17734c;border-color:#bfe6d3}
.bar{position:sticky;top:0;z-index:2;background:var(--bg);padding:10px 0;display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.bar input{flex:1;min-width:200px;padding:8px 10px;border:1px solid var(--line);border-radius:6px;background:var(--card);color:var(--ink);font:inherit}
.bar span{color:var(--mute);font-size:13px}
tr.hide{display:none}
@media (max-width:900px){.wrap{grid-template-columns:1fr}nav{position:static;height:auto;border-right:0;border-bottom:1px solid var(--line)}main{padding:16px}}
</style></head><body><div class="wrap">
<nav><b>Contents</b>${toc.map(t => `<a href="#${t.id}">${inline(t.text)}</a>`).join('')}</nav>
<main>
<div class="bar"><input id="q" type="search" placeholder="Filter scenario rows (id, text or tag, e.g. serial, NDC-1669 §6, 🔒)"><span id="n">${rowCount} scenario rows</span></div>
${html}
</main></div>
<script>
const q=document.getElementById('q'),n=document.getElementById('n'),rows=[...document.querySelectorAll('table.scen tbody tr')];
q.addEventListener('input',()=>{const v=q.value.trim().toLowerCase();let c=0;rows.forEach(r=>{const hit=!v||r.textContent.toLowerCase().includes(v);r.classList.toggle('hide',!hit);if(hit)c++});n.textContent=v?c+' of '+rows.length+' rows match':'${rowCount} scenario rows'});
</script></body></html>`;
fs.writeFileSync(out, page);
console.log('wrote', out, '| sections', toc.length, '| scenario rows', rowCount);
