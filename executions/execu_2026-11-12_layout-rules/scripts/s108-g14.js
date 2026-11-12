const mid = await modId(); await sleep(4000); const r = await api('GET', '/modules/' + mid + '/records?page=1&per_page=15&sort=created_at&dir=desc'); const L = arr(r.j.data);
const hit = L.filter(x => JSON.stringify(x.data || '').includes('QA LR1112 G14 webform')); const out = { s: r.s, n: L.length, hit: hit.length };
if (hit[0]) { out.id = hit[0].id; LED('Desk ticket from web form ' + hit[0].id); out.vals = hit[0].data.filter(d => /qa_lr_(type|order)|layout|subject/.test(d.field)).map(d => d.field + '=' + JSON.stringify(d.value.value)); out.layout = hit[0].created_with_layout_id; }
return out;
