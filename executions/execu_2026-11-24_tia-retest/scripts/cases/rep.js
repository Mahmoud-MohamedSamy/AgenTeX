const o = { who: process.env.WHO, rows: [] };
for (const q of ['List the reports I can see, with their names.', 'Find a report about leads and run it. Tell me the report name and the total number of records it returns.', 'How many leads are there in CRM?']) {
  const r = await ask(q, { page: { app: 'crm' } }); const t = r.text || r.final?.text || ''; o.rows.push({ q: q.slice(0, 40), err: r.error ? String(r.error).slice(0, 60) : null, text: t.slice(0, 400) });
  if (r.final?.conversation_id) await api('DELETE', `/agents/tia/conversations/${r.final.conversation_id}`); await sleep(3000);
}
fs.appendFileSync(RUN + '/out/rep-results.jsonl', JSON.stringify({ at: new Date().toISOString().slice(0, 19), ...o }) + '\n'); return o;
