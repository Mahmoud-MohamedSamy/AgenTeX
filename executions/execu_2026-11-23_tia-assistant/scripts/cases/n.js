const simple = ['Reply with OK', 'What is a ticket?', 'Say hi', 'What can you help me with?', 'Name one Desk feature', 'Reply with YES', 'What is a department in Desk?', 'Reply with DONE', 'What does SLA mean?', 'Reply with READY'];
const res = []; for (const q of simple) { const r = await ask(q); res.push({ first: r.firstMs, total: r.totalMs, err: r.error }); }
const heavy = ['Count the tickets with status Open that I can see.', 'Count the tickets with status Closed that I can see.', 'List my 5 most recent tickets.'];
const hres = []; for (const q of heavy) { const r = await ask(q); hres.push({ first: r.firstMs, total: r.totalMs, err: r.error, t: (r.text || '').slice(0, 60) }); }
const med = a => { const s = a.filter(x => x != null).sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };
const h0 = Date.now(); const cv = await api('GET', '/agents/tia/conversations'); const hist = Date.now() - h0;
const out = { simpleFirstMedian: med(res.map(r => r.first)), simpleTotalMedian: med(res.map(r => r.total)), simpleMax: Math.max(...res.map(r => r.total)), errors: res.filter(r => r.err).length, heavy: hres, historyMs: hist, historyN: arr(cv.j?.data).length };
fs.writeFileSync(RUN + '/out/n.json', JSON.stringify({ res, hres, out }, null, 1));
return out;
