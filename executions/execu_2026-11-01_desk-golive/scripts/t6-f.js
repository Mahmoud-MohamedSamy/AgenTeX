const C = 'a262a4a9-b3b8-4ed9-858f-9423dd085989';
const fr = await api('GET', '/modules/' + TM + '/fields'); const fl = arr(D(fr.j)); out.nf = fl.length + ' ' + fr.t.slice(0, 120); out.names = fl.map(x => x.api_name || x.name || x.key).filter(n => /cont|acc|email/i.test(n || '')).join(',');
for (const n of [3, 4]) { const t = await mk(TM, 'ticket', 'QA GL TM menu ' + n, { subject: 'QA GL TM menu ' + n, department: MK, status: 'Open', email: 'qa-gl-tm-c1@example.com', contact_id: C }); out['t' + n] = t; out['r' + n] = JSON.stringify(await get(TM, t.id)).slice(0, 400); }
return fin({ out });
