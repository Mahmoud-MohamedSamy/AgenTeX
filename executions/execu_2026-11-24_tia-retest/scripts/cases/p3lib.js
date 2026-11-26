// Phase 3 helpers (appended after tlib by run.sh via P3 cases that `eval` this file).
const P3I = JSON.parse(fs.readFileSync(RUN + '/out/p3-ids.json', 'utf8'));
const P3OUT = RUN + '/out/p3-results.jsonl';
const p3rec = (id, verdict, note, extra) => { const row = { id, verdict, note, who: process.env.WHO, app: process.env.APPKEY || process.env.APP, at: stamp(), ...(extra || {}) }; fs.appendFileSync(P3OUT, JSON.stringify(row) + '\n'); log(id, verdict, note.slice(0, 200)); return row; };
const PAGEAPP = process.env.APPKEY || process.env.APP;
const tiaText = r => (r.text || r.final?.text || '').replace(/\s+/g, ' ').trim();
// Ask; if no card and not a refusal, one follow-up asking for the card. Returns {r, text, acts, conv}
const askCard = async (q, conv) => {
  let r = await ask(q + ' Prepare it as a card for me to confirm.', { page: { app: PAGEAPP }, ...(conv ? { conversation_id: conv } : {}) });
  if (/CAP_REACHED/.test(String(r.error))) throw new Error('CAP_REACHED');
  conv = r.final?.conversation_id || conv; let text = tiaText(r); let acts = r.final?.pending_actions || [];
  if (!acts.length && !/cannot|can't|not able|unable|not allowed|no access|not found|couldn't|could not|do not have/i.test(text)) { const r2 = await ask('Yes, please prepare the card now.', { page: { app: PAGEAPP }, conversation_id: conv }); text += ' || ' + tiaText(r2); acts = r2.final?.pending_actions || []; }
  return { text, acts, conv, card: acts.map(a => a.kind + ': ' + (a.summary || '').replace(/\s+/g, ' ').slice(0, 200)).join(' | ') || null, lines: acts[0]?.lines || null };
};
const confirmA = async a => { const c = await api('POST', `/agents/tia/actions/${a.id}/confirm`, {}); return { s: c.s, status: c.j?.data?.status, code: c.j?.error?.code, msg: String(c.j?.data?.message || c.j?.error?.message || '').slice(0, 300) }; };
const rejectA = async a => (await api('POST', `/agents/tia/actions/${a.id}/reject`, {})).s;
const val = (rec, f) => { const d = rec?.data; if (Array.isArray(d)) { const x = d.find(y => y.field === f); return x ? x.value?.value ?? x.value : undefined; } return d?.[f] ?? rec?.[f]; };
const getRec = async (mod, id) => { const r = await api('GET', `/modules/${mod}/records/${id}`); return { s: r.s, rec: r.j?.data }; };
