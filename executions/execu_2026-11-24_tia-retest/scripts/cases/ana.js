// Analytics: report page context, forged report id, dashboards visibility.
const RID = '03d7cdc2-2dda-4d7e-aa38-a1b9fdd65211'; const o = { who: process.env.WHO };
const pg = { app: 'analytics', route: `/reports/view/${RID}`, report_id: RID };
const askT = async (q, page) => { const r = await ask(q, { page }); const t = r.text || r.final?.text || ''; if (r.final?.conversation_id) await api('DELETE', `/agents/tia/conversations/${r.final.conversation_id}`); await sleep(2000); return (r.error ? r.error + ' ' : '') + t.slice(0, 260); };
o.apiReport = (await api('GET', `/reporting/reports/${RID}`)).s;
const d = await api('GET', '/reporting/dashboards?limit=50'); o.apiDashboards = { s: d.s, names: arr(d.j?.data?.items || d.j?.data).map(x => x.name).slice(0, 10) };
o.explain = await askT('Explain this report: how many rows does it have, and what is the grand total amount?', pg);
o.total = await askT('What is the grand total of the Amount column in this report?', pg);
o.dash = await askT('Which dashboards can I see? List their names.', { app: 'analytics' });
fs.appendFileSync(RUN + '/out/p7-results.jsonl', JSON.stringify({ part: 'analytics', at: new Date().toISOString().slice(0, 19), ...o }) + '\n'); return o;
