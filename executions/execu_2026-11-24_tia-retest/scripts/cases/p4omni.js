// Omnichannel: counts vs API and "this conversation" page context. Run with APP=omnichannel APPKEY=salesiq.
const o = {}; const P = { page: { app: 'salesiq' } };
const c = await api('GET', '/salesiq/conversations/counts'); o.counts = { s: c.s, d: JSON.stringify(c.j?.data).slice(0, 400) };
const l = await api('GET', '/salesiq/conversations?page=1&page_size=5&per_page=5'); const list = arr(l.j?.data); o.list = { s: l.s, n: list.length, meta: JSON.stringify(l.j?.meta).slice(0, 200), keys: Object.keys(list[0] || {}).slice(0, 20) };
const conv = list[0]; const ask1 = async (q, pg) => { const r = await ask(q, { page: pg || P.page }); const t = r.text || r.final?.text || ''; if (r.final?.conversation_id) await api('DELETE', `/agents/tia/conversations/${r.final.conversation_id}`); await sleep(2500); return (r.error ? r.error + ' ' : '') + t.replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '<email>').slice(0, 220); };
o.tia = {
  total: await ask1('How many chats are there in total in Omnichannel?'),
  open: await ask1('How many open chats are there right now?'),
};
if (conv) {
  o.conv = { id: String(conv.id).slice(0, 8), visitor: conv.visitor_name || conv.visitorName || conv.visitor?.name || null, status: conv.status, dept: conv.department_name || conv.departmentName || null, msgs: conv.message_count ?? conv.messageCount ?? null };
  o.tia.thisConv = await ask1('Summarise this conversation: who is the visitor, what did they ask, and what is the status?', { app: 'salesiq', route: `/chats/${conv.id}`, conversation_id: conv.id });
  o.tia.fakeConv = await ask1('Summarise this conversation.', { app: 'salesiq', route: '/chats/00000000-0000-4000-8000-000000000999', conversation_id: '00000000-0000-4000-8000-000000000999' });
}
fs.appendFileSync(RUN + '/out/p4-results.jsonl', JSON.stringify({ part: 'omni', at: new Date().toISOString().slice(0, 19), ...o }) + '\n'); return o;
