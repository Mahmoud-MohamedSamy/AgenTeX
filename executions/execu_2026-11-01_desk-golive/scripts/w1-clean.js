// Cleanup of the QA GL objects this lane created (ids from wave1/after/created.jsonl). Only ids we created.
const S = x => ({ s: x.s, e: x.j && x.j.error ? (x.j.error.code + ': ' + String(x.j.error.message).slice(0, 140)) : undefined });
const o = {};
const name = async (p, f) => { const r = await api('GET', p); return r.s === 200 ? f(r.j.data) : null; };
// guard: confirm each target is ours by name before deleting
const t = { team: 'd0a38429-33dd-4688-b533-82e472e552cc', role: '52fd2a65-9ee9-43b7-b1e7-8d10c4c3bd8c', child: '9b2c929a-51f3-4f3f-a98a-ed76ddc07597', profile: 'c83dddbf-983a-4c09-b004-bbfbbfe0fe6b', hl: '9c0d5bec-ad22-4660-b315-30f562a113b6', bh: '8594d6e4-0eb6-4060-8333-751080e52068', dept: '0d3c1585-5df2-40c2-894c-752cbdaead08' };
const tn = await name('/desk/teams/' + t.team, d => (d.team || d).name); o.team = /^QA GL/.test(tn || '') ? S(await api('DELETE', '/desk/teams/' + t.team + '?unassign=true')) : 'skip ' + tn;
const roles = (await api('GET', '/iam/org-units?app_key=desk')).j.data; const rn = (roles.find(x => x.orgUnitId === t.role) || {}).name; o.role = /^QA GL/.test(rn || '') ? S(await api('DELETE', '/iam/org-units/' + t.role + '?app_key=desk')) : 'skip ' + rn;
const profs = (await api('GET', '/iam/profiles')).j.data; const pn = id => (profs.find(x => x.profileId === id) || {}).name;
o.child = /^QA GL/.test(pn(t.child) || '') ? S(await api('DELETE', '/iam/profiles/' + t.child)) : 'skip';
o.profile = /^QA GL/.test(pn(t.profile) || '') ? S(await api('DELETE', '/iam/profiles/' + t.profile)) : 'skip';
const hn = await name('/desk/holiday-lists/' + t.hl, d => d.name); o.hl = /^QA GL/.test(hn || '') ? S(await api('DELETE', '/desk/holiday-lists/' + t.hl)) : 'skip ' + hn;
const bn = await name('/iam/tenant/business-hours/profiles/' + t.bh, d => d.name); o.bh = /^QA GL/.test(bn || '') ? S(await api('DELETE', '/iam/tenant/business-hours/profiles/' + t.bh)) : 'skip ' + bn;
const dn = await name('/desk/departments/' + t.dept, d => d.name); o.dept = /^QA GL/.test(dn || '') ? S(await api('DELETE', '/desk/departments/' + t.dept)) : 'skip ' + dn;
return done(o);
