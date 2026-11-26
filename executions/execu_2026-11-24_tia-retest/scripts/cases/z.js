const o = { feedback: (await api('POST', '/agents/tia/feedback', {})).s, feedbackGet: (await api('GET', '/agents/tia/feedback')).s, voice: (await api('GET', '/agents/tia/voice')).s };
for (const [k, q] of [['Z-01', 'Show me deal amounts by stage as a chart.'], ['Z-02', 'Build a new report of deals grouped by owner and save it.'], ['Z-04', 'Every Monday at 9am, send me the number of new leads from last week.']]) {
  const r = await ask(q, { page: { app: 'crm' } }); o[k] = { text: (r.text || r.final?.text || '').slice(0, 220), cards: JSON.stringify(r.final?.cards || null).slice(0, 160), actions: (r.final?.pending_actions || []).map(a => a.kind) };
  for (const a of r.final?.pending_actions || []) await api('POST', `/agents/tia/actions/${a.id}/reject`, {}); if (r.final?.conversation_id) await api('DELETE', `/agents/tia/conversations/${r.final.conversation_id}`); await sleep(3000);
}
const p = (await api('GET', '/ai/policy')).j?.data?.descriptor; o.policyKeys = Object.keys(p?.features || {}); o.piiKeys = JSON.stringify(p).match(/pii|mask|anonym/gi) || [];
fs.appendFileSync(RUN + '/out/z-results.jsonl', JSON.stringify({ at: new Date().toISOString().slice(0, 19), ...o }) + '\n'); return o;
