const o = {}; const sum = d => ['open', 'pending', 'reopened', 'closed', 'archived', 'missed', 'queued'].reduce((a, k) => a + (d?.[k] || 0), 0);
const c1 = (await api('GET', '/salesiq/conversations/counts')).j?.data; o.countsSumBefore = sum(c1);
const r = await ask('How many chats are there in total in Omnichannel?', { page: { app: 'salesiq' } }); o.tiaTotal = (r.text || r.final?.text || '').slice(0, 160); if (r.final?.conversation_id) await api('DELETE', `/agents/tia/conversations/${r.final.conversation_id}`);
o.countsSumAfter = sum((await api('GET', '/salesiq/conversations/counts')).j?.data);
const list = arr((await api('GET', '/salesiq/conversations')).j?.data); const pick = list.filter(x => x.visitor_display_name).slice(0, 2);
o.ctx = [];
for (const c of pick) { const pg = { app: 'salesiq', route: `/chats/${c.conversation_id}`, conversation_id: c.conversation_id };
  const t = await ask('Summarise this conversation: who is the visitor and what is the status?', { page: pg }); const tx = t.text || t.final?.text || ''; if (t.final?.conversation_id) await api('DELETE', `/agents/tia/conversations/${t.final.conversation_id}`);
  o.ctx.push({ visitor: c.visitor_display_name, status: c.status, rightVisitor: tx.includes(String(c.visitor_display_name).split(' ')[0]), text: tx.slice(0, 180) }); await sleep(2500); }
return o;
