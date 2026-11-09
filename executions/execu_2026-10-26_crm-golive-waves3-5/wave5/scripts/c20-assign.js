const S = '4dbe62b6-fbf1-4111-9b7a-b954b870c071', U = '45ffbc5b-7859-4c21-be9e-7b5f30747ca2', out = {};
const a = await call('POST', `/iam/skills/users/${U}`, { skill_id: S, score: 4 }); out.assign4 = a.s + ' ' + a.t.slice(0, 160);
const b = await call('POST', `/iam/skills/users/${U}`, { skill_id: S, score: 99 }); out.score99 = b.s + ' ' + b.t.slice(0, 200);
const c = await call('POST', `/iam/skills/users/${U}`, { skill_id: S, score: -1 }); out.scoreMinus1 = c.s + ' ' + c.t.slice(0, 200);
const r = await call('GET', `/iam/skills/users/${U}`); out.userSkills = r.t.slice(0, 350);
const d = await call('DELETE', `/iam/skills/users/${U}/${S}`); out.remove = d.s;
const r2 = await call('GET', `/iam/skills/users/${U}`); out.after = r2.t.slice(0, 200);
return out;
