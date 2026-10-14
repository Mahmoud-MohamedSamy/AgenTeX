// Builds requirements-desk-assignment-rules.html from the .md next to it.
// Usage: node tools/make-requirements-html.js
// Handles the subset of Markdown the requirements file uses: #/##/### headings, paragraphs,
// nested "-" lists, "1." lists, **bold**, *italic*, `code`, [links](url).
// Requirement bullets ("**ID — Title.**") become cards with status badges, phase chips and filters.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'requirements-desk-assignment-rules.md');
const out = path.join(root, 'requirements-desk-assignment-rules.html');
const md = fs.readFileSync(src, 'utf8').replace(/\r\n/g, '\n');

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const slug = s => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const STATUS = { 'Built': 'built', 'Partly built': 'partly', 'Missing': 'missing', 'Not checked': 'notchecked' };

function inline(s) {
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
  s = esc(s);
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
  s = s.replace(/\[Decision\]/g, '<span class="decision">Decision</span>');
  s = s.replace(/\bDecided 14 Oct(?: 2026)?:?/g, '<span class="decided">Decided 14 Oct</span>');
  // status words right after "TAVI today:"
  s = s.replace(/TAVI today: (?:<strong>)?(Built|Partly built|Missing|Not checked)\.?(?:<\/strong>)?/g,
    (_, w) => `<span class="lbl">TAVI today</span> <span class="badge ${STATUS[w]}">${w}</span>`);
  s = s.replace(/\bPhase ([123])\b/g, '<span class="phase p$1">Phase $1</span>');
  s = s.replace(/Zoho \((seen|docs)\)/g, (_, k) => `<span class="lbl zoho">Zoho · ${k}</span>`);
  s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[+i])}</code>`);
  return s;
}

// ---- block parser -------------------------------------------------------
const lines = md.split('\n');
let html = '';
const toc = [];
let i = 0;
let title = 'Requirements';
let meta = [];

function parseList(start, indent) {
  // returns [html, nextIndex]
  const ordered = /^\s*\d+\.\s/.test(lines[start]);
  let h = ordered ? '<ol>' : '<ul>';
  let j = start;
  while (j < lines.length) {
    const line = lines[j];
    if (!line.trim()) { // blank: list continues only if next non-blank is a list item at >= indent
      let k = j + 1; while (k < lines.length && !lines[k].trim()) k++;
      if (k < lines.length && (lines[k].search(/\S/) > indent || (/^\s*(-|\d+\.)\s/.test(lines[k]) && lines[k].search(/\S/) >= indent))) { j = k; continue; }
      break;
    }
    const ind = line.search(/\S/);
    const m = line.match(/^\s*(-|\d+\.)\s+(.*)$/);
    if (!m || ind < indent) {
      if (ind > indent && !m) { // indented paragraph inside the previous item
        let p = line.trim(); j++;
        while (j < lines.length && lines[j].trim() && !/^\s*(-|\d+\.)\s/.test(lines[j])) { p += ' ' + lines[j].trim(); j++; }
        h = h.replace(/<\/li>$/, '') + `<p class="cont">${inline(p)}</p></li>`; continue;
      }
      break;
    }
    if (ind > indent) { // nested list belongs to previous li
      const [sub, nj] = parseList(j, ind);
      h = h.replace(/<\/li>$/, '') + sub + '</li>';
      j = nj; continue;
    }
    let text = m[2];
    j++;
    // continuation lines (indented, not list items)
    while (j < lines.length && lines[j].trim() && !/^\s*(-|\d+\.)\s/.test(lines[j]) && lines[j].search(/\S/) > ind) { text += ' ' + lines[j].trim(); j++; }
    const req = text.match(/^\*\*([A-Z]{2,4}-\d+[a-z]?) — ([^*]+?)\.?\*\*\s*(.*)$/);
    if (req) {
      h += `<li class="req" id="${req[1].toLowerCase()}" data-id="${req[1]}"><div class="req-head"><a class="rid" href="#${req[1].toLowerCase()}">${req[1]}</a><span class="rtitle">${inline(req[2])}</span></div><div class="rbody">${inline(req[3])}</div></li>`;
    } else {
      h += `<li>${inline(text)}</li>`;
    }
  }
  h += ordered ? '</ol>' : '</ul>';
  return [h, j];
}

while (i < lines.length) {
  const line = lines[i];
  if (!line.trim()) { i++; continue; }
  if (/^---\s*$/.test(line)) { html += '<hr>'; i++; continue; }
  let m;
  if ((m = line.match(/^# (.*)/))) { title = m[1]; i++; continue; }
  if ((m = line.match(/^(##|###) (.*)/))) {
    const lvl = m[1].length, t = m[2], id = slug(t);
    if (lvl === 2) toc.push({ id, t, sub: [] }); else if (toc.length) toc[toc.length - 1].sub.push({ id, t });
    html += `<h${lvl} id="${id}">${inline(t)}</h${lvl}>`; i++; continue;
  }
  if (/^\s*(-|\d+\.)\s/.test(line)) { const [h, j] = parseList(i, line.search(/\S/)); html += h; i = j; continue; }
  // paragraph (collect lines); the first paragraphs before "How to read" are metadata
  let p = line.trim(); i++;
  while (i < lines.length && lines[i].trim() && !/^(#|-|\d+\.|---)/.test(lines[i].trim()) && !/^\*\*[A-Za-z ]+:\*\*/.test(lines[i].trim())) { p += ' ' + lines[i].trim(); i++; }
  const mm = p.match(/^\*\*(Status|Written|App|Reference product|Related Plane items|Supporting files):\*\*\s*(.*)$/);
  if (mm && !toc.length) { meta.push([mm[1], mm[2]]); continue; }
  html += `<p>${inline(p)}</p>`;
}

// Each requirement's status/phase for filtering
{
  // find each req <li> and its matching </li> (nested lists inside it), then tag it
  let outHtml = '', pos = 0;
  const open = '<li class="req"';
  for (let s = html.indexOf(open); s !== -1; s = html.indexOf(open, pos)) {
    const tagEnd = html.indexOf('>', s) + 1;
    let depth = 1, k = tagEnd;
    while (depth > 0) {
      const o = html.indexOf('<li', k), c = html.indexOf('</li>', k);
      if (o !== -1 && o < c) { depth++; k = o + 3; } else { depth--; k = c + 5; }
    }
    const attrs = html.slice(s + open.length, tagEnd - 1), body = html.slice(tagEnd, k - 5);
    const st = (body.match(/badge (built|partly|missing|notchecked)/) || [])[1] || 'none';
    const ph = (body.match(/phase p([123])/) || [])[1] || '0';
    const dec = /class="decision"/.test(body) ? ' has-decision' : '';
    outHtml += html.slice(pos, s) + `<li class="req${dec}"${attrs} data-status="${st}" data-phase="${ph}">${body}</li>`;
    pos = k;
  }
  html = outHtml + html.slice(pos);
}

const counts = {};
for (const m of html.matchAll(/data-status="(\w+)"/g)) counts[m[1]] = (counts[m[1]] || 0) + 1;
const total = Object.values(counts).reduce((a, b) => a + b, 0);
const decisions = (html.match(/class="req has-decision"/g) || []).length;

const tocHtml = toc.map(s => `<li><a href="#${s.id}">${inline(s.t)}</a>${s.sub.length ? `<ul>${s.sub.map(x => `<li><a href="#${x.id}">${inline(x.t)}</a></li>`).join('')}</ul>` : ''}</li>`).join('');
const metaHtml = meta.map(([k, v]) => `<div class="meta-row"><span class="mk">${esc(k)}</span><span class="mv">${inline(v)}</span></div>`).join('');
const chip = (k, label) => `<button class="fchip ${k}" data-f="${k}" aria-pressed="false">${label} <b>${counts[k] || 0}</b></button>`;

const page = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Assignment Rules Requirements</title>
<style>
:root{--bg:#f6f7f9;--panel:#fff;--text:#1b1f24;--muted:#5b6470;--line:#e2e5ea;--accent:#2457c5;--accent-soft:#e8eefb;
--built:#1a7f37;--built-bg:#e6f4ea;--partly:#9a6700;--partly-bg:#fff4d6;--missing:#c62828;--missing-bg:#fdeaea;--nc:#57606a;--nc-bg:#eef0f3;
--p1:#2457c5;--p2:#7a3fb8;--p3:#0f7b78;--dec:#b35900;--dec-bg:#fff0e0;--code:#f0f2f5}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0f1216;--panel:#171b21;--text:#e6e9ee;--muted:#9aa4b1;--line:#2a3039;--accent:#7aa2ff;--accent-soft:#1d2840;
--built:#5cc97a;--built-bg:#13301d;--partly:#e3b341;--partly-bg:#33290f;--missing:#ff7b72;--missing-bg:#3a1717;--nc:#9aa4b1;--nc-bg:#232831;
--p1:#7aa2ff;--p2:#c39bff;--p3:#4fd1c5;--dec:#ffa657;--dec-bg:#3a2612;--code:#232831}}
:root[data-theme="dark"]{--bg:#0f1216;--panel:#171b21;--text:#e6e9ee;--muted:#9aa4b1;--line:#2a3039;--accent:#7aa2ff;--accent-soft:#1d2840;
--built:#5cc97a;--built-bg:#13301d;--partly:#e3b341;--partly-bg:#33290f;--missing:#ff7b72;--missing-bg:#3a1717;--nc:#9aa4b1;--nc-bg:#232831;
--p1:#7aa2ff;--p2:#c39bff;--p3:#4fd1c5;--dec:#ffa657;--dec-bg:#3a2612;--code:#232831}
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:90px}
body{margin:0;background:var(--bg);color:var(--text);font:15px/1.6 "Segoe UI",system-ui,-apple-system,Roboto,Arial,sans-serif}
a{color:var(--accent)}code{background:var(--code);padding:1px 5px;border-radius:4px;font:13px Consolas,"Cascadia Mono",monospace}
header.top{position:sticky;top:0;z-index:5;background:var(--panel);border-bottom:1px solid var(--line);padding:12px 24px;display:flex;flex-wrap:wrap;gap:10px 18px;align-items:center}
header.top h1{font-size:18px;margin:0;flex:1 1 320px}
.filters{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.filters .fl{color:var(--muted);font-size:12px;margin-right:2px}
.fchip{border:1px solid var(--line);background:var(--panel);color:var(--text);border-radius:999px;padding:3px 10px;font:12px inherit;cursor:pointer}
.fchip b{font-weight:600;margin-left:3px}.fchip[aria-pressed="true"]{outline:2px solid var(--accent);background:var(--accent-soft)}
.fchip.built{color:var(--built)}.fchip.partly{color:var(--partly)}.fchip.missing{color:var(--missing)}.fchip.notchecked{color:var(--nc)}
#theme{border:1px solid var(--line);background:var(--panel);color:var(--text);border-radius:6px;padding:3px 9px;cursor:pointer}
.wrap{display:grid;grid-template-columns:270px minmax(0,1fr);gap:28px;max-width:1280px;margin:0 auto;padding:24px}
nav.toc{position:sticky;top:84px;align-self:start;max-height:calc(100vh - 100px);overflow:auto;font-size:13.5px;padding-right:6px}
nav.toc ul{list-style:none;margin:0;padding-left:0}nav.toc ul ul{padding-left:12px}nav.toc li{margin:3px 0}
nav.toc a{color:var(--muted);text-decoration:none}nav.toc a:hover,nav.toc a.on{color:var(--accent)}
main{min-width:0}
.card{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:18px 22px;margin-bottom:18px}
.meta-row{display:grid;grid-template-columns:170px 1fr;gap:12px;padding:5px 0;border-bottom:1px dashed var(--line)}.meta-row:last-child{border:0}
.mk{color:var(--muted);font-size:13px}
.stats{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px}.stat{flex:1 1 120px;border:1px solid var(--line);border-radius:8px;padding:8px 12px}
.stat b{display:block;font-size:22px}.stat span{color:var(--muted);font-size:12px}
.stat.built b{color:var(--built)}.stat.partly b{color:var(--partly)}.stat.missing b{color:var(--missing)}.stat.notchecked b{color:var(--nc)}.stat.dec b{color:var(--dec)}
h2{font-size:21px;margin:34px 0 10px;padding-top:6px;border-top:2px solid var(--line)}h3{font-size:16px;margin:22px 0 8px;color:var(--muted);text-transform:uppercase;letter-spacing:.04em}
hr{display:none}
ul,ol{padding-left:22px}li{margin:4px 0}
li.req{list-style:none;margin:10px 0 10px -22px;background:var(--panel);border:1px solid var(--line);border-left:4px solid var(--nc);border-radius:8px;padding:10px 14px}
li.req[data-status="built"]{border-left-color:var(--built)}li.req[data-status="partly"]{border-left-color:var(--partly)}
li.req[data-status="missing"]{border-left-color:var(--missing)}li.req[data-status="notchecked"]{border-left-color:var(--nc)}li.req[data-status="none"]{border-left-color:var(--accent)}
.req-head{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap}.rid{font:600 12.5px Consolas,monospace;background:var(--accent-soft);color:var(--accent);padding:1px 7px;border-radius:5px;text-decoration:none}
.rtitle{font-weight:600}.rbody{margin-top:3px}li.req ul{margin:6px 0 0;padding-left:18px}li.req ul li{color:var(--text)}
.badge{display:inline-block;font-size:12px;font-weight:600;padding:0 8px;border-radius:999px;line-height:20px}
.badge.built{color:var(--built);background:var(--built-bg)}.badge.partly{color:var(--partly);background:var(--partly-bg)}
.badge.missing{color:var(--missing);background:var(--missing-bg)}.badge.notchecked{color:var(--nc);background:var(--nc-bg)}
.lbl{font-size:11.5px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.03em}.lbl.zoho{color:var(--accent)}
.phase{display:inline-block;font-size:12px;font-weight:600;padding:0 8px;border-radius:5px;border:1px solid currentColor;line-height:19px}
.phase.p1{color:var(--p1)}.phase.p2{color:var(--p2)}.phase.p3{color:var(--p3)}
.decided{display:inline-block;font-size:12px;font-weight:700;color:var(--built);background:var(--built-bg);padding:0 8px;border-radius:5px;line-height:20px}
.decision{display:inline-block;font-size:12px;font-weight:700;color:var(--dec);background:var(--dec-bg);padding:0 8px;border-radius:5px;line-height:20px}
li.req.has-decision{box-shadow:inset 0 0 0 1px var(--dec-bg)}
li.req.hidden{display:none}
.hint{color:var(--muted);font-size:13px}
@media (max-width:900px){.wrap{grid-template-columns:1fr;padding:16px}nav.toc{position:static;max-height:none;border:1px solid var(--line);border-radius:8px;padding:10px;background:var(--panel)}.meta-row{grid-template-columns:1fr}header.top{padding:10px 16px}}
@media print{header.top,nav.toc{display:none}.wrap{display:block;padding:0}li.req{break-inside:avoid}body{background:#fff}}
</style></head>
<body>
<header class="top">
  <h1>${inline(title)}</h1>
  <div class="filters" role="group" aria-label="Filter requirements">
    <span class="fl">TAVI today:</span>${chip('built', 'Built')}${chip('partly', 'Partly built')}${chip('missing', 'Missing')}${chip('notchecked', 'Not checked')}
    <span class="fl" style="margin-left:8px">Phase:</span>
    <button class="fchip" data-p="1" aria-pressed="false">1</button><button class="fchip" data-p="2" aria-pressed="false">2</button><button class="fchip" data-p="3" aria-pressed="false">3</button>
    <button class="fchip" data-d="1" aria-pressed="false" style="color:var(--dec)">Decisions</button>
  </div>
  <button id="theme" title="Switch light / dark">◐</button>
</header>
<div class="wrap">
  <nav class="toc" aria-label="Contents"><ul>${tocHtml}</ul></nav>
  <main>
    <div class="card">${metaHtml}
      <div class="stats">
        <div class="stat"><b>${total}</b><span>requirements</span></div>
        <div class="stat built"><b>${counts.built || 0}</b><span>Built</span></div>
        <div class="stat partly"><b>${counts.partly || 0}</b><span>Partly built</span></div>
        <div class="stat missing"><b>${counts.missing || 0}</b><span>Missing</span></div>
        <div class="stat notchecked"><b>${counts.notchecked || 0}</b><span>Not checked</span></div>
        <div class="stat dec"><b>${decisions}</b><span>need a decision</span></div>
      </div>
      <p class="hint">Click the chips at the top to show only some requirements. Generated from <code>requirements-desk-assignment-rules.md</code> by <code>tools/make-requirements-html.js</code>.</p>
    </div>
    ${html}
  </main>
</div>
<script>
(function(){
  var reqs=[].slice.call(document.querySelectorAll('li.req'));
  var sel={s:{},p:{},d:false};
  function apply(){
    var anyS=Object.keys(sel.s).some(function(k){return sel.s[k]}),anyP=Object.keys(sel.p).some(function(k){return sel.p[k]});
    reqs.forEach(function(r){
      var ok=(!anyS||sel.s[r.dataset.status])&&(!anyP||sel.p[r.dataset.phase])&&(!sel.d||r.classList.contains('has-decision'));
      r.classList.toggle('hidden',!ok);
    });
  }
  document.querySelectorAll('.fchip').forEach(function(b){b.addEventListener('click',function(){
    var on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',on);
    if(b.dataset.f)sel.s[b.dataset.f]=on;else if(b.dataset.p)sel.p[b.dataset.p]=on;else sel.d=on;apply();});});
  var t=document.getElementById('theme');
  try{var saved=localStorage.getItem('req-theme');if(saved)document.documentElement.setAttribute('data-theme',saved);}catch(e){}
  t.addEventListener('click',function(){var cur=document.documentElement.getAttribute('data-theme');
    var dark=cur?cur==='dark':matchMedia('(prefers-color-scheme: dark)').matches;var next=dark?'light':'dark';
    document.documentElement.setAttribute('data-theme',next);try{localStorage.setItem('req-theme',next);}catch(e){}});
  var links=[].slice.call(document.querySelectorAll('nav.toc a'));
  var heads=links.map(function(a){return document.getElementById(a.getAttribute('href').slice(1))}).filter(Boolean);
  addEventListener('scroll',function(){var y=scrollY+110,cur=null;heads.forEach(function(h){if(h.offsetTop<=y)cur=h.id});
    links.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+cur)});},{passive:true});
})();
</script>
</body></html>`;
fs.writeFileSync(out, page);
console.log('wrote', out, '| requirements', total, JSON.stringify(counts), '| decisions', decisions);
