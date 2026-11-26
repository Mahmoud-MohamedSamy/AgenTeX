const T0 = process.env.T0; const mine = new Set((process.env.KEEP || '').split(','));
const all = []; let cur = ''; for (let i = 0; i < 10; i++) { const r = await api('GET', '/agents/tia/conversations?limit=50' + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); const d = arr(r.j?.data); all.push(...d); cur = r.j?.meta?.next_cursor || ''; if (!cur || !d.length) break; }
const target = all.filter(c => (c.updated_at || '') >= T0 && /(Propose a setup change|QA TIA|and one more question|Give me|How many|how many|Create a lead|Change the lead|Summarise|How is my|draft a private|Draft a private|Count the|For each of these|Show me all the details|What is the value|What is in the Single)/.test(c.title || ''));
const del = []; for (const c of target) del.push((await api('DELETE', `/agents/tia/conversations/${c.id}`)).s);
const left = all.filter(c => !target.includes(c)).map(c => (c.updated_at || '').slice(11, 16) + ' ' + (c.title || '').slice(0, 40));
return { who: process.env.WHO, total: all.length, deleted: del.length, ok: del.filter(s => s === 204).length, kept: left.length, keptSample: left.slice(0, 12) };
