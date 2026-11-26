const P = { page: { app: 'crm' } }; const o = { rows: [] };
const say = async (cid, m) => { const r = await stream('/agents/tia/turn/stream', { turn_id: 'qa' + Date.now() + Math.random().toString(36).slice(2, 6), ...(cid ? { conversation_id: cid } : {}), message: m, ...P }, 120000); return { cid: r.final?.conversation_id, text: r.text || r.final?.text || '', err: r.error || null }; };
for (let i = 0; i < Number(process.env.N || 10); i++) {
  const kind = process.env.KIND; const v = (kind === 'code' ? 'XT' : 'FALCON') + Math.random().toString(36).slice(2, 6).toUpperCase(); const num = 100 + Math.floor(Math.random() * 800);
  const first = kind === 'code' ? `Please remember my personal code word for this chat: ${v}. Just confirm.` : `For this chat, our project is called ${v} and its budget is ${num} thousand. Just confirm.`;
  const second = kind === 'code' ? 'What is my personal code word? Reply with the code word only.' : 'What is the project called, and what is its budget?';
  const a = await say(null, first); const b = await say(a.cid, second);
  o.rows.push({ ok: b.text.includes(v) && (kind === 'code' || b.text.includes(String(num))), first: a.text.replace(/(XT|FALCON)\w+/g, '***').slice(0, 110), second: b.text.replace(/(XT|FALCON)\w+/g, '***').slice(0, 110), err: a.err || b.err });
  if (a.cid) await api('DELETE', `/agents/tia/conversations/${a.cid}`);
}
o.score = o.rows.filter(r => r.ok).length + '/' + o.rows.length; fs.appendFileSync(RUN + '/out/recall-results.jsonl', JSON.stringify({ kind: process.env.KIND, at: new Date().toISOString().slice(0, 19), ...o }) + '\n'); return o;
