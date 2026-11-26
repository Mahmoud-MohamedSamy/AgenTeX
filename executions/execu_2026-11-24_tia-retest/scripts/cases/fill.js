// Re-read assistant replies from chat history for every CRUD row (fixes rows whose text was only in the final event).
const fill = async F => {
  const L = fs.readFileSync(F, 'utf8').trim().split('\n').map(l => JSON.parse(l)); const cache = {}; let fixed = 0;
  for (const x of L) {
    if (!x.conv) continue;
    if (!cache[x.conv]) { const r = await api('GET', `/agents/tia/conversations/${x.conv}/messages?limit=200`); const d = r.j?.data; cache[x.conv] = Array.isArray(d) ? d : (d?.items || d?.messages || []); }
    const M = cache[x.conv]; const i = M.findIndex(m => m.role === 'user' && m.text && m.text.startsWith(x.msg.slice(0, 60)) && !m._used);
    if (i < 0) continue; M[i]._used = true;
    const a1 = M[i + 1]?.role === 'assistant' ? M[i + 1].text || '' : '';
    let a2 = ''; if (M[i + 2]?.role === 'user' && /^Yes, please prepare the card now/.test(M[i + 2].text || '') && M[i + 3]?.role === 'assistant') { a2 = M[i + 3].text || ''; M[i + 2]._used = true; }
    const t = (a1 + (a2 || x.text.includes('FOLLOW-UP') ? ' || FOLLOW-UP: ' + a2 : '')).replace(/\s+/g, ' ').slice(0, 900);
    if (t !== x.text) { x.text_stream = x.text; x.text = t; fixed++; }
  }
  fs.writeFileSync(F, L.map(x => JSON.stringify(x)).join('\n') + '\n'); return { F: F.split('/').pop(), rows: L.length, fixed, stillBlank: L.filter(x => !x.text.replace('|| FOLLOW-UP:', '').trim()).length };
};
return [await fill(RUN + '/out/crud-results.jsonl'), await fill(RUN + '/out/crud2-results.jsonl')];
