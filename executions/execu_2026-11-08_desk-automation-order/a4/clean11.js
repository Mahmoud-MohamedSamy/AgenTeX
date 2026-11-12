// 12 Nov (user: "yes delete the old QA AO WF rules"): delete every workflow rule and saved action named "QA AO WF …" (ours, from the A4 runs).
// Leaves "QA NDC", "QA AS6 WF", "QA 2205" and "test workflow" untouched.
const all = arr2((await api('GET', '/workflow/rules?take=500')).j?.data);
const mine = all.filter(r => /^QA AO WF /.test(r.name));
const out = { totalBefore: all.length, qaAoWf: mine.length, activeAmongThem: mine.filter(r => r.isActive).length, rules: {}, actions: {} };
for (const r of mine) { const d = await api('DELETE', '/workflow/rules/' + r.id); out.rules[d.s] = (out.rules[d.s] || 0) + 1; }
const acts = arr2((await api('GET', '/workflow/actions?moduleId=' + T)).j?.data).filter(a => /^QA AO WF/.test(a.name));
for (const a of acts) { const d = await api('DELETE', '/workflow/actions/' + a.id); out.actions[d.s] = (out.actions[d.s] || 0) + 1; }
const after = arr2((await api('GET', '/workflow/rules?take=500')).j?.data);
out.after = { total: after.length, active: after.filter(r => r.isActive).length, qaAoWfLeft: after.filter(r => /^QA AO WF /.test(r.name)).length, groups: [...new Set(after.map(r => r.name.split(' ').slice(0, 3).join(' ')))].slice(0, 15) };
fs.appendFileSync('../ledger.md', '- ' + new Date().toISOString().slice(0, 19) + ' A4 old-rule cleanup (user OK): ' + JSON.stringify(out) + '\n');
return out;
