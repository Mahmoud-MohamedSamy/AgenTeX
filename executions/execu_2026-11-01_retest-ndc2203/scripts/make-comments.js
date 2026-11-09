// Builds the Plane comment for each ticket of a batch from <results.json> and the annotate specs. Usage: node make-comments.js <results.json> <out.json>
const fs = require('fs'); const path = require('path'); const RUN = path.join(__dirname, '..');
const [src, out] = process.argv.slice(2); const R = JSON.parse(fs.readFileSync(path.join(RUN, src), 'utf8'));
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const STATE = { PASS: 'Done', 'NOT A BUG': 'Done', FAIL: 'Bug', PARTIAL: 'Bug' };
const list = R.tickets.map(t => {
  const spec = JSON.parse(fs.readFileSync(path.join(__dirname, 'specs', t.id + '.json'), 'utf8'));
  const checked = spec.rows.map(r => `<li>${esc(r[1])} → ${esc(r[3])} <b>[${r[4]}]</b></li>`).join('');
  const html = `<p><b>Retest ${t.v} — ${R.date}</b><br>Environment: ${esc(R.env)}<br>Method: manual browser + API (retest round ${R.date})</p>`
    + `<p><b>Developer's note checked:</b> ${esc(t.devHeld)}</p><p>${esc(t.summary)}</p><p><b>Checked:</b></p><ul>${checked}</ul>`
    + (t.still && t.still.length ? `<p><b>Still failing:</b></p><ul>${t.still.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : '')
    + `<p>Evidence: ${t.img.map(esc).join(', ')}</p>`;
  const OV = { 'NDC-1302': 'Bug', 'NDC-1312': 'Bug', 'NDC-1316': 'Bug', 'NDC-1324': 'Bug' };
  let extra = '';
  if (OV[t.id]) extra = '<p><b>Moved to Bug (QA lead decision, 26 Oct):</b> the fix cannot be confirmed on staging. The Deals "pipeline" field is a pick list that allows only "Standard (Standard)" (changed 24 Oct 15:54 UTC by ndc-staging-owner), so no deal can be created or moved with any pipeline in the UI or the API. Please restore the field (pipeline lookup with all pipelines of the layout) and move this ticket back to Ready For Test.</p>';
  if (t.id === 'NDC-1602') extra = '<p><b>Not run:</b> the Empty Bin click was refused by the test agent safety check (irreversible deletion of the shared bin). The bin was prepared with 244 items. State left in Ready For Test until Empty Bin is run (manually or with permission).</p>';
  if (t.id === 'NDC-2399') extra = '<p><b>Not run:</b> needs Disconnect + Connect of the shared staging CRM ⇄ Desk integration; the test agent safety check refused it. State left in Ready For Test.</p>';
  const html2 = html.replace('<p>Evidence:', extra + '<p>Evidence:');
  return { id: t.id, uuid: t.uuid, verdict: t.v, state: OV[t.id] || STATE[t.v], html: html2 };
});
fs.writeFileSync(path.join(RUN, out), JSON.stringify(list, null, 1)); console.log(list.length, 'comments,', list.map(x => x.html.length).reduce((a, b) => Math.max(a, b)), 'max chars');
