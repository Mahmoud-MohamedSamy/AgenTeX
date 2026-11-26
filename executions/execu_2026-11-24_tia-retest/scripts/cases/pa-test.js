const areas = arr((await api('GET', '/agents/tia-setup-areas')).j?.data).filter(x => !x.read_only);
const APPN = { crm: 'CRM', desk: 'Desk', salesiq: 'Omnichannel', analytics: 'Analytics', mail: 'Mail', notify: 'Notifications', telephony: 'Telephony', iam: 'Users and access' };
const mine = areas.filter(a => (process.env.APP === 'crm') === (a.app === 'crm'));
const OUT = RUN + '/out/pa-results.jsonl';
const _last = {}; (fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8').trim().split('\n').filter(Boolean).map(l => JSON.parse(l)) : []).forEach(x => _last[x.key] = x);
const done = new Set(Object.values(_last).filter(x => x.status === 200 && (x.text || x.card)).map(x => x.key));
let n = 0;
for (const a of mine) {
  if (done.has(a.key)) continue;
  const msg = `Propose a setup change in ${APPN[a.app] || a.app} → ${a.title}: add a new one named "QA TIA PA ${a.key}" with sensible defaults (or the smallest valid change if adding is not possible). Prepare it as a setup change card for me to confirm.`;
  let r = await ask(msg); if (r.error === 'TIA_BUSY' || r.j?.error?.code === 'TIA_BUSY') { await sleep(8000); r = await ask(msg); }
  const s = short(r); const acts = r.final?.pending_actions || [];
  const rej = []; for (const x of acts) { const q = await api('POST', `/agents/tia/actions/${x.id}/reject`, {}); rej.push(q.s); }
  const row = { key: a.key, app: a.app, title: a.title, status: s.s, err: s.err || (r.error ? String(r.error).slice(0,80) : null), types: r.types, ms: s.ms, card: acts.map(x => x.kind).join(',') || null, summary: acts.map(x => (x.summary || '').replace(/\s+/g, ' ').slice(0, 300)).join(' | ') || null, lines: acts[0]?.lines?.slice(0, 6) || null, text: (s.text || '').replace(/\s+/g, ' ').slice(0, 500), rejected: rej, conv: r.final?.conversation_id, at: stamp() };
  fs.appendFileSync(OUT, JSON.stringify(row) + '\n'); n++;
}
return { app: process.env.APP, ran: n, total: mine.length };
