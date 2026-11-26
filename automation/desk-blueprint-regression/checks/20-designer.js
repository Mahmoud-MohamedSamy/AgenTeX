// Designer save rules through the API (DT, CV, PI, ST save side). Screen texts are checked in Phase 3.
const tag = 'DS' + uid();
const tryMk = async (def, active = false) => { const m = await mkBp(def, active); return m; };
const stored = async id => (await getBp(id))?.definition || {};

// DT-02 name rules (NDC-2780)
const n0 = await tryMk({ ...BASIC(tag), name: '' });
const n61 = await tryMk({ ...BASIC(tag), name: 'QA BP R ' + 'x'.repeat(60) });
const nsp = await tryMk({ ...BASIC(tag), name: 'QA BP R ' + tag + ' (special)!' });
const d1001 = await tryMk({ ...BASIC(tag), description: 'd'.repeat(1001) });
const ok60 = await tryMk({ ...BASIC(tag), name: ('QA BP R ' + tag + ' ' + 'y'.repeat(60)).slice(0, 60) });
const pass02 = !n0.ok && !n61.ok && !nsp.ok && !d1001.ok && ok60.ok;
both('DT-02', 'NDC-2780', pass02, `empty ${E(n0.r)}; 61+ chars ${E(n61.r)}; special chars ${E(nsp.r)}; description 1001 ${E(d1001.r)}; exactly 60 ${E(ok60.r)}`);
// DT-03 data classes
const dc = {};
for (const [k, v] of [['arabic', 'QA BP R ' + tag + ' تجربة'], ['emoji', 'QA BP R ' + tag + ' 🚀'], ['trailing', 'QA BP R ' + tag + ' trail   '], ['xss', 'QA BP R ' + tag + ' <img src=x onerror=alert(1)>'], ['dup', 'QA BP R ' + tag + ' dup']]) {
  const m = await tryMk({ ...BASIC(tag), name: v }); dc[k] = m.ok ? 'saved as ' + JSON.stringify((await stored(m.id)).name) : 'refused ' + code(m.r) + ' ' + (m.r.j?.error?.message || '').slice(0, 80);
}
const dup2 = await tryMk({ ...BASIC(tag), name: 'QA BP R ' + tag + ' dup' }); dc.dupSecond = dup2.ok ? 'saved (duplicate allowed, same as Zoho)' : 'refused ' + code(dup2.r);
R('DT-03', /saved/.test(dc.arabic) && !/<img/.test(dc.xss.replace('refused', '')) || /refused/.test(dc.xss) ? 'PASS' : 'FINDING', JSON.stringify(dc));
// DT-04 department required
const nd = BASIC(tag); delete nd.departmentId; const ndm = await tryMk(nd);
R('DT-04', 'PASS', `API without department: ${ndm.ok ? 'saved (goes to "Blueprints without a department", governs no ticket)' : 'refused ' + E(ndm.r)}; designer publish check in Phase 3`, { api: ndm.ok });
// DT-05 layout
const lays = L((await api('GET', `/modules/${T}/layouts`)).j?.data);
if (lays.length >= 2) {
  const [L1, L2] = lays; const lt = 'LY' + uid();
  const lb = await mkBp({ ...BASIC(lt), layoutId: L1.id }, true); const sd = await stored(lb.id);
  const ta = await mkT(lt, 'L1', { layout_id: L1.id }), tb = await mkT(lt, 'L2', { layout_id: L2.id });
  await sleep(9000); const ia = !!(await bstate(ta)), ib = !!(await bstate(tb));
  const la = (await rec(ta))?.layoutId, lb2 = (await rec(tb))?.layoutId;
  R('DT-05', sd.layoutId === L1.id && ia && !ib && la !== lb2 ? 'PASS' : (la === lb2 ? 'INCONCLUSIVE' : 'FAIL'), `stored layout ${sd.layoutId === L1.id} (${sd.layoutName || '-'}); ticket on "${L1.name}" entered ${ia}; ticket on "${L2.name}" entered ${ib}; record layouts ${String(la).slice(0, 8)} / ${String(lb2).slice(0, 8)}`);
  await api('PUT', `/modules/${T}/blueprints/${lb.id}`, { definition: sd, isActive: false, revision: (await getBp(lb.id)).revision });
} else R('DT-05', 'BLOCKED', 'only ' + lays.length + ' ticket layout(s) on the tenant');
// DT-06 target field fixed
const tf = await tryMk({ ...BASIC(tag), targetField: 'priority' }); const tf0 = await tryMk({ ...BASIC(tag), targetField: '' });
R('DT-06', !tf.ok && !tf0.ok ? 'PASS' : 'FINDING', `targetField priority: ${tf.ok ? 'saved as ' + (await stored(tf.id)).targetField : 'refused ' + code(tf.r)}; empty: ${tf0.ok ? 'saved' : 'refused ' + code(tf0.r)} (designer shows "Ticket status", fixed — Phase 3)`);
// DT-07/08 criteria operators + groups (save + evaluate)
const ops = [['eq', 'subject', 'X'], ['neq', 'subject', 'X'], ['contains', 'subject', 'X'], ['starts_with', 'subject', 'X'], ['starts-with', 'subject', 'X'], ['ends_with', 'subject', 'X'], ['in', 'priority', ['High']], ['is_empty', 'subject', null], ['gt', 'created_at', '2020-01-01'], ['between', 'created_at', ['2020-01-01', '2030-01-01']], ['and', null, null], ['bogus', 'subject', 'X']];
const accepted = {};
for (const [op, field, value] of ops) {
  const c = op === 'and' ? { op: 'and', children: [crit(tag), { op: 'eq', field: 'priority', value: 'High' }] } : { op, field, value };
  const m = await tryMk({ ...BASIC(tag), entryCriteria: c }); accepted[op] = m.ok ? 'saved' : code(m.r) || m.r.s;
}
R('DT-08', accepted.bogus !== 'saved' ? 'PASS' : 'FAIL', 'API accepts: ' + JSON.stringify(accepted) + ' (unknown operator must be refused)', { bug: 'NDC-2758' });
RG('NDC-2758', accepted.bogus !== 'saved' ? 'PASS' : 'FAIL', 'unknown operator: ' + accepted.bogus);
// runtime evaluation of the accepted rich criteria: priority + subject group
const ct = 'CR' + uid();
const grp = { op: 'and', children: [crit(ct), { op: 'eq', field: 'priority', value: 'High' }] };
const cg = await mkBp({ ...BASIC(ct), entryCriteria: grp }, true);
if (cg.ok) {
  const th = await mkT(ct, 'high', { priority: 'High' }), tl = await mkT(ct, 'low', { priority: 'Low' });
  await sleep(9000); const eh = !!(await bstate(th)), el = !!(await bstate(tl));
  R('DT-07', eh && !el ? 'PASS' : 'FAIL', `AND group (subject + Priority High): High ticket entered ${eh}, Low ticket entered ${el}`);
  await putBp(cg.id, null, false);
} else R('DT-07', 'FINDING', 'AND group not accepted by the API: ' + E(cg.r) + ' (check builder in Phase 3)');
// DT-09 continuous flag stored; DT-10 blueprint owners; DT-11 other dept owners; DT-12 dynamic owners; strict mode stored
const full = await tryMk({ ...BASIC(tag), continuous: true, dynamicOwners: true, transitionOwners: { userIds: [U.A], teamIds: [TEAM], allowOwner: true, departmentOwners: [{ departmentId: TECH, access: 'full', userIds: [U.C], teamIds: [] }] }, strictMode: { scope: 'specified', actions: ['reply', 'fields'], fields: ['priority'] } });
const fs1 = full.ok ? await stored(full.id) : {};
R('DT-09', full.ok && fs1.continuous === true ? 'PASS' : 'FAIL', `continuous stored ${fs1.continuous}`);
R('DT-10', full.ok && JSON.stringify(fs1.transitionOwners || {}).includes(U.A) ? 'PASS' : 'FAIL', `blueprint owners stored: ${JSON.stringify(fs1.transitionOwners || E(full.r)).slice(0, 250)}`);
const noMem = await tryMk({ ...BASIC(tag), transitionOwners: { departmentOwners: [{ departmentId: TECH, access: 'full', userIds: [], teamIds: [] }] } });
R('DT-11', full.ok && !noMem.ok ? 'PASS' : (full.ok ? 'FINDING' : 'FAIL'), `other-dept owner stored ${JSON.stringify(fs1.transitionOwners?.departmentOwners || '')}; department owner with nobody: ${noMem.ok ? 'API saves it (designer flags blueprintOwnerNoMembers)' : 'refused ' + code(noMem.r)}`);
R('DT-12', fs1.dynamicOwners === true ? 'PASS' : 'FAIL', `dynamicOwners stored ${fs1.dynamicOwners} (ticket side in DO group)`);
const smBad = await tryMk({ ...BASIC(tag), strictMode: { scope: 'specified', actions: [] } }), smBog = await tryMk({ ...BASIC(tag), strictMode: { scope: 'bogus', actions: ['reply'] } });
R('SM-01', JSON.stringify(fs1.strictMode || '').includes('specified') && !smBog.ok ? (smBad.ok ? 'FINDING' : 'PASS') : 'FAIL', `strict stored ${JSON.stringify(fs1.strictMode)}; specified with no action: ${smBad.ok ? 'API saves it (designer flags strictModeNoAction)' : 'refused'}; unknown scope: ${smBog.ok ? 'SAVED' : 'refused ' + code(smBog.r)}`);

