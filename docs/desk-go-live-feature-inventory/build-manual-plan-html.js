// Builds manual-test-plan.html (interactive test sheet) from manual-test-plan-untested.md.
// Usage: node build-manual-plan-html.js
const fs = require('fs'), path = require('path');
const md = fs.readFileSync(path.join(__dirname, 'manual-test-plan-untested.md'), 'utf8').replace(/\r/g, '');
const lines = md.split('\n');

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = s => esc(s)
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/(^|[\s(])\*([^*]+)\*(?=[\s).,;:]|$)/g, '$1<em>$2</em>');
const cells = l => { const p = l.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/); return p.map(x => x.trim().replace(/\\\|/g, '|')); };

// simple markdown block renderer for guide sections
function render(block) {
  const out = []; let i = 0;
  while (i < block.length) {
    const l = block[i];
    if (!l.trim() || /^---+$/.test(l.trim())) { i++; continue; }
    if (/^#{2,6} /.test(l)) { const n = l.match(/^#+/)[0].length; out.push(`<h${Math.min(n + 1, 5)}>${inline(l.replace(/^#+ /, ''))}</h${Math.min(n + 1, 5)}>`); i++; continue; }
    if (l.trim().startsWith('|')) {
      const rows = []; while (i < block.length && block[i].trim().startsWith('|')) { rows.push(block[i]); i++; }
      const head = cells(rows[0]); const body = rows.slice(2).map(cells);
      out.push('<div class="tblwrap"><table class="gtable"><thead><tr>' + head.map(h => `<th>${inline(h)}</th>`).join('') + '</tr></thead><tbody>' +
        body.map(r => '<tr>' + r.map(c => `<td>${inline(c)}</td>`).join('') + '</tr>').join('') + '</tbody></table></div>');
      continue;
    }
    if (/^\s*([-*]|\d+\.) /.test(l)) {
      const ordered = /^\s*\d+\. /.test(l); const items = [];
      while (i < block.length && /^\s*([-*]|\d+\.) /.test(block[i])) { items.push(block[i].replace(/^\s*([-*]|\d+\.) /, '')); i++; }
      out.push(`<${ordered ? 'ol' : 'ul'}>` + items.map(x => `<li>${inline(x)}</li>`).join('') + `</${ordered ? 'ol' : 'ul'}>`); continue;
    }
    const para = []; while (i < block.length && block[i].trim() && !/^(#|\||\s*([-*]|\d+\.) )/.test(block[i])) { para.push(block[i].replace(/\s{2,}$/, '')); i++; }
    out.push(`<p>${inline(para.join(' '))}</p>`);
  }
  return out.join('\n');
}

// split document into level-2 sections
const secs = []; let cur = null;
for (const l of lines) { if (/^## /.test(l)) { cur = { title: l.slice(3).trim(), lines: [] }; secs.push(cur); } else if (cur) cur.lines.push(l); }
const header = lines.slice(0, lines.findIndex(l => /^## /.test(l)));

const features = []; let area = '', prio = '';
const testSec = secs.find(s => /^6\. Test cases/.test(s.title));
const tl = testSec.lines;
for (let i = 0; i < tl.length; i++) {
  const l = tl[i];
  let m;
  if ((m = l.match(/^### 6\.\d+ (P\d)/))) { prio = m[1]; continue; }
  if ((m = l.match(/^#### (P\d) · (.+)$/))) { prio = m[1]; area = m[2].replace(/\s*\(.*\)$/, '').trim(); continue; }
  if ((m = l.match(/^##### ([A-Z]-\d+) · (.+)$/))) {
    const f = { id: m[1], name: m[2].trim(), prio, area, meta: {}, notes: [], cases: [] };
    i++;
    while (i < tl.length && !/^#####? /.test(tl[i]) && !/^#### /.test(tl[i]) && !/^### /.test(tl[i])) {
      const x = tl[i];
      if (x.trim().startsWith('|')) {
        const c = cells(x);
        if (/^[A-Z]-\d+-\d+/.test(c[0])) f.cases.push({ tc: c[0], title: c[1], type: (c[2] || '').toLowerCase(), steps: c[3] || '', expected: c[4] || '' });
      } else if (x.trim()) {
        const mm = x.match(/^\*\*([^*]+):\*\*\s*(.*)$/);
        if (mm && /^Priority$/i.test(mm[1].trim())) {
          for (const part of x.split('·')) { const kv = part.match(/\*\*([^*]+):\*\*\s*(.+)/); if (kv) f.meta[kv[1].trim().toLowerCase()] = kv[2].replace(/\s+$/, '').trim(); }
        } else if (mm) f.meta[mm[1].trim().toLowerCase()] = mm[2].replace(/\s{2,}$/, '').trim();
        else f.notes.push(x.trim());
      }
      i++;
    }
    i--;
    features.push(f);
  }
}

// day plan → feature ids
const daySec = secs.find(s => /^3\./.test(s.title));
const dayOf = {};
for (const l of daySec.lines) { if (!l.trim().startsWith('|')) continue; const c = cells(l); const d = parseInt(c[0], 10); if (!d) continue; for (const id of (c[1].match(/[A-Z]-\d+/g) || [])) if (!dayOf[id]) dayOf[id] = d; }
const prefixDay = { 'P1 tickets': 10, 'P2 tickets': 14, 'P3': 16 };
for (const f of features) f.day = dayOf[f.id] || null;

// render the html-ish fields
for (const f of features) {
  f.why = f.meta['why this priority'] ? inline(f.meta['why this priority']) : '';
  f.pre = f.meta['preconditions / data'] ? inline(f.meta['preconditions / data']) : '';
  f.partly = f.meta['partly covered before'] ? inline(f.meta['partly covered before']) : '';
  f.status = f.meta['status'] || ''; f.wave = f.meta['wave'] || '';
  f.extra = f.notes.map(n => inline(n.replace(/^[-*] /, ''))).filter(Boolean);
  for (const c of f.cases) {
    const parts = c.steps.split(/(?:^|\s)(\d+)\)\s/).filter(Boolean);
    const steps = []; for (let k = 0; k < parts.length; k++) { if (/^\d+$/.test(parts[k]) && parts[k + 1]) { steps.push(parts[k + 1].trim()); k++; } else if (!/^\d+$/.test(parts[k])) steps.push(parts[k].trim()); }
    c.stepsHtml = steps.map(s => inline(s)); c.expectedHtml = inline(c.expected); c.titleHtml = inline(c.title);
    delete c.steps; delete c.expected; delete c.title;
  }
  delete f.meta; delete f.notes;
}

const guide = secs.filter(s => !/^6\. Test cases/.test(s.title)).map(s => ({ title: s.title, html: render(s.lines) }));
const intro = render(header.filter(l => !/^# /.test(l)));
const data = { title: (lines[0] || '').replace(/^# /, ''), intro, guide, features };
const nCases = features.reduce((a, f) => a + f.cases.length, 0);
console.log('features', features.length, 'cases', nCases, 'guide sections', guide.length, 'without day', features.filter(f => !f.day).map(f => f.id).join(' '));

const tpl = fs.readFileSync(path.join(__dirname, 'manual-plan-template.html'), 'utf8');
const json = JSON.stringify(data).replace(/</g, '\\u003c');
fs.writeFileSync(path.join(__dirname, 'manual-test-plan.html'), tpl.replace('/*__DATA__*/null', json));
console.log('wrote manual-test-plan.html', fs.statSync(path.join(__dirname, 'manual-test-plan.html')).size, 'bytes');
