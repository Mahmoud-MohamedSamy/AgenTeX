const rows = fs.readFileSync(RUN + '/out/pa-results.jsonl', 'utf8').trim().split('\n').map(JSON.parse).filter(r => r.status === 200 && !r.text && !r.card && r.conv).slice(0, 3);
const out = []; for (const r of rows) { const m = await api('GET', `/agents/tia/conversations/${r.conv}/messages`); out.push({ key: r.key, msgs: arr(m.j?.data).map(x => ({ role: x.role, text: (x.text || '').slice(0, 300), actions: x.pending_actions, cards: x.cards })) }); }
return out;
