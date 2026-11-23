const out = { tags: {} }; const SKIPTAGS = true;
if (!SKIPTAGS) for (const id of ['a41004d3-79e9-42bb-acd5-ad7fb363389b', '0fc9d573-2de6-4fc1-8400-ab8cb5092b2d', '7397b50e-30dd-4ebb-9abf-7e9468a7cc82', 'ba388a87-99b7-491e-ab91-2bba95ccd60a']) { let d = await api('DELETE', '/desk/tags/' + id + '?confirm=true'); if (d.s >= 300) d = await api('DELETE', '/desk/tags/' + id, { confirm: true }); out.tags[id.slice(0, 8)] = d.s; }
let purged = 0, first = null;
for (let pass = 0; pass < 20; pass++) {
  const b = await api('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200'); const items = arr(b.j?.data);
  if (pass === 0) first = { n: items.length, sample: JSON.stringify(items[0] || {}).slice(0, 300) };
  const qa = items.filter(i => /QA WF|zz wf|<script>/.test(JSON.stringify(i)));
  if (!qa.length) break;
  for (let k = 0; k < qa.length; k += 50) { const d = await api('POST', '/audit/recycle-bin/delete', { ids: qa.slice(k, k + 50).map(i => i.id) }); if (d.s < 300) purged += Math.min(50, qa.length - k); else { out.err = d.s + ' ' + d.t.slice(0, 200); break; } }
  if (out.err) break; await sleep(3000);
}
const after = arr((await api('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data).filter(i => /QA WF|zz wf/.test(JSON.stringify(i))).length;
out.bin = { first, purged, qaLeft: after };
ledger('CLEANUP 2 ' + JSON.stringify(out).slice(0, 400));
return out;
