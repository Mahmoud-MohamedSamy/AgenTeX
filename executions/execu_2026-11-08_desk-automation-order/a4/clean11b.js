// 12 Nov (user: "yes delete them too"): delete the 3 inactive Java retest leftovers found by E2E-6.
const NAMES = ['QA 2206 Date-Time 747251', 'QA 2205 On Edit control On Create 982741', 'QA 2205 On Edit 6985'];
const all = arr2((await api('GET', '/workflow/rules?take=500')).j?.data);
const out = { deleted: [] };
for (const r of all.filter(x => NAMES.includes(x.name))) out.deleted.push(r.name + ' ' + (await api('DELETE', '/workflow/rules/' + r.id)).s);
out.after = arr2((await api('GET', '/workflow/rules?take=500')).j?.data).length;
fs.appendFileSync('../ledger.md', '- ' + new Date().toISOString().slice(0, 19) + ' Java leftovers deleted (user OK): ' + JSON.stringify(out) + '\n');
return out;
