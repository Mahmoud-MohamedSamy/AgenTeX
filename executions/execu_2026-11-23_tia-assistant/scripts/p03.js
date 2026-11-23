const o = JSON.parse(fs.readFileSync('../out/probe2-desk-owner.json','utf8'));
const L = o['/iam/profiles'].body.data; const want = ['Desk Agent','Desk Supervisor','Desk Administrator','CRM Admin','Owner'];
const save = {};
for (const p of L.filter(x => want.includes(x.name))) { const r = await api('GET', `/iam/profiles/${p.profileId}/permissions`); save[p.name+'|'+p.appKey] = { id: p.profileId, s: r.s, body: r.j }; }
fs.writeFileSync('../out/p03-profiles.json', JSON.stringify(save, null, 1));
const da = save['Desk Agent|desk']; const b = da.body;
return { keys: Object.keys(save), shape: Object.keys(b.data||b), sample: JSON.stringify(b.data||b).slice(0,600) };
