const o = {}; const NEW = 'mahmoud.mmohamedsamy+qagln@gmail.com';
const all = (await api('GET', '/iam/users?limit=200')).j.data; const u = all.filter(x => x.email === NEW); o.newRows = u.map(x => ({ status: x.status, inv: x.invitationStatus, exp: x.invitationExpiresAt, id: x.invitationId, p: x.profileNames }));
const pick = ['fedelav803@meinvr.com', 'kinase5517@meinvr.com', 'pobit51574@meinvr.com', 'belopoy720@meinvr.com', 'pacox68754@meinvr.com', 'mahmoud.mohamed1@taviportal.com', 'mahmoud.mohamed2@taviportal.com', 'mahmoud.mahamed1515@gmail.com', 'mahmoud.mmohamedsamy@gmail.com', 'mmohamed@anyware.software'];
const ids = []; for (const e of pick) { const x = all.find(y => y.email === e); if (x) { o[e] = JSON.stringify(x.profileNames) + ' | ' + x.userId; ids.push(x.userId); } }
const ad = await api('POST', '/desk/agents/departments/query', { user_ids: ids }); o.depts = { s: ad.s, d: JSON.stringify(ad.j && (ad.j.data || ad.j.error)).slice(0, 1800) };
return done(o);
