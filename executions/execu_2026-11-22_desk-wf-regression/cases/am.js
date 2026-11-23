const mark = v => FU({ qa_ndc_company_name: v });
const out = {};
// webhook receiver answering 500
let h500 = null; try { const r = await fetch('https://webhook.site/token', { method: 'POST', headers: { accept: 'application/json', 'content-type': 'application/json' }, body: JSON.stringify({ default_status: 500, default_content: 'boom' }) }); const j = await r.json(); if (j.uuid) h500 = { url: 'https://webhook.site/' + j.uuid, uuid: j.uuid }; } catch (e) { }
// scheduled save for every type (delay 1 h, inactive, deleted)
const TU1 = '876ce871-2b02-4854-89a7-68050391c62b', tagC = '7397b50e-30dd-4ebb-9abf-7e9468a7cc82';
const types = { FieldUpdate: mark('S'), OwnerAssignment: { type: 'OwnerAssignment', ownerTargetKind: 'SpecificUser', ownerValue: TU1 }, AddTags: { type: 'AddTags', tagIds: [tagC], mode: 'append' }, RemoveTags: { type: 'RemoveTags', tagIds: [tagC] }, AddTicketComment: { type: 'AddTicketComment', commentBody: 'S', commentPublic: false }, MarkTicketSpam: { type: 'MarkTicketSpam', spamContact: false }, ShareTicket: { type: 'ShareTicket', shareDepartmentId: DEPT2, shareAccess: 'read_only' }, Task: { type: 'Task', taskTitle: 'QA WF S' }, SendHappinessEmail: { type: 'SendHappinessEmail' } };
out.scheduledSave = {};
for (const [k, a] of Object.entries(types)) { const r = await mkRule('AMs' + k.slice(0, 10), { kind: 'RecordCreated' }, [{ ...a, delaySeconds: 3600 }], { active: false }); out.scheduledSave[k] = r.s + (r.err ? ' ' + r.err.slice(0, 100) : ''); if (r.id) await api('DELETE', '/workflow/rules/' + r.id); }
// S1 delayed FU 120 s
const s1 = await mkRule('AMs1', { kind: 'RecordCreated' }, [{ ...mark('LATE'), delaySeconds: 120 }]);
// S2 cancelled when no longer matching
const s2 = await mkRule('AMs2', { kind: 'RecordCreated' }, [{ ...mark('LATE'), delaySeconds: 150 }], { criteria: cmp('priority', 'Equal', S('medium')) });
// S3 deactivated / S4 deleted before delay
const s3 = await mkRule('AMs3', { kind: 'RecordCreated' }, [{ ...mark('LATE'), delaySeconds: 150 }]);
const s4 = await mkRule('AMs4', { kind: 'RecordCreated' }, [{ ...mark('LATE'), delaySeconds: 150 }]);
// failure isolation: webhook 500 + field update
const f1 = h500 ? await mkRule('AMf1', { kind: 'RecordCreated' }, [{ type: 'Webhook', url: h500.url, method: 'POST', bodyTemplate: '{"x":1}', timeoutSeconds: 10 }, mark('AFTER500')]) : { s: 'no receiver' };
const t1 = await mkTicket('AMs1'), t2 = await mkTicket('AMs2'), t3 = await mkTicket('AMs3'), t4 = await mkTicket('AMs4'), tf = f1.id ? await mkTicket('AMf1') : {};
await sleep(45000);
const early = (await getTicket(t1.id)).qa_ndc_company_name;
await patchTicket(t2.id, { priority: 'high' });
await api('POST', '/workflow/rules/' + s3.id + '/deactivate'); await api('DELETE', '/workflow/rules/' + s4.id);
await sleep(150000);
const g = async t => (await getTicket(t.id)).qa_ndc_company_name || null;
const d = async (t, r) => (await execs(t.id, r.id)).flatMap(e => (e.dispatches || []).map(x => x.actionType + ':' + x.status + (x.attempts ? ' x' + x.attempts : '') + (x.lastError ? ' (' + String(x.lastError).slice(0, 80) + ')' : '')));
out.S1 = { at45s: early || null, at3min: await g(t1), dispatch: await d(t1, s1) };
out.S2 = { value: await g(t2), dispatch: await d(t2, s2) };
out.S3 = { value: await g(t3), dispatch: await d(t3, s3) };
out.S4 = { value: await g(t4), dispatch: s4.id ? await d(t4, s4) : '-' };
if (tf.id) out.F1 = { value: await g(tf), dispatch: await d(tf, f1), hits: (await hookReqs(h500)).length };
// ticket events
const ev = (events, extra) => ({ kind: 'TicketEvent', ticketEvents: { events, ...(extra || {}) } });
const eAny = await mkRule('TEany', ev(['comment'], { comments: 'any' }), [mark('EV')]);
const ePub = await mkRule('TEpub', ev(['comment'], { comments: 'public' }), [mark('EV')]);
const ePriv = await mkRule('TEpriv', ev(['comment'], { comments: 'private' }), [mark('EV')]);
const eAR = await mkRule('TEar', ev(['agent_response']), [mark('EV')]);
const ePT = await mkRule('TEpt', ev(['private_thread'], { privateThreads: 'outgoing' }), [mark('EV')]);
const ePTi = await mkRule('TEpti', ev(['private_thread'], { privateThreads: 'incoming' }), [mark('EV')]);
const eMulti = await mkRule('TEmulti', ev(['comment', 'agent_response'], { comments: 'any' }), [mark('EV')]);
const eNone = await mkRule('TEnone', ev([]), [mark('EV')], { active: false });
out.TEsave = { none: eNone.s + ' ' + (eNone.err || '').slice(0, 120) }; if (eNone.id) await api('DELETE', '/workflow/rules/' + eNone.id);
const ta = await mkTicket('TEany'), tp = await mkTicket('TEpub'), tq = await mkTicket('TEpriv'), tr = await mkTicket('TEar'), tt = await mkTicket('TEpt'), tti = await mkTicket('TEpti'), tm = await mkTicket('TEmulti');
await sleep(15000);
const onCreate = { any: await fired(ta.id, eAny.id), ar: await fired(tr.id, eAR.id) };
await comment(ta.id, false); await comment(ta.id, true);
await comment(tp.id, false); await sleep(8000); await comment(tp.id, true);
await comment(tq.id, true); await sleep(8000); await comment(tq.id, false);
const rp = await reply(tr.id); await comment(tr.id, true);
const fw = await api('POST', `/desk/tickets/${tt.id}/replies`, { mode: 'forward', to: ['mahmoud.mmohamedsamy+qawffwd@gmail.com'], subject: 'Fwd: QA WF TEpt', body_html: '<p>QA WF forward</p>' });
const fw2 = await api('POST', `/desk/tickets/${tti.id}/replies`, { mode: 'forward', to: ['mahmoud.mmohamedsamy+qawffwd@gmail.com'], subject: 'Fwd: QA WF TEpti', body_html: '<p>QA WF forward</p>' });
await comment(tm.id, false); await sleep(8000); await reply(tm.id);
await sleep(40000);
out.TE = { onCreate, any_priv_then_pub: await fired(ta.id, eAny.id), publicOnly_priv_then_pub: await fired(tp.id, ePub.id), privateOnly_pub_then_priv: await fired(tq.id, ePriv.id), agentResponse_reply_plus_comment: { reply: rp.s, fired: await fired(tr.id, eAR.id) }, ptOutgoing_forward: { fw: fw.s + ' ' + (errOf(fw) || ''), fired: await fired(tt.id, ePT.id) }, ptIncoming_forward: { fw: fw2.s, fired: await fired(tti.id, ePTi.id) }, multi_comment_then_reply: await fired(tm.id, eMulti.id) };
fs.writeFileSync(RUN + '/out/am.json', JSON.stringify(out, null, 1));
return out;
