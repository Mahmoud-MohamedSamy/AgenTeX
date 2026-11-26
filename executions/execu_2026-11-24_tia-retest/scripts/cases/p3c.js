// Group C — Omnichannel (APPKEY=salesiq) and Analytics answers, Owner. Truth probes are best-effort.
const A = PAGEAPP; const out = {};
const probe = async ps => { for (const p of ps) { const r = await api('GET', p); if (r.s === 200) return { p, n: arr(r.j?.data).length, total: r.j?.meta?.total ?? r.j?.data?.total ?? null, first: JSON.stringify(arr(r.j?.data)[0] || r.j?.data || '').slice(0, 200) }; } return null; };
const Q = A === 'salesiq' ? [
  ['C-02', 'How many open chats (conversations) are there right now, and how many were started today?', ['/salesiq/conversations?status=open&limit=100', '/omnichannel/conversations?status=open&limit=100', '/conversations?status=open&limit=100', '/chats?status=open&limit=100']],
  ['C-03', 'Show me the transcript of the most recent chat conversation.', ['/salesiq/conversations?limit=1', '/conversations?limit=1', '/chats?limit=1']],
  ['C-04', 'Who is the most recent visitor on our website, and which pages did they view?', ['/salesiq/visitors?limit=5', '/visitors?limit=5']],
  ['C-05', 'Which operators are online right now?', ['/salesiq/operators?limit=50', '/operators?limit=50']],
  ['C-10', 'How many leads are there in CRM, and how many open tickets in Desk?', []],
  ['C-11', 'كم عدد المحادثات المفتوحة الآن؟', []],
] : [
  ['C-07', 'List the reports I have and what the first one shows for last month.', ['/analytics/reports?limit=20', '/reports?limit=20']],
  ['C-08', 'Summarise the first dashboard I have.', ['/analytics/dashboards?limit=20', '/dashboards?limit=20']],
  ['C-10', 'How many leads are there in CRM, and how many open tickets in Desk?', []],
  ['C-11', 'كم عدد التقارير المتاحة لدي؟', []],
];
for (const [id, q, ps] of Q) {
  const r = await ask(q, { page: { app: A } }); const t = tiaText(r); const truth = ps.length ? await probe(ps) : null;
  out[id] = p3rec(id + (A === 'salesiq' ? '-omni' : '-analytics'), '?', `Q: ${q} | A: ${t.slice(0, 400)} | refs=${(r.final?.refs || []).length} cards=${(r.final?.cards || []).map(c => c.type + ':' + (c.header || '')).join(',')} | truth=${JSON.stringify(truth)}`, { conv: r.final?.conversation_id }).note.slice(0, 300);
  await sleep(2000);
}
return out;
