// Batch 2b (NDC-Staging): redo C5/I3, I15, K12/K13 (NDC-2788), H12/M4, N3, M6.
const W = JSON.parse(fs.readFileSync('../a4/webhook-token.json', 'utf8')).uuid; const CA = '52f80185-f971-4321-aafd-20d2bba0717f';
const hook = async (path) => { const h = await fetch('https://webhook.site/token/' + W + '/requests?sorting=newest&per_page=50').then(r => r.json()).catch(() => ({})); return (h.data || []).filter(x => (x.url || '').includes(path)).map(x => String(x.created_at).slice(11, 19)); };
const t0 = new Date(Date.now() - 1000).toISOString();
try {
  // C5 / I3: blueprint on the department's own layout vs on another layout
  const probe = await mkT('C5P', 'layout probe'); const rec = (await api('GET', `/modules/${TK}/records/${probe}`)).j?.data || {}; const own = rec.layoutId || rec.layout_id;
  const other = L((await api('GET', `/modules/${TK}/layouts`)).j?.data).find(l => l.id !== own);
  const bOwn = await mkBp({ ...BASIC('C5A'), layoutId: own }), bOther = await mkBp({ ...BASIC('C5B'), layoutId: other.id });
  const ta = await mkT('C5A', 'own layout'), tb = await mkT('C5B', 'other layout'); await sleep(9000);
  const gb = await getBp(bOther.id);
  out('C5_I3', { ownLayout: own, otherLayout: other.name, storedLayoutName: gb?.layoutName || gb?.definition?.layoutName, createOwn: E(bOwn.r), createOther: E(bOther.r), ticketOwnLayoutEntered: !!(await bstate(ta)), ticketOtherLayoutEntered: !!(await bstate(tb)) });
  // I15: merge a ticket that is in a blueprint
  const bm = await mkBp(BASIC('I15')); const src = await mkT('I15', 'merge source'); const dst = await mkT('I15X', 'merge target'); await waitIn(src);
  const mg = await api('POST', '/desk/tickets/merge', { master_ticket_id: dst, source_ticket_ids: [src], cc_list_from: 'target' }); await sleep(5000);
  const sg = await api('GET', `/modules/${TK}/records/${src}`);
  out('I15', { merge: E(mg), sourceGet: sg.s, sourceState: (await bstate(src))?.activeStates || null, inProgressCount: L((await api('GET', `/modules/${TK}/blueprints?includeInactive=true`)).j?.data).find(b => b.id === bm.id)?.inProgressCount, sourceHist: (await hist(src)).slice(0, 5) });
  // K12 / K13 (NDC-2788): warning at 1 min -> custom action (slaPreExpiryEscalation), limit 2 min -> webhook (slaEscalation)
  const caBefore = (await hook('qa-bp-ca')).length;
  const k = await mkBp(DEF('K12', [ST('Open', { slaMinutes: 2, slaPreExpiryMinutes: 1, slaClock: 'calendar', slaPreExpiryEscalation: [{ kind: 'customAction', customActionId: CA, inputs: {} }], slaEscalation: [{ kind: 'webhook', url: 'https://webhook.site/' + W + '/qa-bp-k12', verb: 'POST', body: '{"subject":"{{subject}}"}' }] }), ST('Closed', { isTerminal: true })], [TR('end', 'Open', 'Closed')]));
  const tk = await mkT('K12'); const sk = await waitIn(tk);
  out('K12_K13_due', { create: E(k.r), warning_due_at: sk?.warning_due_at, escalation_due_at: sk?.escalation_due_at });
  // N3: department owner from another tenant (Anyware QA WF Dept R)
  const n3 = await mkBp(DEF('N3', [ST('Open'), ST('Closed', { isTerminal: true })], [TR('x', 'Open', 'Closed', { before: { departmentOwners: [{ departmentId: '9a7e391c-be72-49e4-a1cf-763e5c88e23d', access: 'full', userIds: [], teamIds: [] }] } })]), false);
  const n3u = await mkBp(DEF('N3U', [ST('Open'), ST('Closed', { isTerminal: true })], [TR('x', 'Open', 'Closed', { before: { allowedUserIds: ['7017d261-36ee-4e2f-9e00-0123456789ab'] } })]), false);
  out('N3', { otherTenantDepartment: E(n3.r), unknownUser: E(n3u.r) });
  // M6: recycle bin restore, then purge by exact id
  const m6 = await mkBp(BASIC('M6'), false); const d1 = await api('DELETE', `/modules/${TK}/blueprints/${m6.id}`); made.bps = made.bps.filter(x => x !== m6.id); keep();
  const find = async () => L((await api('GET', '/audit/recycle-bin/items?app_key=desk&limit=200')).j?.data).filter(x => JSON.stringify(x).includes(m6.id));
  const h1 = await find(); const rs = h1.length === 1 ? await api('POST', '/audit/recycle-bin/restore', { ids: [h1[0].id] }) : null; await sleep(3000);
  const back = await api('GET', `/modules/${TK}/blueprints/${m6.id}`); const d2 = await api('DELETE', `/modules/${TK}/blueprints/${m6.id}`); await sleep(3000);
  const h2 = await find(); const pg = h2.length === 1 ? await api('POST', '/audit/recycle-bin/delete', { ids: [h2[0].id] }) : null;
  out('M6', { delete1: E(d1), inBin1: h1.length, binItem: h1[0] && { type: h1[0].entity_type || h1[0].type, name: h1[0].name || h1[0].title }, restore: rs && E(rs), getAfterRestore: back.s, restoredActive: back.j?.data?.isActive, delete2: E(d2), inBin2: h2.length, purge: pg && (E(pg) + ' ' + JSON.stringify(pg.j?.data || {}).slice(0, 120)), inBinAfterPurge: (await find()).length });
  // wait for K12/K13 timers
  await sleep(170000);
  out('K12_K13', { webhookAtLimit: await hook('qa-bp-k12'), customActionHitsSinceStart: (await hook('qa-bp-ca')).length - caBefore, hist: (await hist(tk)).slice(0, 8), feed: L((await api('GET', `/desk/tickets/${tk}/activity`)).j?.data).map(a => a.action).slice(0, 8) });
  // H12 / M4: audit events since the start
  const ev = L((await api('GET', '/audit/events?app_key=desk&limit=200')).j?.data); const recent = ev.filter(x => String(x.occurred_at || x.created_at || x.at || '') >= t0);
  out('H12_M4', { recentCount: recent.length, keys: ev[0] ? Object.keys(ev[0]).join(',') : '', blueprintEvents: recent.filter(x => /blueprint/i.test(JSON.stringify(x))).slice(0, 8).map(x => JSON.stringify(x).replace(/[\w.+-]+@[\w.-]+/g, '<e>').slice(0, 260)) });
} catch (e) { out('ERROR', String(e.stack || e).slice(0, 500)); }
out('cleanup', await cleanAll());
fs.writeFileSync('../a6/b2b-out.json', JSON.stringify(R, null, 1)); log(JSON.stringify(R, null, 1));
