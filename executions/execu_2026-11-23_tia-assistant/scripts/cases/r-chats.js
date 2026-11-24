const me = process.env.WHO; const keepOwn = 'e282805d-d90c-521b-80d7-be855a48480d';
const mine = fs.readFileSync(RUN + '/out/convs.txt', 'utf8').split('\n').filter(l => l.startsWith(me + ' ')).map(l => l.trim().split(' ').pop());
const all = []; let cur = '';
for (let i = 0; i < 10; i++) { const r = await api('GET', '/agents/tia/conversations' + (cur ? '?cursor=' + encodeURIComponent(cur) : '')); const L = arr(r.j?.data); all.push(...L); cur = r.j?.meta?.next_cursor || r.j?.meta?.cursor; if (!cur || !L.length) break; }
const known = /^(What can you help me with\?|Say hello in three words\.|What is 2 plus 2\?|Name one colour\.|Reply with|QA TIA|Summarise|How many|Count the|List|Show|Find|Create|Change|Add a|Write a|Run the|Explain|Search|Why was|What did|Give me|Print your|Read the|Please|In one answer|كم|ما هو|ما هي|And which|Department:|Which|What fields|What stage|What will|How much|How is|How do I|Is there|What should|Tell me|Hello)/i;
const del = all.filter(c => c.id !== keepOwn && (process.env.ALL === '1' || mine.includes(c.id) || (c.updated_at > '2026-11-23T14:30' && known.test(c.title || ''))));
let ok = 0, bad = []; for (const c of del) { const r = await api('DELETE', `/agents/tia/conversations/${c.id}`); if (r.s < 300) ok++; else bad.push(c.id.slice(0, 8) + ':' + r.s); }
const left = arr((await api('GET', '/agents/tia/conversations')).j?.data);
return { who: me, listed: all.length, deleted: ok, bad, leftN: left.length, left: left.slice(0, 8).map(c => c.id.slice(0, 8) + ' ' + (c.title || '').slice(0, 30) + ' ' + (c.updated_at || '').slice(0, 16)) };
