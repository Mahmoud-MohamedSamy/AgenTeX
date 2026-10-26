const IDS = {"leads":"9207f81e-cd86-4911-b5c9-5dddeec174c1","contacts":"67191bc4-7ce7-4c22-84ae-1019b9c453a4","deals":"8e29ae79-be26-45ca-99d1-0cf125d68710","accounts":"44468681-52e0-4155-b0ec-4012a1a91f18","tasks":"728e8691-2156-467a-a2be-8ad71f3e1f8c","meetings":"76c15890-c07d-4e5e-890f-9e483d342db2","subscriptions":"39091b6c-ccd5-425d-aeb3-85ab3046e935","agency":"03786dcb-3f4c-45ad-b654-0aef9198eef1","services":"c5e240c6-39f2-41cb-b62b-ae2726324273","dailymove":"1fcfb0fe-2dc6-422d-82ff-41550255c384","cases":"48d59544-4535-4b0e-a0cc-9f0a265a165d","po":"aed1ac90-1c50-49c8-b2f3-cf6d3addbb5c","so":"0718eb3d-c6d0-4739-a40a-0bf6ff51d191","ndcagencies":"2603b7d8-8a61-49c9-9b4b-19f41cdbab63","calls":"c7985f66-36fe-4eee-b804-e2eef0c6a2e6"};
const out = {};
for (const [k, rid] of Object.entries(IDS)) { try {
  const id = MODS[k]; const r = {};
  const d = await call('DELETE', `/modules/${id}/records/${rid}`); r.del = d.s;
  const g = await call('GET', `/modules/${id}/records/${rid}`); r.getAfterDel = g.s;
  const bin = await call('GET', `/audit/recycle-bin/items?limit=50&module_key=${k === 'po' || k === 'so' || k === 'dailymove' || k === 'ndcagencies' || k === 'agency' || k === 'services' ? '' : k}`);
  const items = bin.j && (Array.isArray(bin.j.data) ? bin.j.data : bin.j.data.items) || [];
  const it = items.find(x => x.record_id === rid); r.inBin = !!it; r.binModule = it && it.module_key;
  if (!it) { const all = await call('GET', `/audit/recycle-bin/items?limit=100`); const its = (Array.isArray(all.j.data) ? all.j.data : all.j.data.items) || []; const it2 = its.find(x => x.record_id === rid); r.inBin = !!it2; r.binModule = it2 && it2.module_key; r.binItem = it2 && it2.id; } else r.binItem = it.id;
  if (r.binItem) { const rs = await call('POST', `/audit/recycle-bin/restore`, { ids: [r.binItem] }); r.restore = rs.s; if (rs.s >= 300) r.restoreErr = rs.t.slice(0, 200); }
  const g2 = await call('GET', `/modules/${id}/records/${rid}`); r.getAfterRestore = g2.s;
  out[k] = r;
} catch (e) { out[k] = { exc: String(e).slice(0, 200) }; } }
return out;
