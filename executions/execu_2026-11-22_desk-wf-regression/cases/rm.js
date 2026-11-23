const TLR = '913b2c84-f235-404d-b563-c2cfa9566b6a', TU1 = '876ce871-2b02-4854-89a7-68050391c62b';
const mark = FU({ qa_ndc_company_name: 'WFHIT' }); const out = {};
const CEt = { kind: 'RecordCreatedOrUpdated' };
// mode
const rRec = await mkRule('RMrec', CEt, [mark]); const rOne = await mkRule('RMone', CEt, [mark], { mode: 'OneTime' });
// active / inactive
const rOff = await mkRule('RMoff', { kind: 'RecordCreated' }, [mark], { active: false });
// layout scope
const rLay = await mkRule('RMlay', { kind: 'RecordCreated' }, [mark], { layoutId: TLR });
// department scope
const rD1 = await mkRule('RMd1', { kind: 'RecordCreated' }, [mark], { departmentIds: [DEPT] });
const rDall = await mkRule('RMdall', { kind: 'RecordCreated' }, [mark], { departmentIds: [] });
// logic: (A and B) or C ; A=priority high, B=classification problem, C=agent_id 7
const A = cmp('priority', 'Equal', S('high')), Bc = cmp('classification', 'Equal', S('problem')), Cc = cmp('qa_ndc_agent_id', 'Equal', I(7));
const rLog = await mkRule('RMlog', { kind: 'RecordCreated' }, [mark], { criteria: OR(AND(A, Bc), Cc) });
const rLog2 = await mkRule('RMlog2', { kind: 'RecordCreated' }, [mark], { criteria: AND(A, OR(Bc, Cc)) });
out.save = Object.fromEntries(Object.entries({ rRec, rOne, rOff, rLay, rD1, rDall, rLog, rLog2 }).map(([k, r]) => [k, r.s + (r.err ? ' ' + r.err.slice(0, 120) : '')]));
// limits
const many = n => Array.from({ length: n }, (_, i) => cmp('qa_ndc_agent_id', 'NotEqual', I(1000 + i)));
const l25 = await mkRule('RMc25', { kind: 'RecordCreated' }, [mark], { criteria: AND(...many(24)), active: false });  // + guard = 25
const l26 = await mkRule('RMc26', { kind: 'RecordCreated' }, [mark], { criteria: AND(...many(25)), active: false });  // + guard = 26
const tenFU = Array.from({ length: 10 }, (_, i) => FU({ ['qa_ndc_company_name']: 'v' + i }));
const a10 = await mkRule('RMa10', { kind: 'RecordCreated' }, tenFU, { active: false });
const a11 = await mkRule('RMa11', { kind: 'RecordCreated' }, [...tenFU, FU({ qa_ndc_agency_code: 'x' })], { active: false });
const dupId = await mkRule('RMdup', { kind: 'RecordCreated' }, [mark, mark], { active: false });
const own2 = await mkRule('RMown2', { kind: 'RecordCreated' }, [{ type: 'OwnerAssignment', ownerTargetKind: 'SpecificUser', ownerValue: TU1 }, { type: 'OwnerAssignment', ownerTargetKind: 'UserField', ownerValue: 'created_by' }], { active: false });
const own2s = await mkRule('RMown2s', { kind: 'RecordCreated' }, [{ type: 'OwnerAssignment', ownerTargetKind: 'SpecificUser', ownerValue: TU1 }, { type: 'OwnerAssignment', ownerTargetKind: 'UserField', ownerValue: 'created_by', delaySeconds: 3600 }], { active: false });
const fu2 = await mkRule('RMfu2', { kind: 'RecordCreated' }, [FU({ qa_ndc_company_name: 'a' }), FU({ qa_ndc_agency_code: 'b' })], { active: false });
const noAct = await mkRule('RMnoact', { kind: 'RecordCreated' }, [], { active: false });
out.limits = Object.fromEntries(Object.entries({ l25, l26, a10, a11, dupId, own2, own2s, fu2, noAct }).map(([k, r]) => [k, r.s + (r.err ? ' ' + r.err.slice(0, 140) : '')]));
for (const r of [l25, l26, a10, a11, dupId, own2, own2s, fu2, noAct]) if (r.id) await api('DELETE', '/workflow/rules/' + r.id);
// tickets
const tRec = await mkTicket('RMrec', { department: DEPT }); const tOne = await mkTicket('RMone', { department: DEPT }); const tOff = await mkTicket('RMoff', { department: DEPT });
const tLayY = await mkTicket('RMlay', { department: DEPT, _layout: TLR }, 'Y'); const tLayN = await mkTicket('RMlay', { department: DEPT }, 'N');
const tD1y = await mkTicket('RMd1', { department: DEPT }, 'Y'); const tD1n = await mkTicket('RMd1', { department: DEPT2 }, 'N');
const tDa1 = await mkTicket('RMdall', { department: DEPT }, 'A'); const tDa2 = await mkTicket('RMdall', { department: DEPT2 }, 'B');
const truth = [['hp', { priority: 'high', classification: 'problem' }], ['hq', { priority: 'high', classification: 'question' }], ['lq7', { priority: 'low', classification: 'question', qa_ndc_agent_id: 7 }], ['hq7', { priority: 'high', classification: 'question', qa_ndc_agent_id: 7 }], ['lp', { priority: 'low', classification: 'problem' }]];
const tl = {}, tl2 = {}; for (const [k, v] of truth) { tl[k] = await mkTicket('RMlog', { department: DEPT, ...v }, k); tl2[k] = await mkTicket('RMlog2', { department: DEPT, ...v }, k); }
await sleep(10000);
for (let i = 0; i < 3; i++) { await patchTicket(tRec.id, { qa_ndc_agency_code: 'e' + i }); await patchTicket(tOne.id, { qa_ndc_agency_code: 'e' + i }); await sleep(6000); }
await sleep(30000);
out.mode = { recurring_create_plus3edits: await fired(tRec.id, rRec.id), oneTime_create_plus3edits: await fired(tOne.id, rOne.id) };
out.inactive = await fired(tOff.id, rOff.id);
// activate the inactive rule and create again
await api('POST', '/workflow/rules/' + rOff.id + '/activate'); const tOff2 = await mkTicket('RMoff', { department: DEPT }, 'after'); await sleep(25000); out.afterActivate = await fired(tOff2.id, rOff.id);
out.layout = { onLayout: await fired(tLayY.id, rLay.id), otherLayout: await fired(tLayN.id, rLay.id) };
out.dept = { inScope: await fired(tD1y.id, rD1.id), outScope: await fired(tD1n.id, rD1.id), all_A: await fired(tDa1.id, rDall.id), all_B: await fired(tDa2.id, rDall.id) };
out.logic1 = {}; out.logic2 = {}; for (const [k] of truth) { out.logic1[k] = await fired(tl[k].id, rLog.id); out.logic2[k] = await fired(tl2[k].id, rLog2.id); }
fs.writeFileSync(RUN + '/out/rm.json', JSON.stringify(out, null, 1));
return out;
