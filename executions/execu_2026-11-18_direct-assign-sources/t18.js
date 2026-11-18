const T = '88e8ea44-1658-4df3-9930-d0902b91073d';
const check = async () => { const L = arr((await api('GET', '/modules/' + T + '/records?limit=5')).j).filter(x => x.created_at > '2026-11-18T13:00'); const out = []; for (const x of L) { const o = {}; for (const f of ((await api('GET', '/modules/' + T + '/records/' + x.id)).j?.data?.data || [])) o[f.field] = f.value?.value; out.push({ src: x.source, at: x.created_at.slice(11, 19), subj: (o.subject || '').slice(0, 40), ch: o.channel, owner: o.owner }); } return out; };
let r = await check(); log(r);
for (let i = 0; i < 6 && !r.some(x => /QA RT22/.test(x.subj)); i++) { await sleep(30000); r = await check(); }
log({ final: r.filter(x => /QA RT22/.test(x.subj)), at: new Date().toISOString().slice(11, 19) });
