const S = JSON.parse(fs.readFileSync('../a4/e2e134.json')); const R = {};
for (const t of S.made.tags) { let d = await api('DELETE', '/desk/tags/' + t + '?confirm=true'); if (d.s >= 300) d = await api('DELETE', '/desk/tags/' + t, { confirm: true }); R['tag ' + t.slice(0, 8)] = d.s + (d.s >= 300 ? ' ' + d.t.slice(0, 120) : ''); }
const p = await api('DELETE', '/desk/email-templates/e85cfdda-0621-4f80-857c-ac1013f07433'); R.p16tpl = p.s + (p.s >= 300 ? ' ' + p.t.slice(0, 150) : '');
const tj = (await api('GET', '/desk/tags?take=500')).j?.data; const TL = Array.isArray(tj) ? tj : (tj?.tags || []); R.myTagsLeft = TL.filter(t => S.made.tags.includes(t.id)).length;
R.qaTplLeft = ((await api('GET', '/desk/email-templates?take=200')).j?.data?.email_templates || []).filter(t => /^QA AO WF/.test(t.name)).length;
fs.appendFileSync('../ledger.md', '- ' + new Date().toISOString().slice(0, 19) + ' night cleanup 2 ' + JSON.stringify(R) + '\n'); log(JSON.stringify(R));
