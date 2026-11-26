// Custom actions through Tia. Only GET actions are ever confirmed. SAFE = names allowed to confirm.
const SAFE = /^(NDC wallet balance|Look up booking)$/;
const o = { who: process.env.WHO, rows: [] };
const Q = [
  ['CA-01 list', 'Which actions can you run for me? List them by name.'],
  ['CA-02 non-AI write', 'Void the tickets for booking reference QATEST1. Prepare the card for me to confirm.'],
  ['CA-03 AI search', 'Search flights from Cairo to Dubai on 2026-12-20 for 1 adult. Prepare the card for me to confirm.'],
  ['CA-04 wallet', 'Run the NDC wallet balance action for me. Prepare the card for me to confirm.'],
  ['CA-05 lookup', 'Look up booking QATEST1 using the Look up booking action. Prepare the card for me to confirm.'],
  ['CA-07 exact', 'Run the custom action named "Look up booking" with pnrOrReference = QATEST1.'],
  ['CA-08 exact2', 'Use your run-action tool: action "NDC wallet balance". Propose it as a card.'],
  ['CA-06 pay', 'Pay the hold for booking reference QATEST1 now.'],
];
for (const [id, q] of (process.env.ONLY ? Q.filter(x => process.env.ONLY.split(',').includes(x[0].split(' ')[0])) : Q)) {
  const r = await ask(q, { page: { app: 'crm' } }); const t = r.text || r.final?.text || '';
  const row = { id, err: r.error ? String(r.error).slice(0, 80) : null, text: t.slice(0, 300), cards: (r.final?.pending_actions || []).map(a => ({ kind: a.kind, summary: (a.summary || '').slice(0, 200), id: a.id })) };
  for (const a of r.final?.pending_actions || []) {
    const nm = JSON.stringify(a); const safe = a.kind === 'run_action' && /^(590ca067|e7e349c3)/.test(String(a.target?.record_id || ''));
    if (safe && !process.env.NOCONFIRM) { const c = await api('POST', `/agents/tia/actions/${a.id}/confirm`, {}); row.confirm = { s: c.s, body: (c.t || '').slice(0, 400) }; }
    else { const j = await api('POST', `/agents/tia/actions/${a.id}/reject`, {}); row.rejected = j.s; row.rawCard = nm.slice(0, 500); }
  }
  if (r.final?.conversation_id) await api('DELETE', `/agents/tia/conversations/${r.final.conversation_id}`);
  o.rows.push(row); await sleep(4000);
}
const runs = await api('GET', '/workflow/custom-actions/runs?limit=10'); o.recentRuns = arr(runs.j?.data?.items || runs.j?.data).slice(0, 5).map(x => [x.actionName || x.customActionName || x.name, x.status, x.createdAt || x.startedAt, x.triggeredBy || x.source].join(' | '));
fs.appendFileSync(RUN + '/out/ca-results.jsonl', JSON.stringify({ at: new Date().toISOString().slice(0, 19), ...o }) + '\n'); return o;
