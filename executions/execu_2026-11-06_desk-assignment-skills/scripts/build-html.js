// Builds report.html (self-contained) from report.md + evidence images. Usage: node build-html.js
const fs = require('fs'), path = require('path');
const RUN = path.join(__dirname, '..');
const md = fs.readFileSync(path.join(RUN, 'report.md'), 'utf8');

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = s => esc(s)
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/~~(.+?)~~/g, '<del>$1</del>')
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/(^|[\s(])\*([^*\s][^*]*?)\*(?=[\s.,;:)]|$)/g, '$1<em>$2</em>');

// result classification for result tables
const cls = v => {
  const t = v.replace(/~~.*?~~/g, '');
  if (/PASS/.test(t) && /FAIL/.test(t)) return 'mixed';
  if (/FAIL/.test(t)) return 'fail';
  if (/PASS/.test(t)) return 'pass';
  if (/Not run|BLOCKED/i.test(t)) return 'notrun';
  return 'other';
};
const tally = { pass: 0, fail: 0, mixed: 0, notrun: 0, other: 0 };
const sevCls = v => /Fixed/.test(v) ? 'fixed' : /High/.test(v) ? 'high' : /Medium/.test(v) ? 'medium' : /Low/.test(v) ? 'low' : '';

const lines = md.split(/\r?\n/);
let html = '', i = 0, toc = [], inList = false, h1 = '';
const closeList = () => { if (inList) { html += '</ul>\n'; inList = false; } };
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
while (i < lines.length) {
  const L = lines[i];
  if (/^\|/.test(L)) {
    closeList();
    const rows = [];
    while (i < lines.length && /^\|/.test(lines[i])) { rows.push(lines[i]); i++; }
    const cells = r => r.replace(/^\|/, '').replace(/\|\s*$/, '').split(/(?<!\\)\|/).map(c => c.trim());
    const head = cells(rows[0]); const body = rows.slice(2).map(cells);
    const resCol = head.findIndex(h => /^Result$/i.test(h));
    const sevCol = head.findIndex(h => /^Severity$/i.test(h));
    const isMeta = head.every(h => h === '');
    html += `<div class="tw"><table class="${isMeta ? 'meta' : ''}">` + (isMeta ? '' : '<thead><tr>' + head.map(h => `<th>${inline(h)}</th>`).join('') + '</tr></thead>') + '<tbody>';
    for (const b of body) {
      let rc = '';
      if (resCol >= 0) { rc = cls(b[resCol] || ''); tally[rc]++; }
      html += `<tr class="${rc}">` + b.map((c, k) => {
        if (k === resCol) return `<td><span class="badge ${rc}">${inline(c)}</span></td>`;
        if (k === sevCol) return `<td><span class="sev ${sevCls(c)}">${inline(c)}</span></td>`;
        if (k === 0 && !isMeta) return `<td class="id">${inline(c)}</td>`;
        return `<td>${inline(c)}</td>`;
      }).join('') + '</tr>';
    }
    html += '</tbody></table></div>\n';
    continue;
  }
  let m;
  if ((m = L.match(/^(#{1,3}) (.*)/))) {
    closeList();
    const lv = m[1].length, txt = m[2];
    if (lv === 1) { h1 = txt; i++; continue; }
    const id = slug(txt); if (lv === 2) toc.push({ id, txt: txt.replace(/`/g, "") });
    html += `<h${lv} id="${id}">${inline(txt)}</h${lv}>\n`;
  } else if ((m = L.match(/^- (.*)/))) {
    if (!inList) { html += '<ul>\n'; inList = true; }
    html += `<li>${inline(m[1])}</li>\n`;
  } else if (L.trim() === '') { closeList(); }
  else { closeList(); html += `<p>${inline(L)}</p>\n`; }
  i++;
}
closeList();

// evidence images (failed cases only)
const img = (rel, cap) => {
  const p = path.join(RUN, rel); if (!fs.existsSync(p)) return '';
  const b64 = fs.readFileSync(p).toString('base64');
  return `<figure><a href="data:image/png;base64,${b64}" target="_blank"><img src="data:image/png;base64,${b64}" alt="${esc(cap)}"></a><figcaption>${esc(cap)} <span class="path">${esc(rel)}</span></figcaption></figure>`;
};
const ev = [
  ['B-2 Round robin ignores the Email channel', [['screenshots/annotated/B2-email-channel-off-vs-zoho.png', 'TAVI (left) vs live Zoho (right), approved 7 Nov']]],
  ['B-3 Team assignment accepted by API while Team Assignment is off', [['screenshots/annotated/B3-team-assignment-off-api-vs-zoho.png', 'TAVI (left) vs live Zoho (right), approved 7 Nov']]],
  ['B-4 New Ticket form shows an owner it does not save', [['screenshots/annotated/B4-new-ticket-owner-not-saved-vs-zoho.png', 'TAVI (left) vs live Zoho (right), approved 7 Nov']]],
  ['B-5 Holiday criteria ignore a list not attached to business hours', [['screenshots/annotated/B5-holiday-list-not-attached-vs-zoho.png', 'TAVI (left) vs live Zoho (right), approved 7 Nov']]],
];
const evHtml = '<h2 id="evidence">Evidence (failed cases)</h2><p class="note">Each image: TAVI on the left, live Zoho on the right, same box numbers on both sides. All four images approved 7 Nov.</p>' +
  ev.map(([t, imgs]) => `<h3>${esc(t)}</h3><div class="figs">${imgs.map(x => img(...x)).join('')}</div>`).join('');
toc.push({ id: 'evidence', txt: 'Evidence (failed cases)' });

// insert evidence before "Changes made" section
const cut = html.indexOf('<h2 id="changes-made-on-ndc-staging"');
html = cut > 0 ? html.slice(0, cut) + evHtml + html.slice(cut) : html + evHtml;


// Plane draft section (from plane-draft.json, not posted)
const pdF=path.join(RUN,'plane-draft.json');
if(fs.existsSync(pdF)){const FILED=fs.existsSync(path.join(RUN,'out/plane-filed.json'))?JSON.parse(fs.readFileSync(path.join(RUN,'out/plane-filed.json'),'utf8')):{};const pd=JSON.parse(fs.readFileSync(pdF,'utf8'));
  const pdHtml='<h2 id="plane-draft">Plane</h2><p class="note">Bugs filed 7 Nov after your approval. Comments on existing items: drafted, not posted. Full text: plane-draft.html.</p><div class="tw"><table><thead><tr><th>Item</th><th>Kind</th><th>Priority / state</th><th>Title / proposal</th></tr></thead><tbody>'+
   pd.bugs.map(b=>'<tr><td class="id">'+b.key+'</td><td>'+(FILED[b.key]?'Filed '+FILED[b.key].seq:'New bug')+'</td><td><span class="sev '+(b.priority==='high'?'high':'medium')+'">'+b.priority+'</span></td><td>'+esc(b.name)+'</td></tr>').join('')+
   pd.comments.map(c=>'<tr><td class="id">'+c.item+'</td><td>Comment</td><td>'+esc(c.current_state)+'</td><td>Proposed: '+esc(c.proposed_state)+'</td></tr>').join('')+'</tbody></table></div>';
  const c2=html.indexOf('<h2 id="changes-made-on-ndc-staging"');html=c2>0?html.slice(0,c2)+pdHtml+html.slice(c2):html+pdHtml;toc.push({id:'plane-draft',txt:'Plane'});}

const bugRows = (md.match(/^\| B-\d \|[^|]*\|/gm) || []);
const openBugs = bugRows.filter(r => !/Fixed/.test(r)).length;
const total = Object.values(tally).reduce((a, b) => a + b, 0);
const card = (n, l, c) => `<div class="card ${c}"><div class="n">${n}</div><div class="l">${l}</div></div>`;
const bar = ['pass', 'mixed', 'fail', 'other', 'notrun'].map(k => tally[k] ? `<span class="seg ${k}" style="flex:${tally[k]}" title="${k}: ${tally[k]}"></span>` : '').join('');

const out = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(h1)}</title>
<style>
:root{--bg:#f6f7f9;--fg:#1d2330;--mut:#5d6677;--line:#e2e5ea;--card:#fff;--pass:#1f8a4c;--fail:#c62f2f;--mixed:#c47a12;--notrun:#7a8293;--other:#4a63b8}
*{box-sizing:border-box}body{margin:0;font:14px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:var(--bg);color:var(--fg)}
header{background:#1d2330;color:#fff;padding:28px 40px 22px}header h1{margin:0 0 6px;font-size:22px}header .sub{color:#b9c0cc;font-size:13px}
.wrap{display:flex;gap:28px;max-width:1500px;margin:0 auto;padding:24px 40px}
nav{position:sticky;top:16px;align-self:flex-start;width:220px;flex:none;font-size:13px}nav a{display:block;color:var(--mut);text-decoration:none;padding:4px 8px;border-left:2px solid var(--line)}nav a:hover{color:var(--fg);border-color:var(--fg)}
main{flex:1;min-width:0}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin-bottom:12px}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px}.card .n{font-size:26px;font-weight:700}.card .l{color:var(--mut);font-size:12px;text-transform:uppercase;letter-spacing:.04em}
.card.pass .n{color:var(--pass)}.card.fail .n{color:var(--fail)}.card.mixed .n{color:var(--mixed)}.card.notrun .n{color:var(--notrun)}.card.bug .n{color:var(--fail)}
.bar{display:flex;height:10px;border-radius:6px;overflow:hidden;margin:4px 0 22px;background:var(--line)}.seg.pass{background:var(--pass)}.seg.fail{background:var(--fail)}.seg.mixed{background:var(--mixed)}.seg.notrun{background:var(--notrun)}.seg.other{background:var(--other)}
h2{margin:34px 0 12px;padding-bottom:6px;border-bottom:1px solid var(--line);font-size:19px}h3{margin:22px 0 8px;font-size:15px}
.tw{overflow-x:auto;background:var(--card);border:1px solid var(--line);border-radius:10px;margin:8px 0 14px}
table{border-collapse:collapse;width:100%}th,td{text-align:left;vertical-align:top;padding:8px 12px;border-bottom:1px solid var(--line)}th{background:#eef0f4;font-size:12px;text-transform:uppercase;letter-spacing:.03em;color:var(--mut)}
tr:last-child td{border-bottom:0}td.id{white-space:nowrap;font-weight:600}table.meta td:first-child{font-weight:600;width:130px;color:var(--mut)}
tr.fail{background:#fdf3f3}tr.mixed{background:#fdf8ef}
.badge{display:inline-block;padding:1px 8px;border-radius:10px;font-size:12px;font-weight:600;white-space:nowrap;background:#e8ebf2;color:var(--other)}
.badge.pass{background:#e3f4ea;color:var(--pass)}.badge.fail{background:#fbe3e3;color:var(--fail)}.badge.mixed{background:#fbefd9;color:var(--mixed)}.badge.notrun{background:#eceef2;color:var(--notrun)}
.sev{font-weight:700;white-space:nowrap}.sev.high{color:var(--fail)}.sev.medium{color:var(--mixed)}.sev.fixed{color:var(--pass)}
code{background:#eef0f4;padding:1px 5px;border-radius:4px;font-size:12.5px;word-break:break-all}del{color:var(--mut)}
ul{padding-left:20px}li{margin:4px 0}.note{color:var(--mut)}
.figs{display:grid;grid-template-columns:1fr;gap:14px}
figure{margin:0;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:10px}figure img{width:100%;border-radius:6px;display:block}
figcaption{font-size:12.5px;margin-top:6px}figcaption .path{display:block;color:var(--mut);font-family:monospace;font-size:11.5px}
footer{color:var(--mut);font-size:12px;text-align:center;padding:24px}
@media (max-width:900px){nav{display:none}.wrap{padding:16px}}
@media print{nav{display:none}header{background:#fff;color:#000}}
</style></head><body>
<header><h1>${inline(h1)}</h1><div class="sub">NDC-Staging · generated ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC from report.md · bugs filed in Plane as NDC-2811..2814</div></header>
<div class="wrap"><nav>${toc.map(t => `<a href="#${t.id}">${esc(t.txt)}</a>`).join('')}</nav><main>
<div class="cards">${card(total, 'Cases with a result', '')}${card(tally.pass, 'Pass', 'pass')}${card(tally.mixed, 'Pass / fail mixed', 'mixed')}${card(tally.fail, 'Fail', 'fail')}${card(tally.other, 'Partial / gap / info', '')}${card(tally.notrun, 'Not run', 'notrun')}${card(openBugs, 'Open bugs', 'bug')}</div>
<div class="bar">${bar}</div>
${html}
</main></div><footer>Source: executions/execu_2026-11-06_desk-assignment-skills/report.md · test data in ledger.md</footer></body></html>`;
fs.writeFileSync(path.join(RUN, 'report.html'), out);
console.log('report.html', (out.length / 1024).toFixed(0) + ' KB', JSON.stringify(tally), 'openBugs', openBugs);
