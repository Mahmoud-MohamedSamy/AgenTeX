const IDS = {"leads":"9207f81e-cd86-4911-b5c9-5dddeec174c1","contacts":"67191bc4-7ce7-4c22-84ae-1019b9c453a4","deals":"8e29ae79-be26-45ca-99d1-0cf125d68710","accounts":"44468681-52e0-4155-b0ec-4012a1a91f18","tasks":"728e8691-2156-467a-a2be-8ad71f3e1f8c","meetings":"76c15890-c07d-4e5e-890f-9e483d342db2","subscriptions":"39091b6c-ccd5-425d-aeb3-85ab3046e935","agency":"03786dcb-3f4c-45ad-b654-0aef9198eef1","services":"c5e240c6-39f2-41cb-b62b-ae2726324273","dailymove":"1fcfb0fe-2dc6-422d-82ff-41550255c384","cases":"48d59544-4535-4b0e-a0cc-9f0a265a165d","po":"aed1ac90-1c50-49c8-b2f3-cf6d3addbb5c","so":"0718eb3d-c6d0-4739-a40a-0bf6ff51d191","ndcagencies":"2603b7d8-8a61-49c9-9b4b-19f41cdbab63","calls":"c7985f66-36fe-4eee-b804-e2eef0c6a2e6"};
const M = MODS.leads, R = IDS.leads, out = {};
const list = await call('GET', `/modules/${M}/tags?limit=200`); out.list = list.s + ' ' + (list.s === 200 ? 'n=' + ((list.j.data.tags || list.j.data.items || list.j.data).length) : list.t.slice(0, 120));
const all = list.s === 200 ? (list.j.data.tags || list.j.data.items || list.j.data) : [];
const ids = []; const a = all.find(t => t.name === 'QA W2 tag A'); if (a) ids.push(a.id);
for (let i = 1; i <= 10; i++) { const c = await call('POST', `/modules/${M}/tags`, { name: 'QA W2 tag ' + i, color: '#22C55E' }); if (c.s < 300) ids.push(c.j.data.id); else out['create' + i] = c.s + ' ' + c.t.slice(0, 120); }
out.created = ids.length;
const r10 = await call('POST', `/modules/${M}/records/${R}/tags`, { tag_ids: ids.slice(0, 10) }); out.add10 = r10.s + ' ' + r10.t.slice(0, 200);
const r11 = await call('POST', `/modules/${M}/records/${R}/tags`, { tag_ids: ids.slice(0, 11) }); out.add11 = r11.s + ' ' + r11.t.slice(0, 250);
const g = await call('GET', `/modules/${M}/records/${R}`); out.recordTags = JSON.stringify(g.j.data.tags || (g.j.data.data.find(x => x.field === 'tags') || {}).value || '').slice(0, 300);
const usage = await call('GET', `/modules/${M}/tags/usage`); out.usage = usage.t.slice(0, 300);
const ed = await call('PATCH', `/modules/${M}/tags/${ids[1]}`, { name: 'QA W2 tag 1 edited', color: '#3B82F6' }); out.edit = ed.s + ' ' + ed.t.slice(0, 150);
const mg = await call('POST', `/modules/${M}/tags/${ids[2]}/merge`, { target_tag_id: ids[1] }); out.merge = mg.s + ' ' + mg.t.slice(0, 200);
globalThis.__tagIds = ids;
return { out, ids };
