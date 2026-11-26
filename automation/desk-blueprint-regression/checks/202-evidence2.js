// Fresh repros for the 7 remaining findings (Customer Support, guard "QA BP R EW…"). Tickets kept for screenshots; ids in $RUN/evidence/plane-evidence2.json.
const CSD = '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158';
const EV = {}; const save = () => fs.writeFileSync(RUN + '/evidence/plane-evidence2.json', JSON.stringify(EV, null, 1));
const sh = r => ({ status: r.s, body: r.j ? (r.j.error ? { error: r.j.error } : { data: JS(r.j.data).slice(0, 240) }) : r.t.slice(0, 200) });
const mk = async (tag, states, trs, x = {}, active = true) => mkBp({ ...DEF(tag, states, trs, x), departmentId: CSD }, active);
const tk = async (tag, s, extra = {}) => { const id = await mkT(tag, s, { department: CSD, contact_id: undefined, ...extra }); return id; };
EV.keep = [];
// EN-13 created in a middle status
{ const g = 'EW1' + uid(); await mk(g, S3(), [TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')]);
  const t = await tk(g, 'created as Escalated', { status: 'Escalated' }); const s = await waitIn(t); await api('POST', `/desk/tickets/${t}/assign`, { owner_id: U.B }); await sleep(2000);
  const h = await hist(t); const statusLines = h.filter(x => x.action === 'ticket.status_changed').map(x => (x.old_value || 'blank') + '→' + x.new_value);
  EV.en13 = { ticket: t, no: (await flds(t)).ticket_number, createdWith: 'Escalated', state: st(s), status: await statusOf(t), statusHistoryLines: statusLines };
  EV.keep.push(t); MADE.tickets = MADE.tickets.filter(x => x !== t); keep(); save(); }
// UX-01 Arabic progress bar: ticket in a blueprint for the Arabic screenshot
{ const g = 'EW2' + uid(); await mk(g, S3(), [TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')]);
  const t = await tk(g, 'arabic view'); await waitIn(t); await api('POST', `/desk/tickets/${t}/assign`, { owner_id: U.B });
  EV.ux01 = { ticket: t, no: (await flds(t)).ticket_number }; EV.keep.push(t); MADE.tickets = MADE.tickets.filter(x => x !== t); keep(); save(); }
// TF-09 custom action order (temporary source + action to our webhook.site inbox)
{ const P = '/' + WEBHOOK + '/qa-bp-ew-echo/{ref}';
  const spec = JSON.stringify({ openapi: '3.0.0', info: { title: 'QA BP R EW echo', version: '1.0' }, servers: [{ url: 'https://webhook.site' }], paths: { [P]: { post: { operationId: 'qaBpEwEcho', summary: 'QA BP EW echo', parameters: [{ name: 'ref', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'ok' } } } } } });
  const s = await api('POST', '/workflow/custom-actions/sources', { name: 'QA BP R EW echo API', baseUrl: 'https://webhook.site', specFormat: 'openapi3', origin: 'paste', rawSpec: spec }); const sid = s.j?.data?.id;
  const a = sid ? await api('POST', '/workflow/custom-actions', { sourceId: sid, name: 'QA BP R EW echo', description: 'QA', method: 'POST', path: P, targetApps: ['desk'], usageGuide: '', inputBindings: [{ name: 'ref', location: 'path', required: true, handling: 'runtime' }], dependencies: [], errorMappings: [], outputMappings: [] }) : { s: 0 };
  const aid = a.j?.data?.id; if (aid) await api('POST', `/workflow/custom-actions/${aid}/publish`);
  EV.tf09 = { source: sid, action: aid };
  const g = 'EW3' + uid(); const since = new Date(Date.now() - 3000);
  await mk(g, S3(), [TR('go', 'Open', 'Escalated', { after: [aHook('ew-order-1-' + g), aCA('ew-' + g, aid), aHook('ew-order-2-' + g)] }), TR('end', 'Escalated', 'Closed')]);
  const t = await tk(g, 'order'); await waitIn(t); const t0 = new Date(); const r = await runT(t, 'go'); await sleep(25000);
  const got = (await hooks(since)).filter(x => x.url.includes(g)).map(x => ({ step: /order-1/.test(x.url) ? '1 Webhook 1' : /order-2/.test(x.url) ? '3 Webhook 2' : '2 Custom action', at: x.at })).sort((a, b) => a.at.localeCompare(b.at));
  Object.assign(EV.tf09, { run: sh(r), ranAt: t0.toISOString(), arrivals: got });
  const d1 = aid ? await api('DELETE', `/workflow/custom-actions/${aid}`) : null; save(); }
// ST-05 / ST-07 unknown business-hours set + unknown template
{ const g = 'EW4' + uid();
  const a = await mk(g, [ST('Open', { slaMinutes: 120, slaClock: 'business', slaBusinessHoursId: crypto.randomUUID() }), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')], {}, false);
  const b = await mk(g + 't', [ST('Open', { slaMinutes: 120, slaEscalationLevels: [{ id: 'level-x', timing: 'at', offsetMinutes: 0, recipients: { userIds: [], teamIds: [], ticketOwner: true, transitionOwners: false }, templateId: crypto.randomUUID() }] }), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')], {}, false);
  const c = await mk(g + 'o', [ST('Open'), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('go', 'Open', 'Escalated', { before: { allowedUserIds: [crypto.randomUUID()] } }), TR('end', 'Escalated', 'Closed')], {}, false);
  EV.st05 = { unknownBusinessHours: sh(a.r), unknownTemplate: sh(b.r), controlUnknownOwner: sh(c.r), bp1: a.id, bp2: b.id }; save(); }
// CV-06 / API-01 empty transition name + 2,000-item checklist
{ const g = 'EW5' + uid();
  const a = await mk(g, S3(), [{ ...TR('go', 'Open', 'Escalated'), name: '' }, TR('end', 'Escalated', 'Closed')], {}, false);
  const b = await mk(g + 'c', S3(), [TR('go', 'Open', 'Escalated', { during: { checklist: Array.from({ length: 2000 }, (_, i) => ({ id: 'k' + i, label: 'QA ' + i, mandatory: false })) } }), TR('end', 'Escalated', 'Closed')], {}, false);
  const c = await mk(g + 'x', S3(), [TR('go', 'Open', 'Escalated', { after: [{ kind: 'launchRocket' }] }), TR('end', 'Escalated', 'Closed')], {}, false);
  EV.cv06 = { emptyName: sh(a.r), checklist2000: sh(b.r), controlUnknownAction: sh(c.r), bp1: a.id }; save(); }
// TF-X1 unknown assignee mode
{ const g = 'EW6' + uid(); const m = await mk(g, S3(), [TR('go', 'Open', 'Escalated', { after: [aTask('QA BP R EW6 task ' + g, 'specific', U.A)] }), TR('end', 'Escalated', 'Closed')]);
  const t = await tk(g, 'task mode'); await waitIn(t); await api('POST', `/desk/tickets/${t}/assign`, { owner_id: U.B }); await sleep(2000); const r = await runT(t, 'go'); await sleep(8000);
  const mods = await modules(); const TASKS = (mods.find(x => (x.key || x.moduleKey || x.api_name) === 'desk_tasks') || {}).id;
  const tasks = arr((await api('GET', `/modules/${TASKS}/records?page_size=50&search=${encodeURIComponent('QA BP R EW6')}`)).j?.data).map(x => Object.fromEntries((x.data || []).map(y => [y.field, fv(y.value)]))).filter(x => String(x.subject || '').includes(g));
  EV.tfx1 = { save: sh(m.r), storedMode: (await getBp(m.id)).definition.transitions[0].after.actions[0].assigneeMode, run: sh(r), taskOwner: tasks[0]?.owner, ticketOwner: U.B, intendedUser: U.A, taskFound: tasks.length }; save(); }
// RS-01 duplicate owner lines: in a blueprint and outside any blueprint
{ const g = 'EW7' + uid(); await mk(g, S3(), [TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')]);
  const a = await tk(g, 'in blueprint'); await waitIn(a); await api('POST', `/desk/tickets/${a}/assign`, { owner_id: U.B });
  const b = await tk('EW7OUT' + uid(), 'no blueprint'); await sleep(3000); await api('POST', `/desk/tickets/${b}/assign`, { owner_id: U.B }); await sleep(4000);
  const own = async t => (await hist(t)).filter(x => /owner/.test(x.action + (x.field_key || ''))).map(x => x.action + ':' + (x.field_key || '') + ' ' + (x.old_value || 'blank') + '→' + String(x.new_value).slice(0, 8));
  EV.rs01 = { inBlueprint: { ticket: a, no: (await flds(a)).ticket_number, ownerLines: await own(a) }, noBlueprint: { ticket: b, no: (await flds(b)).ticket_number, inBlueprint: !!(await bstate(b)), ownerLines: await own(b) } };
  EV.keep.push(a, b); MADE.tickets = MADE.tickets.filter(x => ![a, b].includes(x)); keep(); save(); }
return { en13: EV.en13, tf09: EV.tf09?.arrivals, st05: [EV.st05.unknownBusinessHours.status, EV.st05.unknownTemplate.status, EV.st05.controlUnknownOwner.status], cv06: [EV.cv06.emptyName.status, EV.cv06.checklist2000.status, EV.cv06.controlUnknownAction.status], tfx1: { mode: EV.tfx1.storedMode, taskOwnerIsTicketOwner: EV.tfx1.taskOwner === U.B, found: EV.tfx1.taskFound }, rs01: EV.rs01 };
