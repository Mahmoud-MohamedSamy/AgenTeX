const o = JSON.parse(fs.readFileSync('../out/probe2-desk-owner.json','utf8'));
const L = o['/iam/profiles'].body.data; const want = ['Owner','Admin','CRM Admin','Desk Administrator','Desk Supervisor','Desk Agent','Desk Light Agent','User','Manager','Supervisor'];
const res = {};
let tried = null;
for (const p of L.filter(x => want.includes(x.name))) {
  let r = null;
  for (const path of [`/iam/profiles/${p.profileId}/permissions`, `/iam/profiles/${p.profileId}`]) { r = await api('GET', path); if (r.s === 200) { tried = path.split('/').pop(); break; } }
  const s = JSON.stringify(r.j || {});
  res[`${p.name} [${p.appKey}]`] = { s: r.s, ai: [...new Set(s.match(/ai:[a-z_:]+|desk:ai:[a-z_]+/g) || [])].join(' ') };
}
res._via = tried;
return res;
