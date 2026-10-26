const IDS = {"leads":"9207f81e-cd86-4911-b5c9-5dddeec174c1","contacts":"67191bc4-7ce7-4c22-84ae-1019b9c453a4","deals":"8e29ae79-be26-45ca-99d1-0cf125d68710","accounts":"44468681-52e0-4155-b0ec-4012a1a91f18","tasks":"728e8691-2156-467a-a2be-8ad71f3e1f8c","meetings":"76c15890-c07d-4e5e-890f-9e483d342db2","subscriptions":"39091b6c-ccd5-425d-aeb3-85ab3046e935","agency":"03786dcb-3f4c-45ad-b654-0aef9198eef1","services":"c5e240c6-39f2-41cb-b62b-ae2726324273","dailymove":"1fcfb0fe-2dc6-422d-82ff-41550255c384","cases":"48d59544-4535-4b0e-a0cc-9f0a265a165d","po":"aed1ac90-1c50-49c8-b2f3-cf6d3addbb5c","so":"0718eb3d-c6d0-4739-a40a-0bf6ff51d191","ndcagencies":"2603b7d8-8a61-49c9-9b4b-19f41cdbab63","calls":"c7985f66-36fe-4eee-b804-e2eef0c6a2e6"};
const M = MODS.leads, out = {};
const del = await call('DELETE', `/modules/${M}/tags/8a370317-0c17-40a0-8aff-90d228dcf673`); out.deleteTag7 = del.s + ' ' + del.t.slice(0, 120);
const recs = [IDS.leads, '2f937b0e-82a4-4e40-ae43-17a6c78d4788'];
const b = await call('POST', `/modules/${M}/records/tags/bulk`, { record_ids: recs, tag_ids: ['e30b7afc-5d0b-481e-bac4-0f4717906f55'], mode: 'append' }); out.bulk = b.s + ' ' + b.t.slice(0, 300);
let job = b.j && b.j.data && (b.j.data.job_id || b.j.data.id);
if (job) { for (let i = 0; i < 15; i++) { await new Promise(r => setTimeout(r, 2000)); const j = await call('GET', `/modules/${M}/record-tag-jobs/${job}`); out.job = j.s + ' ' + j.t.slice(0, 250); if (/completed|failed|done|partial/i.test(j.t)) break; } }
const g = await call('GET', `/modules/${M}/records/2f937b0e-82a4-4e40-ae43-17a6c78d4788`); const tv = (g.j.data.data.find(x => x.field === 'tags') || {}).value; out.second = JSON.stringify(tv).slice(0, 200);
const g1 = await call('GET', `/modules/${M}/records/${IDS.leads}`); const tv1 = (g1.j.data.data.find(x => x.field === 'tags') || {}).value; out.firstCount = tv1 && tv1.items && tv1.items.length;
const ow = await call('POST', `/modules/${M}/records/tags/bulk`, { record_ids: [IDS.leads], tag_ids: ['e30b7afc-5d0b-481e-bac4-0f4717906f55'], mode: 'overwrite' }); out.overwrite = ow.s + ' ' + ow.t.slice(0, 150);
await new Promise(r => setTimeout(r, 5000));
const g2 = await call('GET', `/modules/${M}/records/${IDS.leads}`); const tv2 = (g2.j.data.data.find(x => x.field === 'tags') || {}).value; out.afterOverwrite = tv2 && tv2.items && tv2.items.length;
return out;
