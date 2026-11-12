const mid = await modId(); const o = {};
if (APP === 'crm' && I.wf) { o.wf = (await api('DELETE', '/web-forms/' + I.wf)).s; if (o.wf < 300) delete I.wf; }
if (I.bp) { o.bp = SR(await api('DELETE', '/modules/' + mid + '/blueprints/' + I.bp)).slice(0, 150); if (o.bp.startsWith('2')) delete I.bp; }
let n = 0; for (const x of await rules(mid)) if (String(x.name).startsWith(P) && x.id !== I.g17) { await delRule(mid, x.id); n++; } o.rules = n;
for (const l of arr((await api('GET', '/modules/' + mid + '/layouts')).j.data).filter(l => l.name === P + ' Layout')) o.layout = SR(await api('DELETE', '/modules/' + mid + '/layouts/' + l.id)).slice(0, 150);
SAVE(); return o;
