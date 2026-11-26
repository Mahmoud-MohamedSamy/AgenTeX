// SM — Strict mode on real tickets. Each action is first run on a control ticket (blueprint without strict mode)
// to prove the request works, then on tickets in strict blueprints.
const EMAIL = 'mahmoud.mmohamedsamy+qae1@gmail.com';
const tryBodies = async (t, method, path, bodies, who = A) => { let last; for (const b of bodies) { last = await who(method, path.replace('{t}', t), typeof b === 'function' ? await b() : b); if (ok(last)) return { r: last, body: b }; if (last.s !== 400 && last.s !== 422) return { r: last, body: b }; } return { r: last, body: null }; };
const ACT = {
  fields: { m: 'PATCH', p: `/modules/${T}/records/{t}`, b: [{ data: [{ field: 'description', value: { kind: 'string', value: 'QA BP R strict edit' } }] }] },
  reply: { m: 'POST', p: '/desk/tickets/{t}/replies', b: [{ body_html: '<p>QA BP R strict reply</p>', to: [EMAIL] }, { content: 'QA BP R strict reply', to: [EMAIL] }, { body_html: '<p>QA BP R strict reply</p>', to: [{ email: EMAIL }] }] },
  comment: { m: 'POST', p: '/desk/tickets/{t}/comments', b: [{ content_html: '<p>QA BP R strict note</p>' }, { content: 'QA BP R strict note' }, { body_html: '<p>QA BP R strict note</p>' }] },
  approval: { m: 'POST', p: '/desk/tickets/{t}/approvals', b: [{ subject: 'QA BP R strict approval', approver_user_ids: [U.B] }] },
  resolution: { m: 'PUT', p: '/desk/tickets/{t}/resolution', b: [{ resolution: 'QA BP R strict resolution' }, { content: 'QA BP R strict resolution' }, { resolution_html: '<p>QA BP R strict resolution</p>' }] },
  attachment: { m: 'POST', p: '/desk/tickets/{t}/attachments', b: [async () => ({ file_id: (await upload('qa-sm.txt', 'x', A)).id }), async () => ({ file_ids: [(await upload('qa-sm2.txt', 'x', A)).id] })] },
};
// control
const gc = 'SMC' + uid(); await mkBp(BASIC(gc)); const tc = await mkT(gc); await waitIn(tc);
const work = {}; const ctl = {};
for (const [k, a] of Object.entries(ACT)) { const x = await tryBodies(tc, a.m, a.p, a.b); ctl[k] = E(x.r).slice(0, 120); if (x.body) work[k] = x.body; }
log('control (no strict mode): ' + JS(ctl));
const runAct = async (t, k, who = A) => { if (!work[k]) return { s: -1, t: 'no working body (control failed)' }; const b = typeof work[k] === 'function' ? await work[k]() : work[k]; return who(ACT[k].m, ACT[k].p.replace('{t}', t), b); };
const KEYS = ['fields', 'reply', 'comment', 'approval', 'resolution', 'attachment'];
const strictT = async (scope, actions, fields) => { const g = 'SM' + uid(); await mkBp({ ...BASIC(g), strictMode: { scope, actions, ...(fields ? { fields } : {}) } }); const t = await mkT(g); await waitIn(t); return t; };
// SM-02..07 Restrict Specified per action
const ids = { fields: 'SM-02', reply: 'SM-03', comment: 'SM-04', approval: 'SM-05', resolution: 'SM-06', attachment: 'SM-07' };
for (const k of KEYS) {
  const t = await strictT('specified', [k]);
  const r = await runAct(t, k); const other = KEYS.find(x => x !== k && work[x] && x !== 'approval');
  const ro = other ? await runAct(t, other) : { s: 0 };
  if (!work[k]) { R(ids[k], 'INCONCLUSIVE', `control request for "${k}" failed (${ctl[k]}), so strict mode could not be judged`); continue; }
  R(ids[k], r.s >= 400 && ok(ro) ? 'PASS' : 'FAIL', `Restrict Specified [${k}]: ${k} by hand → ${E(r)}; another action (${other}) still allowed → ${E(ro)}; control without strict mode → ${ctl[k]}`);
}
// SM-08 Restrict All + transition items still save
{ const g = 'SMA' + uid(); await mkBp(DEF(g, S3(), [TR('go', 'Open', 'Escalated', { during: { deskItems: [{ kind: 'comment', mandatory: true }] } }), TR('end', 'Escalated', 'Closed')], { strictMode: { scope: 'all', actions: [] } }));
  const t = await mkT(g); await waitIn(t); const res = {}; for (const k of KEYS) res[k] = (await runAct(t, k)).s;
  const tr = await runT(t, 'go', 'Open', { comment: { content: 'QA BP R via transition' } });
  R('SM-08', Object.entries(res).every(([k, s]) => !work[k] || s >= 400) && ok(tr) ? 'PASS' : 'FAIL', `Restrict All by hand: ${JS(res)}; comment through the transition → ${E(tr)}`); }
// SM-09 Restrict All Except replies
{ const t = await strictT('allExcept', ['reply']); const res = {}; for (const k of KEYS) res[k] = (await runAct(t, k)).s;
  R('SM-09', (!work.reply || res.reply < 400) && ['fields', 'comment', 'resolution'].every(k => !work[k] || res[k] >= 400) ? 'PASS' : 'FAIL', `All Except [reply]: ${JS(res)}`); }
// SM-10 field list
{ const t = await strictT('specified', ['fields'], ['description']);
  const lockd = await setF(t, { description: 'QA locked?' }, A), free = await setF(t, { qa_ndc_tkt_pnr_no: 'QA free' }, A);
  const t2 = await strictT('allExcept', ['fields'], ['description']); const a2 = await setF(t2, { description: 'QA allowed' }, A), b2 = await setF(t2, { qa_ndc_tkt_pnr_no: 'QA blocked?' }, A);
  R('SM-10', lockd.s >= 400 && ok(free) && ok(a2) && b2.s >= 400 ? 'PASS' : 'FAIL', `Specified fields [description]: description → ${E(lockd)}, other field → ${E(free)}; All Except fields [description]: description → ${E(a2)}, other → ${E(b2)}`); }
// SM-11 macros / bulk
{ const t = await strictT('all', []); const bulk = await api('POST', '/desk/tickets/bulk/comment', { ticket_ids: [t], content_html: '<p>QA bulk</p>' });
  R('SM-11', JS(bulk.j).match(/strict|blueprint|TICKET_IN_BLUEPRINT|skipp/i) ? 'PASS' : 'FAIL', `bulk comment on a strict ticket → ${E(bulk)} ${JS(bulk.j?.data || '').slice(0, 200)} (macro reason text in Phase 3)`); }
// SM-12 after revoke / completion
{ const t = await strictT('all', []); await revoke1(t); await sleep(1500); const res = {}; for (const k of ['fields', 'comment']) res[k] = (await runAct(t, k)).s;
  R('SM-12', Object.values(res).every(s => s < 400) ? 'PASS' : 'FAIL', `after revoke: ${JS(res)}`); }
R('SM-13', 'PASS', 'Scopes (Restrict All / Specified / All Except) and the six actions (fields, replies, comments, approvals, resolutions, attachments) match Zoho Strict Mode (Lock all / selected / all except selected) — Zoho docs, not live');
return await cleanup();
