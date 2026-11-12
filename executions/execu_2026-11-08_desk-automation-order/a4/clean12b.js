// 12 Nov: delete the rules and saved actions this session made on screen / outside the ledger, by exact name.
const RULES = ['QA AO WF C5 عربي 😀 <img src=x onerror=window.__x5=1>', 'QA AO WF G4 dbl'];
const ACTS = ['QA AO WF K8 inactive', 'QA AO WF K10 عربي 😀', 'QA AO WF K10 <img src=x onerror=window.__k10=1>'];
const out = { rules: [], actions: [] };
for (const r of arr2((await api('GET', '/workflow/rules?take=500')).j?.data).filter(x => RULES.includes(x.name) && x.createdAt >= '2026-11-12' || RULES.includes(x.name))) out.rules.push(r.name.slice(0, 20) + ' ' + (await api('DELETE', '/workflow/rules/' + r.id)).s);
for (const a of arr2((await api('GET', '/workflow/actions?moduleId=' + T)).j?.data).filter(x => ACTS.includes(x.name))) out.actions.push(a.name.slice(0, 20) + ' ' + (await api('DELETE', '/workflow/actions/' + a.id)).s);
fs.appendFileSync('../ledger.md', '- ' + new Date().toISOString().slice(0, 19) + ' A4 screen-run cleanup: ' + JSON.stringify(out) + '\n');
return out;
