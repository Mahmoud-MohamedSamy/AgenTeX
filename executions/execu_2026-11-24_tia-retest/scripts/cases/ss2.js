// Strong-step limit. Saves baseline, sets per-user (USER) / workspace (WS) limit, asks card questions, restores.
const BF = RUN + '/out/ss-baseline.json';
const cur = async () => (await api('GET', '/agents/runtime-settings')).j?.data;
if (!fs.existsSync(BF)) { const c = await cur(); fs.writeFileSync(BF, JSON.stringify(c, null, 1)); ledger('SS baseline runtime-settings saved v' + c.version); }
const B = JSON.parse(fs.readFileSync(BF, 'utf8'));
const put = async (u, w) => { const c = await cur(); const full = { ...B }; delete full.version; const r = await api('PUT', '/agents/runtime-settings', { ...full, tia_strong_steps_per_user_daily: u, tia_strong_steps_per_workspace_daily: w, expected_version: c.version }); return { s: r.s, err: r.s >= 300 ? (r.t || '').slice(0, 200) : undefined }; };
const cnt = async () => (await api('GET', '/agents/runtime-status')).j?.data?.tia;
const o = {};
if (process.env.VALID) {
  for (const [u, w] of [[-1, 100], [1.5, 100], [10, -1], ['abc', 100], [100000, 100]]) { o['v_' + u + '_' + w] = await put(u, w); const c = await cur(); o['v_' + u + '_' + w].stored = [c.tia_strong_steps_per_user_daily, c.tia_strong_steps_per_workspace_daily]; }
} else {
  const U = Number(process.env.USER_L), W = Number(process.env.WS_L);
  try {
    o.set = await put(U, W); ledger(`SS strong steps set user=${U} ws=${W} ${JSON.stringify(o.set)} — restore`); await sleep(5000);
    o.before = await cnt(); o.turns = [];
    for (const q of ['Create a workflow rule on Leads named "QA TIA SS rule" that creates a follow-up task when a lead is created with lead source Web. Prepare the card.', 'Create a lead with first name "QA TIA SS lead" and last name "Limit". Prepare the card.']) {
      const r = await ask(q, { page: { app: 'crm' } }); await sleep(3000);
      o.turns.push({ q: q.slice(0, 40), err: r.error ? String(r.error).slice(0, 80) : null, cards: (r.final?.pending_actions || []).map(a => a.kind), text: (r.text || r.final?.text || '').slice(0, 220), after: (await cnt())?.strong_steps_today });
      for (const a of r.final?.pending_actions || []) await api('POST', `/agents/tia/actions/${a.id}/reject`, {}); if (r.final?.conversation_id) await api('DELETE', `/agents/tia/conversations/${r.final.conversation_id}`);
    }
    o.statusAfter = await cnt();
  } finally { o.restore = await put(B.tia_strong_steps_per_user_daily, B.tia_strong_steps_per_workspace_daily); }
}
const c = await cur(); o.restoredSame = c.tia_strong_steps_per_user_daily === B.tia_strong_steps_per_user_daily && c.tia_strong_steps_per_workspace_daily === B.tia_strong_steps_per_workspace_daily && c.session_turn_cap === B.session_turn_cap;
if (!o.restoredSame) o.restoreFinal = await put(B.tia_strong_steps_per_user_daily, B.tia_strong_steps_per_workspace_daily);
fs.appendFileSync(RUN + '/out/cr-results.jsonl', JSON.stringify({ id: 'SS-limit-' + (process.env.VALID ? 'valid' : process.env.USER_L + '-' + process.env.WS_L), ...o }) + '\n'); ledger('SS restored ' + o.restoredSame); return o;
