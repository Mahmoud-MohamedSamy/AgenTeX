const P = process.env.PFX.split('|');
const CIDS = [...new Set(fs.readFileSync(RUN + '/out/convs.txt', 'utf8').split(/\r?\n/).map(l => l.split(' ')).filter(x => P.includes(x[0]) && x.length >= 3).map(x => x[x.length - 1]))];
const o = { logged: CIDS.length, s: {} };
for (const id of CIDS) { const s = (await api('DELETE', `/agents/tia/conversations/${id}`)).s; o.s[s] = (o.s[s] || 0) + 1; }
const left = arr((await api('GET', '/agents/tia/conversations?limit=200')).j?.data); o.left = left.length; o.leftTitles = left.slice(0, 8).map(c => (c.updated_at || '').slice(0, 16) + ' | ' + (c.title || '').slice(0, 50));
ledger(`Deleted logged test chats ${process.env.WHO}: ${JSON.stringify(o.s)}, left ${o.left}`); return o;
