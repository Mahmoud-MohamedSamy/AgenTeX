// Builds RUN/report.html from FINDINGS.md + notes.md + annotated images (findings retest, 17 Nov 2026 evening)
const fs = require('fs'), path = require('path'); const R = path.join(__dirname, '..');
const G = path.join(R, '../execu_2026-11-01_desk-golive');
const css = fs.readFileSync(path.join(G, 'ticketmenu/report.src.html'), 'utf8').split('</style>')[0].replace(/<title>.*?<\/title>/, '<title>Findings Retest 17 Nov</title>') + '</style>';
const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`(.+?)`/g, '<code>$1</code>');
const cells = l => l.split('|').slice(1, -1).map(c => c.trim());
const F = fs.readFileSync(path.join(R, 'FINDINGS.md'), 'utf8').split('\n').filter(l => /^\| [FCA]\d+ /.test(l)).map(cells)
  .map(([id, plane, sev, title, origin, lane]) => ({ id, plane, sev, title, origin, lane }));
const notes = {}; fs.readFileSync(path.join(R, 'notes.md'), 'utf8').split('\n').filter(l => /^\| [FCA]\d+ /.test(l)).map(cells)
  .forEach(([id0, verdict, details, ev]) => { const id = id0.split(" ")[0]; (notes[id] = notes[id] || []).push({ verdict, details, ev }); });
const extra = fs.existsSync(path.join(R, 'extra.json')) ? JSON.parse(fs.readFileSync(path.join(R, 'extra.json'), 'utf8')) : {};
const V = n => (n && n[n.length - 1].verdict) || 'NOT RUN';
const cls = v => /^FIXED|^NOT REPRODUCED/.test(v) ? 'pass' : /^STILL|^CHANGED/.test(v) ? 'fail' : /^DECISION/.test(v) ? 'known' : 'info';
const img = f => { const p = path.join(R, 'screenshots/annotated', f || ''); return f && fs.existsSync(p) && fs.statSync(p).isFile() ? 'data:image/png;base64,' + fs.readFileSync(p).toString('base64') : null; };
const AREA = { WF: 'Workflow Rules and staging health', BP: 'Blueprint and Departments', TK: 'Tickets, Contracts, Views, Email', SC: 'CRM: Scoring, Reports, Currency, Audit Log', AC: 'Ticket access' };
const every = F.map(f => ({ ...f, n: notes[f.id], v: V(notes[f.id]) }));
const gone = every.filter(f => /^FIXED|^NOT REPRODUCED/.test(f.v));
const all = every.filter(f => !gone.includes(f));
const cnt = re => all.filter(f => re.test(f.v)).length;
const card = f => {
  const n = f.n || []; const evs = [...new Set(n.map(x => x.ev).flatMap(e => String(e || '').split(/[,;]? +|[,;]/)).map(s => s.trim()).filter(s => /\.png$/.test(s)))];
  return `<article class="finding"><div class="head"><span class="id">${f.id}${f.plane && f.plane !== '—' ? ' · ' + esc(f.plane) : ''}</span><h3>${esc(f.title)}</h3><span class="pill ${cls(f.v)}">${esc(f.v)}</span></div>
    <p class="meta">Severity ${esc(f.sev)} · from ${esc(f.origin)}</p>
    ${n.map(x => `<p>${esc(x.details)}</p>`).join('') || '<p>Not run.</p>'}
    ${evs.map(e => { const s = img(e); return s ? `<figure><img src="${s}" alt="${esc(f.id)} evidence"><figcaption>${esc(e)}</figcaption></figure>` : ''; }).join('')}</article>`;
};
const html = css + `
<div class="wrap">
<header>
  <div class="eyebrow">Findings retest · 17 Nov 2026 evening</div>
  <h1>Open findings from 17 Nov after the retest</h1>
  <p class="meta">TAVI NDC-Staging (staging-desk / staging-crm), Edge + API, the shared owner session plus single sign-ins of test agents. ${every.length} findings were retested (the 15 round-20 findings, 2 bugs filed in round 20 (NDC-3104, NDC-3105), 7 ticket-access findings (NDC-3095..3100 and the AC-08 decision) and 6 CRM currency/audit findings (NDC-3101, NDC-3103, drafts B1–B4). Zoho is shown only where it was seen live today. This page lists the ${all.length} that are not fixed; the ${gone.length} fixed or no longer reproduced are left out: ${gone.map(f=>f.id+(f.plane&&f.plane!=="—"?" ("+f.plane.replace(" (comment)","")+")":"")).join(", ")}. All test data was deleted after.</p>
  <div class="strip">
    <div class="stat fail"><b>${cnt(/^STILL/)}</b><span>still fails</span></div>
        <div class="stat fail"><b>${cnt(/^CHANGED/)}</b><span>changed</span></div>
    <div class="stat known"><b>${cnt(/^DECISION/)}</b><span>your decision</span></div>
    <div class="stat info"><b>${cnt(/^BLOCKED|^NOT RUN|^PENDING/)}</b><span>blocked / pending</span></div>
  </div>
</header>
<section>
  <h2>Summary</h2>
  <div class="tbl"><table><thead><tr><th>Id</th><th>Plane</th><th>Finding</th><th>Sev</th><th>Result now</th></tr></thead><tbody>
  ${all.map(f => `<tr><td>${f.id}</td><td>${esc(f.plane)}</td><td>${esc(f.title)}</td><td>${esc(f.sev)}</td><td><span class="pill ${cls(f.v)}">${esc(f.v)}</span></td></tr>`).join('\n  ')}
  </tbody></table></div>
  ${extra.summary ? `<p>${esc(extra.summary)}</p>` : ''}
</section>
${Object.entries(AREA).map(([k, t]) => `<section><h2>${t}</h2>${all.filter(f => f.lane === k).map(card).join('\n')}</section>`).join('\n')}
${extra.newFindings && extra.newFindings.length ? `<section><h2>New things seen during the retest (not filed)</h2><ul>${extra.newFindings.map(x => `<li>${esc(x)}</li>`).join('')}</ul></section>` : ''}
<section><h2>Cleanup</h2><p>${esc(extra.cleanup || 'See ledger.md.')}</p></section>
</div>`;
fs.writeFileSync(path.join(R, 'report.html'), html); console.log('report', html.length, 'findings', all.length, 'run', all.filter(f => f.n).length);
