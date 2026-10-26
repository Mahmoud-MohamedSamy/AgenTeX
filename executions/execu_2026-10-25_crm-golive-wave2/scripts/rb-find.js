const IDS = {"leads":"9207f81e-cd86-4911-b5c9-5dddeec174c1","contacts":"67191bc4-7ce7-4c22-84ae-1019b9c453a4","deals":"8e29ae79-be26-45ca-99d1-0cf125d68710","accounts":"44468681-52e0-4155-b0ec-4012a1a91f18","tasks":"728e8691-2156-467a-a2be-8ad71f3e1f8c","meetings":"76c15890-c07d-4e5e-890f-9e483d342db2","subscriptions":"39091b6c-ccd5-425d-aeb3-85ab3046e935","agency":"03786dcb-3f4c-45ad-b654-0aef9198eef1","services":"c5e240c6-39f2-41cb-b62b-ae2726324273","dailymove":"1fcfb0fe-2dc6-422d-82ff-41550255c384","cases":"48d59544-4535-4b0e-a0cc-9f0a265a165d","po":"aed1ac90-1c50-49c8-b2f3-cf6d3addbb5c","so":"0718eb3d-c6d0-4739-a40a-0bf6ff51d191","ndcagencies":"2603b7d8-8a61-49c9-9b4b-19f41cdbab63","calls":"c7985f66-36fe-4eee-b804-e2eef0c6a2e6"};
const want = [IDS.agency, IDS.services]; const found = {}; let cursor = null, n = 0, pages = 0;
do { const r = await call('GET', `/audit/recycle-bin/items?limit=200${cursor ? '&cursor=' + encodeURIComponent(cursor) : ''}`);
  const d = (Array.isArray(r.j.data) ? r.j.data : r.j.data.items) || []; n += d.length;
  for (const x of d) if (want.includes(x.record_id)) found[x.record_id] = x; cursor = r.j.meta && r.j.meta.next_cursor; pages++; } while (cursor && pages < 20);
const fac = await call('GET', '/audit/recycle-bin/facets');
const ag = await call('GET', `/audit/recycle-bin/items?limit=20&module_key=agency`);
const tl = await call('GET', `/timeline/records/${MODS.agency}/${IDS.agency}/feed`);
return { scanned: n, found, facetModules: (fac.j.data.modules || []).filter(m => /agenc|servic/i.test(m.module_key)), agencyFilter: ag.s + ' ' + ag.t.slice(0, 300), timeline: tl.s + ' ' + tl.t.slice(0, 400) };
