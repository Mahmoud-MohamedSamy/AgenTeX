const QA = arr((await api('GET', '/modules')).j.data).find(m => m.moduleKey === 'desk_qa_mf_assets');
const L = arr((await api('GET', `/modules/${QA.id}/layouts`)).j.data);
const recs = arr((await api('GET', `/modules/${QA.id}/records?page_size=50`)).j.data);
const one = recs[0] ? (await api('GET', `/modules/${QA.id}/records/${recs[0].id}`)).j : null;
const s = JSON.stringify(one || {});
const ids = []; for (const r of recs) { const g = (await api("GET", `/modules/${QA.id}/records/${r.id}`)).j; ids.push(g && g.data && g.data.created_with_layout_id); }
page.off('request', onReq);
return JSON.stringify({ layouts: L.map(x => x.name + ' ' + x.id), recordCount: recs.length, recordLayoutIds: ids, keys: Object.keys((one && one.data) || {}), sample: s.slice(0, 600) });
