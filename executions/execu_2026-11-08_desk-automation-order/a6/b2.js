// Batch 2 (API, NDC-Staging): C5/I3 redo, J15 redo, I15 redo, E2, E4 (NDC-2753), F5, F7, K12, K13 (NDC-2788), H12/M4 audit, M6 recycle bin, M1/M2, N3.
const W = JSON.parse(fs.readFileSync('../a4/webhook-token.json', 'utf8')).uuid; const CA = '52f80185-f971-4321-aafd-20d2bba0717f';
const hook = async (path) => { const h = await fetch('https://webhook.site/token/' + W + '/requests?sorting=newest&per_page=50').then(r => r.json()).catch(() => ({})); return (h.data || []).filter(x => (x.url || '').includes(path)).map(x => ({ at: String(x.created_at).slice(11, 19), method: x.method, body: String(x.content || '').slice(0, 160) })); };
const t0 = new Date().toISOString();
try {
  // C5 / I3 redo: layout set as top-level layout_id
  const lays = L((await api('GET', `/modules/${TK}/layouts`)).j?.data); const L1 = lays[0], L2 = lays[1];
  const b3 = await mkBp({ ...BASIC('C5'), layoutId: L1.id });
  const mkL = async (suffix, lid) => { const r = await api('POST', `/modules/${TK}/records`, { layout_id: lid, data: Object.entries({ subject: 'QA BP C5 ' + suffix, status: 'Open', department: CS }).map(([f, v]) => ({ field: f, value: enc(v) })) }); const id = r.j?.data?.id; if (id) { made.tickets.push(id); keep(); } return { id, s: E(r), layout: r.j?.data?.layoutId || r.j?.data?.layout_id }; };
  const a = await mkL('layout one', L1.id), b = await mkL('layout two', L2.id); await sleep(8000);
  out('C5_I3', { L1: L1.name, L2: L2.name, ticketL1: { ...a, entered: !!(await bstate(a.id)) }, ticketL2: { ...b, entered: !!(await bstate(b.id)) } });
  // J15 redo: continuous, longer wait
  const c = await mkBp(DEF('J15', [ST('Open'), ST('Escalated'), ST('On Hold'), ST('Closed', { isTerminal: true })], [TR('first', 'Open', 'Escalated'), TR('auto', 'Escalated', 'On Hold'), TR('end', 'On Hold', 'Closed', { during: { checklist: [{ id: 'k2', label: 'QA', mandatory: true }] } })], { continuous: true }));
  const gc = await getBp(c.id); const tc = await mkT('J15'); await waitIn(tc); const rc = await runT(tc, 'first'); const seen = [];
  for (let i = 0; i < 6; i++) { await sleep(5000); seen.push((await bstate(tc))?.activeStates?.join()); }
  out('J15', { continuousStored: gc?.definition?.continuous ?? gc?.continuous, run: E(rc), statesEvery5s: seen, hist: (await hist(tc)).slice(0, 6) });
  // I15 redo: merge a ticket in a blueprint
  const m1 = await mkT('C5', 'merge source x'); const m1b = await mkT('J15', 'merge source'), m2 = await mkT('I15X', 'merge target'); await waitIn(m1b);
  const mg = await api('POST', `/desk/tickets/${m2}/merge`, { source_ticket_ids: [m1b], ticket_ids: [m1b], cc_list_from: 'target' }); await sleep(5000);
  out('I15', { merge: E(mg), sourceState: (await bstate(m1b))?.activeStates || null, sourceHist: (await hist(m1b)).slice(0, 6), targetState: (await bstate(m2))?.blueprintName || null });
  // E2 / E4 / F5 / F7: one blueprint, four transitions
  const up = await api('POST', '/files', { app_key: 'desk', purpose: 'attachment', ownership_class: 'tenant_file', original_filename: 'qa-bp-e4.txt', declared_content_type: 'text/plain', declared_size_bytes: 12 });
  let fid = up.j?.data?.file_id; let upInfo = E(up);
  if (fid) { const put = await fetch(up.j.data.upload_url, { method: 'PUT', headers: { 'Content-Type': 'text/plain' }, body: 'QA BP E4 txt' }); const cf = await api('POST', `/files/${fid}/confirm`, { file_id: fid, size_bytes: 12 }); upInfo += ' put ' + put.status + ' confirm ' + E(cf); }
  const d = DEF('E2', [ST('Open'), ST('Escalated'), ST('On Hold'), ST('Closed', { isTerminal: true })], [
    TR('reply', 'Open', 'Escalated', { during: { deskItems: [{ kind: 'reply', mandatory: true }] } }),
    TR('attach', 'Escalated', 'On Hold', { during: { deskItems: [{ kind: 'attachment', mandatory: true }] } }),
    TR('hook', 'On Hold', 'Closed', { after: [{ kind: 'webhook', url: 'https://webhook.site/' + W + '/qa-bp-f5', verb: 'POST', body: '{"subject":"{{subject}}"}' }, { kind: 'customAction', customActionId: CA, inputs: {} }] })]);
  const be = await mkBp(d); const te = await mkT('E2', 'form items', { email: GMAIL }); await waitIn(te);
  const noReply = await runT(te, 'reply'); const withReply = await runT(te, 'reply', 'Open', { reply: { content: '<p>QA BP E2 required reply</p>', body_html: '<p>QA BP E2 required reply</p>', to: [GMAIL] } }); await sleep(5000);
  const outb = L((await api('GET', `/desk/tickets/${te}/replies`)).j?.data).filter(x => x.direction === 'outbound').map(x => x.subject + ' | ' + x.status);
  out('E2', { create: E(be.r), noReply: E(noReply), withReply: E(withReply), outbound: outb });
  const noFile = await runT(te, 'attach', 'Escalated'); const withFile = fid ? await runT(te, 'attach', 'Escalated', { attachment_ids: [fid] }) : null; await sleep(3000);
  out('E4', { upload: upInfo, noFile: E(noFile), withFile: withFile && E(withFile), state: (await bstate(te))?.activeStates });
  const rh = await runT(te, 'hook', 'On Hold'); await sleep(20000);
  out('F5_F7', { run: E(rh), webhookHits: await hook('qa-bp-f5'), customActionHits: await hook('qa-bp-ca'), hist: (await hist(te)).slice(0, 6) });
  // K12 / K13 (NDC-2788): warning at 1 min -> custom action, limit 2 min -> webhook
  const k = await mkBp(DEF('K12', [ST('Open', { slaMinutes: 2, slaPreExpiryMinutes: 1, slaClock: 'calendar', slaWarning: [{ kind: 'customAction', customActionId: CA, inputs: {} }], slaPreExpiryEscalation: [{ kind: 'customAction', customActionId: CA, inputs: {} }], slaEscalation: [{ kind: 'webhook', url: 'https://webhook.site/' + W + '/qa-bp-k12', verb: 'POST', body: '{"subject":"{{subject}}"}' }] }), ST('Closed', { isTerminal: true })], [TR('end', 'Open', 'Closed')]));
  const caBefore = (await hook('qa-bp-ca')).length; const tk = await mkT('K12'); const sk = await waitIn(tk);
  out('K12_K13_due', { create: E(k.r), warning_due_at: sk?.warning_due_at, escalation_due_at: sk?.escalation_due_at });
  await sleep(200000);
  out('K12_K13', { webhookAtLimit: await hook('qa-bp-k12'), customActionHitsSinceStart: (await hook('qa-bp-ca')).length - caBefore, hist: (await hist(tk)).slice(0, 8) });
  // H12 / M4: audit events about blueprints since the start of this batch
  const ev = L((await api('GET', '/audit/events?app_key=desk&limit=200')).j?.data).filter(x => x.occurred_at >= t0 || x.created_at >= t0);
  out('H12_M4', ev.filter(x => /blueprint/i.test(JSON.stringify(x))).slice(0, 8).map(x => (x.action || x.event_type || x.type) + ' | ' + String(x.summary || x.description || x.message || x.entity_name || '').slice(0, 100) + ' | ' + (x.entity_type || x.entity || '')));
  // N3: ids from another tenant (Anyware QA WF Dept R, Anyware owner)
  const n3 = await mkBp(DEF('N3', [ST('Open'), ST('Closed', { isTerminal: true })], [TR('x', 'Open', 'Closed', { before: { departmentOwners: [{ departmentId: '9a7e391c-be72-49e4-a1cf-763e5c88e23d', access: 'full', userIds: ['7017d261-36ee-4e2f-9e00-000000000000'], teamIds: [] }] }, after: [{ kind: 'customAction', customActionId: '579c6d6a-0000-0000-0000-000000000000', inputs: {} }] })]), false);
  out('N3', E(n3.r));
} catch (e) { out('ERROR', String(e.stack || e).slice(0, 500)); }
// M6: recycle bin restore + purge of one QA blueprint
try {
  const m6 = await mkBp(BASIC('M6'), false); const del = await api('DELETE', `/modules/${TK}/blueprints/${m6.id}`); made.bps = made.bps.filter(x => x !== m6.id); keep();
  const items = L((await api('GET', '/audit/recycle-bin/items?app_key=desk&limit=200')).j?.data); const hit = items.filter(x => x.entity_id === m6.id || x.record_id === m6.id || x.id === m6.id || JSON.stringify(x).includes(m6.id));
  const rs = hit.length === 1 ? await api('POST', '/audit/recycle-bin/restore', { ids: [hit[0].id] }) : null; await sleep(2000);
  const back = !!(await getBp(m6.id)); const del2 = await api('DELETE', `/modules/${TK}/blueprints/${m6.id}`);
  const items2 = L((await api('GET', '/audit/recycle-bin/items?app_key=desk&limit=200')).j?.data).filter(x => JSON.stringify(x).includes(m6.id));
  const pg = items2.length === 1 ? await api('POST', '/audit/recycle-bin/delete', { ids: [items2[0].id] }) : null;
  out('M6', { delete: E(del), inBin: hit.length, restore: rs && E(rs), restored: back, delete2: E(del2), purge: pg && (E(pg) + ' ' + JSON.stringify(pg.j?.data || {}).slice(0, 150)), binAfter: L((await api('GET', '/audit/recycle-bin/items?app_key=desk&limit=200')).j?.data).filter(x => JSON.stringify(x).includes(m6.id)).length });
} catch (e) { out('M6_ERROR', String(e).slice(0, 300)); }
out('cleanup', await cleanAll());
fs.writeFileSync('../a6/b2-out.json', JSON.stringify(R, null, 1)); log(JSON.stringify(R, null, 1));