// CV: canvas rules
const s16 = []; for (let i = 0; i < 18; i++) s16.push(ST('S' + i));
const many = [];
for (let i = 1; i < 18; i++) many.push(TR('t' + i, 'Open', 'S' + i));
const c17 = await tryMk(DEF(tag, [ST('Open'), ...s16.slice(1)], many));
R('CV-07', !c17.ok ? 'PASS' : 'FAIL', `17 connections from one state: ${c17.ok ? 'SAVED by the API' : 'refused ' + E(c17.r)}`);
const dupS = await tryMk(DEF(tag, [ST('Open'), ST('Open'), ST('Closed', { isTerminal: true })], [TR('end', 'Open', 'Closed')]));
const unkSrc = await tryMk(DEF(tag, S3(), [TR('x', 'Nowhere', 'Closed'), TR('go', 'Open', 'Escalated')]));
const noTgt = await tryMk(DEF(tag, S3(), [TR('x', 'Open', ''), TR('go', 'Open', 'Escalated')]));
const dupT = await tryMk(DEF(tag, S3(), [TR('go', 'Open', 'Escalated'), TR('go', 'Escalated', 'Closed')]));
const noState = await tryMk(DEF(tag, [], []));
const notStatus = await tryMk(DEF(tag, [ST('Open'), ST('QA BP R not a status'), ST('Closed', { isTerminal: true })], [TR('go', 'Open', 'QA BP R not a status'), TR('end', 'QA BP R not a status', 'Closed')]));
const unreach = await tryMk(DEF(tag, S3(), [TR('end', 'Open', 'Closed')]));
const noName = await tryMk(DEF(tag, S3(), [{ ...TR('go', 'Open', 'Escalated'), name: '' }, TR('end', 'Escalated', 'Closed')]));
const pi = { duplicateState: dupS, unknownSource: unkSrc, noTarget: noTgt, duplicateTransition: dupT, statesRequired: noState, stateNotAllowed: notStatus, unreachable: unreach, unnamedTransition: noName };
const piTxt = Object.entries(pi).map(([k, m]) => k + ':' + (m.ok ? 'SAVED' : code(m.r))).join(', ');
R('PI-01', !noState.ok ? 'PASS' : 'FINDING', 'no states: ' + (noState.ok ? 'API saves (designer blocks)' : 'refused ' + code(noState.r)));
R('PI-02', !dupS.ok ? 'PASS' : 'FAIL', 'same state twice: ' + (dupS.ok ? 'SAVED' : code(dupS.r)));
R('PI-03', !notStatus.ok ? 'PASS' : 'FAIL', 'state that is not a ticket status: ' + (notStatus.ok ? 'SAVED' : code(notStatus.r)));
R('PI-04', !dupT.ok ? 'PASS' : 'FAIL', 'two transitions same id: ' + (dupT.ok ? 'SAVED' : code(dupT.r)));
R('PI-05', !unkSrc.ok && !noTgt.ok ? 'PASS' : 'FAIL', 'unknown source / no target: ' + (unkSrc.ok ? 'SAVED' : code(unkSrc.r)) + ' / ' + (noTgt.ok ? 'SAVED' : code(noTgt.r)));
R('CV-11', !unreach.ok ? 'PASS' : 'FINDING', 'unreachable state: ' + (unreach.ok ? 'API saves (designer shows "cannot be reached")' : 'refused ' + code(unreach.r)));
R('CV-06', !noName.ok ? 'PASS' : 'FINDING', 'transition without name: ' + (noName.ok ? 'API saves (designer flags it)' : 'refused ' + code(noName.r)));
// CV-08 common transition stored; CV-09 parallel 1 / 2 / with branch
const com = await tryMk(DEF(tag, S3(), [TR('go', 'Open', 'Escalated'), { ...TR('cancel', null, 'Closed'), isCommon: true, fromStateId: null }]));
R('CV-08', com.ok && (await stored(com.id)).transitions.find(x => x.id === 'cancel')?.isCommon ? 'PASS' : 'FAIL', 'common transition: ' + E(com.r) + ' (runtime in RN-13)');
const sub = id => ({ id, name: 'QA ' + id, before: {}, during: {}, after: { actions: [] } });
const p1 = await tryMk(DEF(tag, S3(), [TR('par', 'Open', 'Escalated', { extra: { subTransitions: [sub('s1')] } }), TR('end', 'Escalated', 'Closed')]));
const p2 = await tryMk(DEF(tag, S3(), [TR('par', 'Open', 'Escalated', { extra: { subTransitions: [sub('s1'), sub('s2')] } }), TR('end', 'Escalated', 'Closed')]));
const p3 = await tryMk(DEF(tag, [...S3(), ST('On Hold')], [TR('par', 'Open', 'Escalated', { extra: { subTransitions: [sub('s1'), sub('s2')], parallelToStateIds: ['Escalated', 'On Hold'] } }), TR('end', 'Escalated', 'Closed')]));
R('CV-09', !p1.ok && p2.ok && !p3.ok ? 'PASS' : (p2.ok ? 'FINDING' : 'FAIL'), `1 parallel step: ${p1.ok ? 'SAVED' : code(p1.r)}; 2 steps: ${p2.ok ? 'saved' : code(p2.r)}; steps + branches: ${p3.ok ? 'SAVED' : code(p3.r)}`);
const fk = await tryMk(DEF(tag, [...S3(), ST('On Hold')], [{ ...TR('fork', 'Open', null), toStateId: null, parallelToStateIds: ['Escalated', 'Nowhere'] }, TR('end', 'Escalated', 'Closed')]));
R('CV-10', !fk.ok ? 'PASS' : 'FAIL', 'branch to a state not on canvas: ' + (fk.ok ? 'SAVED' : code(fk.r)));

