// Builds report-r22.html (Desk batch) from specs/*.json + annotated images. node mk-report-r22.js
const fs = require('fs'), path = require('path');
const RUN = path.join(__dirname, '..'); const A = path.join(RUN, 'screenshots/annotated');
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const img = f => 'data:image/png;base64,' + fs.readFileSync(path.join(A, f)).toString('base64');
const order = ['3106','3101','3103','3087','2807','3108','3107','3089','3088','3109','3090','2995','2137','2136'];
const pri = { high: 'High', medium: 'Medium', low: 'Low' };
const cls = v => v === 'PASS' ? 'pass' : v === 'INFO' ? 'info' : 'fail';
const vcls = v => v === 'PASS' ? 'pass' : v === 'PARTIAL' ? 'part' : v === 'FAIL' ? 'fail' : 'note';
const S = order.map(n => ({ n, s: JSON.parse(fs.readFileSync(path.join(__dirname, 'specs', 'NDC-' + n + '.json'), 'utf8')) }));
const extra = {};
const action = v => v === 'PASS' ? 'Done' : (v === 'PARTIAL'||v==='FAIL') ? 'Bug' : 'no change';
const counts = { PASS: S.filter(x => x.s.verdict === 'PASS').length, PARTIAL: S.filter(x => x.s.verdict !== 'PASS').length };
const rowsHtml = S.map(({ n, s }) => `<tr><td class="id"><a href="#t${n}">NDC-${n}</a></td><td>${pri[s.priority] || s.priority}</td><td>${esc(s.title)}</td><td><span class="pill ${vcls(s.verdict)}">${s.verdict}</span></td><td>${action(s.verdict)}</td></tr>`).join('')
  + Object.entries(extra).map(([n, e]) => `<tr><td class="id"><a href="#t${n}">NDC-${n}</a></td><td>${e.pri}</td><td>${esc(e.title)}</td><td><span class="pill note">${e.verdict}</span></td><td>no change</td></tr>`).join('');
const cards = S.map(({ n, s }) => {
  const fails = s.rows.filter(r => r[4] === 'FAIL');
  return `<article class="ticket" id="t${n}"><div class="head"><span class="id">NDC-${n}</span><h3>${esc(s.title)}</h3><span class="pill ${vcls(s.verdict)}">${s.verdict}</span></div>
<p class="env">${esc(s.env)}</p>
${fails.length ? `<div class="still"><b>Still failing</b><ul>${fails.map(r => `<li>${esc(r[1])}: expected ${esc(r[2])}; now ${esc(r[3])}</li>`).join('')}</ul></div>` : ''}
<div class="tbl"><table><thead><tr><th>#</th><th>Check</th><th>Expected (ticket)</th><th>Now</th><th>Result</th></tr></thead><tbody>${s.rows.map(r => `<tr><td>${r[0]}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td><td><span class="pill ${cls(r[4])}">${r[4]}</span></td></tr>`).join('')}</tbody></table></div>
<details${s.verdict !== 'PASS' ? ' open' : ''}><summary>Evidence</summary><figure><img loading="lazy" src="${img(s.out)}" alt="NDC-${n} annotated evidence"><figcaption>${esc(s.out)}</figcaption></figure></details></article>`;
}).join('\n') + Object.entries(extra).map(([n, e]) => `<article class="ticket" id="t${n}"><div class="head"><span class="id">NDC-${n}</span><h3>${esc(e.title)}</h3><span class="pill note">${e.verdict}</span></div><p>${esc(e.why)}</p></article>`).join('\n');
const tpl = fs.readFileSync(path.join(__dirname, 'report-crm.tpl.html'), 'utf8');
const out = tpl.replace('{{PASS}}', counts.PASS).replace('{{PARTIAL}}', counts.PARTIAL).replace('{{ROWS}}', rowsHtml).replace('{{CARDS}}', cards);
fs.writeFileSync(path.join(RUN, 'report-r22-crm.html'), out); console.log('written', (out.length / 1e6).toFixed(2) + ' MB');
