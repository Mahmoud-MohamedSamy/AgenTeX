const o = { rows: [] };
const lead = arr((await api('GET', `/modules/${M.leads}/records?page=1&per_page=50&filters=${encodeURIComponent(JSON.stringify([{ field: 'first_name', operator: 'starts_with', value: 'QA AEO SH H-02' }]))}`)).j?.data)[0];
o.leadCompanyFields = arr(lead?.data).filter(x => /compan|account/i.test(x.field)).map(x => x.field + '=' + JSON.stringify(x.value?.value ?? x.value).slice(0, 40));
for (const q of ['How many leads were created last month?', 'How many leads were created in October 2026?', 'How many leads were created today?', 'How many deals are in the stage closed_won?', 'How many deals are in the Closed Won stage?', 'How many tasks are not completed yet?', 'What is the sum of the Amount field across all deals?']) {
  const r = await ask(q, { page: { app: 'crm' } }); o.rows.push({ q, text: (r.text || r.final?.text || '').slice(0, 160) }); if (r.final?.conversation_id) await api('DELETE', `/agents/tia/conversations/${r.final.conversation_id}`); await sleep(2500);
}
o.oct = (await api('GET', `/modules/${M.leads}/records?page=1&per_page=1&filters=${encodeURIComponent(JSON.stringify([{ field: 'created_at', operator: 'is_between', value: ['2026-10-01', '2026-10-31T23:59:59Z'] }]))}`)).j?.meta?.total_count;
fs.appendFileSync(RUN + '/out/bm-results.jsonl', JSON.stringify({ kind: 'bm3', at: new Date().toISOString().slice(0, 19), ...o }) + '\n'); return o;
