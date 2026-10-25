// Builds the Plane comment for each ticket of a batch from <results.json> and the annotate specs. Usage: node make-comments.js <results.json> <out.json>
const fs = require('fs'); const path = require('path'); const RUN = path.join(__dirname, '..');
const [src, out] = process.argv.slice(2); const R = JSON.parse(fs.readFileSync(path.join(RUN, src), 'utf8'));
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const STATE = { PASS: 'Done', 'NOT A BUG': 'Done', FAIL: 'Bug', PARTIAL: 'Bug' };
const list = R.tickets.map(t => {
  const spec = JSON.parse(fs.readFileSync(path.join(__dirname, 'specs', t.id + '.json'), 'utf8'));
  const checked = spec.rows.map(r => `<li>${esc(r[1])} → ${esc(r[3])} <b>[${r[4]}]</b></li>`).join('');
  const html = `<p><b>Retest ${t.v} — ${R.date}</b><br>Environment: ${esc(R.env)}<br>Method: manual browser + API (retest round 21 Oct)</p>`
    + `<p><b>Developer's note checked:</b> ${esc(t.devHeld)}</p><p>${esc(t.summary)}</p><p><b>Checked:</b></p><ul>${checked}</ul>`
    + (t.still ? `<p><b>Still failing:</b></p><ul>${t.still.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : '')
    + `<p>Evidence: ${t.img.map(esc).join(', ')}</p>`;
  return { id: t.id, uuid: t.uuid, verdict: t.v, state: STATE[t.v], html };
});
fs.writeFileSync(path.join(RUN, out), JSON.stringify(list, null, 1)); console.log(list.length, 'comments,', list.map(x => x.html.length).reduce((a, b) => Math.max(a, b)), 'max chars');
