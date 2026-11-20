const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_status-types/out/'; const TK = '88e8ea44-1658-4df3-9930-d0902b91073d';
const o = JSON.parse(fs.readFileSync(OUT + 'rj.json', 'utf8')); const id = o.t['QA NDC Reject'];
const tries = [[{ field: 'qa_ndc_rejection_reasons', value: { kind: 'string', value: 'QA ST test reason' } }], [{ field: 'qa_ndc_rejection_reasons', value: { kind: 'array', items: [{ kind: 'string', value: 'QA ST test reason' }] } }]];
for (const extra of tries) { const p = await api('PATCH', '/modules/' + TK + '/records/' + id, { data: [{ field: 'status', value: { kind: 'string', value: 'QA NDC Reject' } }, ...extra] }); log({ s: p.s, err: p.s >= 300 ? JSON.stringify(p.j?.error?.details || p.j?.error).slice(0, 300) : undefined }); if (p.s < 300) break; }
await sleep(10000); const t = (await api('GET', '/desk/tickets/' + id)).j?.data || {}; log({ desk: t.status, closed_at: t.closed_at ? 'set' : '-' });
