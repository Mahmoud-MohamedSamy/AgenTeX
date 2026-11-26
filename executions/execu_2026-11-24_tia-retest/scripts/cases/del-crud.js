const RX = /^(Yes, please prepare the card now\.|Pick any existing|Create (a|an) .*QA TIA CRUD|Rename the .*QA TIA CRUD|Update the .*QA TIA CRUD|Delete the .*QA TIA CRUD|hi$)/;
const o = { s: {}, rounds: 0 }; const seen = new Set();
for (let round = 0; round < 40; round++) {
  const all = arr((await api('GET', '/agents/tia/conversations?limit=200')).j?.data);
  const del = all.filter(c => RX.test(c.title || '') && String(c.updated_at).startsWith('2026-11-25') && !seen.has(c.id)); o.rounds++;
  if (!del.length) { o.leftN = all.length; o.left = all.slice(0, 15).map(c => (c.updated_at || '').slice(0, 16) + ' | ' + (c.title || '').slice(0, 55)); break; }
  for (const c of del) { seen.add(c.id); const s = (await api('DELETE', `/agents/tia/conversations/${c.id}`)).s; o.s[s] = (o.s[s] || 0) + 1; }
}
ledger('Deleted unlogged CRUD test chats (Owner): ' + JSON.stringify(o.s)); return o;