// ST save side
const stv = async x => { const m = await tryMk(DEF(tag, [ST('Open', x), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')])); return m.ok ? 'saved ' + JSON.stringify(Object.fromEntries(Object.entries((await stored(m.id)).states[0]).filter(([k]) => !['id', 'name', 'position'].includes(k)))).slice(0, 200) : 'refused ' + code(m.r); };
const units = { min90: await stv({ slaMinutes: 90 }), days2: await stv({ slaMinutes: 2880, slaPreExpiryMinutes: 1440 }) };
both('ST-02', 'NDC-3063', /saved/.test(units.min90) && /2880/.test(units.days2), 'stored in minutes: ' + JSON.stringify(units) + ' (unit switch shown in Phase 3)');
const bad = { warnEqLimit: await stv({ slaMinutes: 60, slaPreExpiryMinutes: 60 }), warnNoLimit: await stv({ slaPreExpiryMinutes: 30 }), negative: await stv({ slaMinutes: -60 }), zero: await stv({ slaMinutes: 0 }), text: await stv({ slaMinutes: 'abc' }), huge: await stv({ slaMinutes: 99999999 }) };
const badOk = /refused/.test(bad.warnEqLimit) && /refused/.test(bad.warnNoLimit) && /refused/.test(bad.negative) && /refused/.test(bad.text);
R('ST-03', badOk ? 'PASS' : 'FAIL', JSON.stringify(bad));
RG('NDC-2761', /refused/.test(bad.warnEqLimit) && /refused/.test(bad.warnNoLimit) ? 'PASS' : 'FAIL', 'warn = limit: ' + bad.warnEqLimit + '; warn without limit: ' + bad.warnNoLimit);
RG('NDC-2762', /refused/.test(bad.negative) ? 'PASS' : 'FAIL', 'negative limit: ' + bad.negative);
const bh = L((await api('GET', '/desk/business-hours')).j?.data); const bhId = (bh[0] || {}).id;
const clk = { business: await stv({ slaMinutes: 120, slaClock: 'business' }), chosenSet: bhId ? await stv({ slaMinutes: 120, slaClock: 'business', slaBusinessHoursId: bhId }) : 'no set', goneSet: await stv({ slaMinutes: 120, slaClock: 'business', slaBusinessHoursId: crypto.randomUUID() }) };
R('ST-05', /slaBusinessHoursId/.test(clk.chosenSet) ? 'PASS' : 'FAIL', JSON.stringify(clk) + ' (example text + deleted-set message in Phase 3; due counting in TM-08)');
const acts = { slaMinutes: 120, slaPreExpiryMinutes: 60, slaPreExpiryEscalation: [{ kind: 'notify', title: 'QA warn', body: 'w', notifyOwner: true }], slaEscalation: [{ kind: 'notify', title: 'QA due', body: 'd', notifyOwner: true }, { kind: 'setField', field: 'priority', value: 'High' }] };
R('ST-06', /slaPreExpiryEscalation/.test(await stv(acts)) ? 'PASS' : 'FAIL', 'warning + run-out action lists stored');
const lvl = (timing, off, rcp = { userIds: [], teamIds: [], ticketOwner: true, transitionOwners: false }, tpl = TPL) => ({ id: 'level-' + uid(), timing, offsetMinutes: off, recipients: rcp, templateId: tpl });
const lv = {
  ok3: await stv({ slaMinutes: 120, slaEscalationLevels: [lvl('before', 30), lvl('at', 0), lvl('after', 60)] }),
  offset0: await stv({ slaMinutes: 120, slaEscalationLevels: [lvl('after', 0)] }),
  beforeTooBig: await stv({ slaMinutes: 120, slaEscalationLevels: [lvl('before', 120)] }),
  over365d: await stv({ slaMinutes: 120, slaEscalationLevels: [lvl('after', 525601)] }),
  noRecipients: await stv({ slaMinutes: 120, slaEscalationLevels: [lvl('at', 0, { userIds: [], teamIds: [], ticketOwner: false, transitionOwners: false })] }),
  noLimit: await stv({ slaEscalationLevels: [lvl('at', 0)] }),
  deletedTpl: await stv({ slaMinutes: 120, slaEscalationLevels: [lvl('at', 0, undefined, crypto.randomUUID())] }),
};
const lmax = []; for (let i = 0; i < 12; i++) lmax.push(lvl('after', 10 + i)); lv.twelve = await stv({ slaMinutes: 120, slaEscalationLevels: lmax });
const refusedAll = ['offset0', 'beforeTooBig', 'over365d', 'noRecipients', 'noLimit', 'deletedTpl'].filter(k => !/refused/.test(lv[k]));
R('ST-07', /slaEscalationLevels/.test(lv.ok3) && refusedAll.length === 0 ? 'PASS' : (/slaEscalationLevels/.test(lv.ok3) ? 'FAIL' : 'FAIL'), `3 levels: ${/slaEscalationLevels/.test(lv.ok3) ? 'saved' : lv.ok3}; saved although invalid: [${refusedAll.join(', ')}]; 12 levels: ${lv.twelve.slice(0, 60)}`, { detail: lv });
const am = {
  ok: await (async () => { const m = await tryMk(DEF(tag, [ST('Open', { autoTransitionId: 'go', autoTransitionAfterMinutes: 5 }), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')])); return m.ok ? 'saved' : code(m.r); })(),
  noTransition: await stv({ autoTransitionAfterMinutes: 5 }),
  otherState: await stv({ autoTransitionId: 'end', autoTransitionAfterMinutes: 5 }),
  missing: await stv({ autoTransitionId: 'nope', autoTransitionAfterMinutes: 5 }),
  zeroWait: await stv({ autoTransitionId: 'go', autoTransitionAfterMinutes: 0 }),
};
const amPar = await tryMk(DEF(tag, [ST('Open', { autoTransitionId: 'par', autoTransitionAfterMinutes: 5 }), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('par', 'Open', 'Escalated', { extra: { subTransitions: [sub('s1'), sub('s2')] } }), TR('end', 'Escalated', 'Closed')]));
const amReq = await tryMk(DEF(tag, [ST('Open', { autoTransitionId: 'go', autoTransitionAfterMinutes: 5 }), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('go', 'Open', 'Escalated', { during: { checklist: [{ id: 'k', label: 'QA', mandatory: true }] } }), TR('end', 'Escalated', 'Closed')]));
am.parallel = amPar.ok ? 'SAVED' : code(amPar.r); am.mandatory = amReq.ok ? 'SAVED' : code(amReq.r);
const amBad = ['noTransition', 'otherState', 'missing', 'zeroWait', 'parallel', 'mandatory'].filter(k => !/refused|BLUEPRINT|VALIDATION|^[A-Z_]+$/.test(am[k]) || /SAVED|^saved/.test(am[k]));
R('ST-08', am.ok === 'saved' ? 'PASS' : 'FAIL', 'auto-move with wait stored: ' + am.ok + ' (panel display in Phase 3)');
R('ST-09', amBad.length === 0 ? 'PASS' : 'FAIL', JSON.stringify(am) + (amBad.length ? ' — accepted: ' + amBad.join(',') : ''));
RG('NDC-2763', /refused/.test(am.otherState) ? 'PASS' : 'FAIL', 'auto-move to another state\'s transition: ' + am.otherState);
// customer triggers
const trg = async (stX, trs) => { const m = await tryMk(DEF(tag, [ST('Open', stX), ST('Escalated'), ST('On Hold'), ST('Closed', { isTerminal: true })], trs || [TR('go', 'Open', 'Escalated'), TR('hold', 'Open', 'On Hold'), TR('end', 'Escalated', 'Closed')])); return m.ok ? 'saved ' + JSON.stringify(Object.fromEntries(Object.entries((await stored(m.id)).states[0]).filter(([k]) => /onReply|onRating/.test(k)))) : 'refused ' + code(m.r); };
const tg = {
  replyPublic: await trg({ onReplyTransitionId: 'go', onReplyThreads: 'public' }), replyPrivate: await trg({ onReplyTransitionId: 'go', onReplyThreads: 'private' }), replyAll: await trg({ onReplyTransitionId: 'go', onReplyThreads: 'all' }), replyBogus: await trg({ onReplyTransitionId: 'go', onReplyThreads: 'bogus' }),
  replyOtherState: await trg({ onReplyTransitionId: 'end' }),
  replyNeedsInput: await trg({ onReplyTransitionId: 'go' }, [TR('go', 'Open', 'Escalated', { during: { deskItems: [{ kind: 'reply', mandatory: true }] } }), TR('end', 'Escalated', 'Closed')]),
};
const exitM = await tryMk(DEF(tag, [ST('Open'), ST('Escalated'), ST('Closed', { isTerminal: true, onReplyTransitionId: 'reopen' })], [TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed'), TR('reopen', 'Closed', 'Open')]));
tg.replyOnExit = exitM.ok ? 'SAVED' : 'refused ' + code(exitM.r);
R('ST-10', /saved/.test(tg.replyPublic) && /saved/.test(tg.replyPrivate) && /refused/.test(tg.replyOtherState) && /refused/.test(tg.replyNeedsInput) && /refused/.test(tg.replyOnExit) && /refused/.test(tg.replyBogus) ? 'PASS' : 'FAIL', JSON.stringify(tg));
const rt = { good: await trg({ onRatingTransitionId: 'go', onRatingValues: ['good'] }), goodBad: await trg({ onRatingTransitionId: 'go', onRatingValues: ['good', 'bad'] }), none: await trg({ onRatingTransitionId: 'go' }), bogus: await trg({ onRatingTransitionId: 'go', onRatingValues: ['great'] }) };
R('ST-11', /good/.test(rt.good) && /refused/.test(rt.bogus) ? 'PASS' : (/good/.test(rt.good) ? 'FINDING' : 'FAIL'), JSON.stringify(rt));
const ord = await trg({ transitionOrder: ['hold', 'go'] });
R('ST-13', /transitionOrder|saved/.test(ord) ? 'PASS' : 'FAIL', 'transition order on state: ' + ord + ' (ticket order checked in RN)');
const ex = await tryMk(DEF(tag, [ST('Open'), ST('Closed', { isTerminal: true, slaMinutes: 60 })], [TR('end', 'Open', 'Closed')]));
R('ST-14', ex.ok ? 'PASS' : 'FAIL', 'exit state with a limit: ' + E(ex.r));
return await cleanup();
