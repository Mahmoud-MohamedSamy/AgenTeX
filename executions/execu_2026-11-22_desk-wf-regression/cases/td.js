const out = {}; const iso = ms => new Date(Date.now() + ms).toISOString().slice(0, 19) + 'Z';
const DT = (off, mode) => ({ kind: 'DateFieldRelative', dateFieldName: 'due_date', offsetSeconds: off, offsetMode: mode || 'wall_clock' });
// TD-13 barred actions on a date rule
const barred = {};
for (const a of [FU({ priority: 'high' }), { type: 'AddTicketComment', commentBody: 'x', commentPublic: false }, { type: 'MarkTicketSpam', spamContact: false }]) { const r = await mkRule('TD13' + a.type.slice(0, 6), DT(-300), [a]); barred[a.type] = r.s + ' ' + (r.err || '').slice(0, 140); if (r.id) await api('DELETE', '/workflow/rules/' + r.id); }
out.TD13 = barred;
const cases = {
  before: { off: -300, due: 7 * 60e3 },            // fire at due-5m = now+2m
  after: { off: 60, due: 60e3 },                    // fire at due+1m = now+2m
  moved: { off: 60, due: 60e3, act: async id => patchTicket(id, { due_date: iso(6 * 60e3) }) },   // move to +6m → fire ~+7m
  cleared: { off: 60, due: 2 * 60e3, act: async id => patchTicket(id, { due_date: null }) },
  unmatch: { off: 60, due: 2 * 60e3, crit: cmp('priority', 'Equal', S('medium')), act: async id => patchTicket(id, { priority: 'high' }) },
  deleted: { off: 60, due: 2 * 60e3, act: async id => delTicket(id) },
  past: { off: 60, due: -30 * 60e3 },
};
const st = {};
for (const [k, c] of Object.entries(cases)) {
  const h = await hook(); const tag = 'TD' + k;
  const r = await mkRule(tag, DT(c.off), [WH(h, '{"k":"' + k + '","due":"${due_date}"}')], c.crit ? { criteria: c.crit } : {});
  const t = await mkTicket(tag, { due_date: iso(c.due) });
  st[k] = { h, r, t, created: Date.now() };
}
await sleep(20000);
for (const [k, c] of Object.entries(cases)) if (c.act) { const x = await c.act(st[k].t.id); st[k].act = x.s; }
const deadline = Date.now() + 10 * 60e3;
const seen = {};
while (Date.now() < deadline) {
  for (const k of Object.keys(cases)) if (!seen[k]) { const q = await hookReqs(st[k].h); if (q.length) seen[k] = { at: Math.round((Date.now() - st[k].created) / 1000) + 's after create', n: q.length, body: q[0].content }; }
  if (Object.keys(seen).length === Object.keys(cases).length) break;
  await sleep(20000);
}
for (const k of Object.keys(cases)) out[k] = { save: st[k].r.s, err: st[k].r.err, act: st[k].act, hook: seen[k] || 'none in 10 min', exec: (await execs(st[k].t.id, st[k].r.id)).map(e => outcome(e) + ' ' + (e.dispatches || []).map(d => d.status + (d.scheduledFor ? '@' + d.scheduledFor : '')).join(',')) };
fs.writeFileSync(RUN + '/out/td.json', JSON.stringify(out, null, 1));
return out;
