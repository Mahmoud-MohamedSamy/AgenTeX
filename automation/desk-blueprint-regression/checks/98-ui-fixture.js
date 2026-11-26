// Phase 3 fixture: kept on the tenant until the screen pass is done (ids in $RUN/out/ui-fixture.json; removed by 99-ui-clean.js).
const FX = { bps: {}, tickets: {}, other: [] };
const keepFx = () => fs.writeFileSync(RUN + '/out/ui-fixture.json', JSON.stringify(FX, null, 1));
const noTrack = async (def, active = true) => { const r = await api('POST', `/modules/${T}/blueprints`, { definition: def, isActive: active }); return r.j?.data?.id; };
const tk = async (tag, suffix, extra = {}) => { const id = await mkT(tag, suffix, extra); MADE.tickets = MADE.tickets.filter(x => x !== id); keep(); return id; };
// 1 main flow
const g = 'UI' + uid(); FX.tag = g;
FX.bps.flow = await noTrack(DEF(g, [ST('Open', { slaMinutes: 3, slaPreExpiryMinutes: 2, onReplyTransitionId: 'hold', onReplyThreads: 'public' }), ST('On Hold', { slaMinutes: 2880 }), ST('Escalated'), ST('Closed', { isTerminal: true })], [
  TR('go', 'Open', 'Escalated', { during: { deskItems: [{ kind: 'comment', mandatory: true }, { kind: 'reply', mandatory: false }], checklist: [{ id: 'k1', label: 'QA BP R check documents', mandatory: true }], requiredFields: [{ name: 'qa_ndc_tkt_pnr_no', required: true, datatype: { key: 'single_line' } }], messages: [{ id: 'm1', text: 'QA BP R read the refund policy first' }] }, after: [aNotify('QA BP R UI moved {{subject}}', { owner: true })] }),
  TR('hold', 'Open', 'On Hold'), TR('back', 'On Hold', 'Open'), TR('end', 'Escalated', 'Closed'),
  { ...TR('cancel', null, 'Closed'), isCommon: true, fromStateId: null },
  TR('approve', 'On Hold', 'Escalated', { during: { deskItems: [{ kind: 'approval', mandatory: true, approverUserIds: [U.B] }] } }),
], { dynamicOwners: true, description: 'QA BP R screen pass' }));
FX.tickets.open = await tk(g, 'open', { description: 'QA BP R UI open' }); await waitIn(FX.tickets.open); await api('POST', `/desk/tickets/${FX.tickets.open}/assign`, { owner_id: U.B });
FX.tickets.hold = await tk(g, 'on hold'); await waitIn(FX.tickets.hold); await runT(FX.tickets.hold, 'hold');
FX.tickets.esc = await tk(g, 'escalated'); await waitIn(FX.tickets.esc); await runT(FX.tickets.esc, 'go', 'Open', { fields: { qa_ndc_tkt_pnr_no: 'PNR-UI' }, checklist: { k1: true }, comment: { content: 'QA BP R UI comment' } });
FX.tickets.done = await tk(g, 'completed'); await waitIn(FX.tickets.done); await runT(FX.tickets.done, 'cancel');
FX.tickets.revoked = await tk(g, 'revoked'); await waitIn(FX.tickets.revoked); await api('PUT', `/modules/${T}/records/${FX.tickets.revoked}/blueprint/owners/go`, { userIds: [U.B], teamIds: [] }); await revoke1(FX.tickets.revoked);
FX.tickets.approval = await tk(g, 'approval'); await waitIn(FX.tickets.approval); await runT(FX.tickets.approval, 'hold'); await sleep(1500); await runT(FX.tickets.approval, 'approve', 'On Hold', { approval: { subject: 'QA BP R UI approval', approver_user_ids: [U.B] } });
// SLA policy so one ticket is overdue on both the department SLA and the state limit
const pol = await api('POST', '/desk/sla/policies', { department_id: DEPT, name: 'QA BP R SLA UI ' + g, description: null, is_active: true, triggers: { create: true, update: true, field_update: null, customer_reply: false, agent_response: false, private_thread: null, comment: null }, execute_only_with_account: false, resolution_from_created: true, targets: [{ name: 'QA BP R t UI', criteria: { conditions: [{ field_key: 'description', operator: 'contains', value: 'QA BP R UI both' }], pattern: null }, response: { value: 1, unit: 'minutes' }, resolution: { value: 2, unit: 'minutes' }, calendar_mode: 'calendar', business_hours_id: null, first_response_only: true, escalate_on_business_hours: false, escalations: { response: [], resolution: [] } }] });
FX.sla = pol.j?.data?.id; FX.tickets.both = await tk(g, 'both overdue', { description: 'QA BP R UI both' }); await waitIn(FX.tickets.both);
// 2 Arabic names + draft mark
const ar = ((await api('GET', '/desk/ticket-statuses')).j?.data?.statuses || []).find(s => /QA BP R عربي/.test(s.value));
const ga = 'UIAR' + uid(); FX.bps.arabic = await noTrack({ ...DEF(ga, [ST('Open'), ...(ar ? [ST(ar.value)] : [ST('Escalated')]), ST('Closed', { isTerminal: true })], [{ ...TR('go', 'Open', ar ? ar.value : 'Escalated'), name: 'نقل إلى المراجعة' }, TR('end', ar ? ar.value : 'Escalated', 'Closed')]), name: 'QA BP R ' + ga + ' مسار الاسترداد' });
FX.tickets.arabic = await tk(ga, 'arabic'); await waitIn(FX.tickets.arabic);
const gd = 'UIDR' + uid(); FX.bps.draft = await noTrack(BASIC(gd)); const gb = await getBp(FX.bps.draft); await api('PUT', `/modules/${T}/blueprints/${FX.bps.draft}/draft`, { definition: { ...gb.definition, description: 'QA BP R unpublished draft' }, revision: gb.revision });
// 3 big blueprint (inactive) for designer layout / load time
const sts = ((await api('GET', '/desk/ticket-statuses')).j?.data?.statuses || []).map(s => s.value).filter(v => !/QA BP R |^open$/.test(v)).slice(0, 30);
const trs = []; for (let i = 0; i < sts.length - 1; i++) trs.push(TR('n' + i, sts[i], sts[i + 1])); let k = 0; for (let i = 0; i < sts.length - 2 && trs.length < 80; i++) for (let j = i + 2; j < Math.min(sts.length, i + 5) && trs.length < 80; j++) trs.push(TR('x' + (k++), sts[i], sts[j]));
FX.bps.big = await noTrack(DEF('UIBIG' + uid(), sts.map((v, i) => ST(v, i === sts.length - 1 ? { isTerminal: true } : {})), trs), false);
for (const id of Object.values(FX.tickets)) { if (id !== FX.tickets.open) await api('POST', `/desk/tickets/${id}/assign`, { owner_id: U.B }); }
// numbers for the UI script
for (const [k2, id] of Object.entries(FX.tickets)) FX[k2 + 'No'] = (await flds(id)).ticket_number;
keepFx();
return { FX: Object.fromEntries(Object.entries(FX).filter(([k2]) => /No$|tag|sla/.test(k2))), bps: FX.bps };
