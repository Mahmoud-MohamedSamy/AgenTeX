// TB — transition Before: owners, other department, criteria.
const tag = 'TB' + uid();
const sees = async (t, who) => (await transIds(t, who)).join(',') || '-';
// TB-01 no owners anywhere
const t1g = 'TB1' + uid(); await mkBp(BASIC(t1g)); const t1 = await mkT(t1g); await waitIn(t1);
const s1 = { owner: await sees(t1), A: await sees(t1, A), B: await sees(t1, B), VO: await sees(t1, VO) };
R('TB-01', s1.A === 'go' && s1.B === 'go' && s1.VO === '-' ? 'PASS' : 'FAIL', 'who sees "go" with no owners: ' + JSON.stringify(s1));
// TB-02 agent owner
const t2g = 'TB2' + uid(); await mkBp(DEF(t2g, S3(), [TR('go', 'Open', 'Escalated', { before: { allowedUserIds: [U.A] } }), TR('end', 'Escalated', 'Closed')]));
const t2 = await mkT(t2g); await waitIn(t2);
const s2 = { A: await sees(t2, A), B: await sees(t2, B) }; const r2 = await runT(t2, 'go', 'Open', {}, B);
R('TB-02', s2.A === 'go' && s2.B === '-' && code(r2) === 'BLUEPRINT_NOT_OWNER' ? 'PASS' : 'FAIL', `A sees ${s2.A}, B sees ${s2.B}; B runs → ${E(r2)}`);
// TB-03 team owner (team = A + B; owner account not in team)
const t3g = 'TB3' + uid(); await mkBp(DEF(t3g, S3(), [TR('go', 'Open', 'Escalated', { before: { teamIds: [TEAM] } }), TR('end', 'Escalated', 'Closed')]));
const t3 = await mkT(t3g); await waitIn(t3);
const s3 = { A: await sees(t3, A), B: await sees(t3, B), owner: await sees(t3), VO: await sees(t3, VO) };
R('TB-03', s3.A === 'go' && s3.B === 'go' && s3.owner === '-' ? 'PASS' : (s3.A === 'go' && s3.B === 'go' ? 'FINDING' : 'FAIL'), 'team owner: ' + JSON.stringify(s3) + (s3.owner !== '-' ? ' (tenant owner is not in the team but still sees it)' : ''));
// TB-04 ticket owner
const t4g = 'TB4' + uid(); await mkBp(DEF(t4g, S3(), [TR('go', 'Open', 'Escalated', { before: { allowOwner: true } }), TR('end', 'Escalated', 'Closed')]));
const t4 = await mkT(t4g); await waitIn(t4);
const as1 = await api('POST', `/desk/tickets/${t4}/assign`, { owner_id: U.A }); await sleep(2500);
const s4a = { A: await sees(t4, A), B: await sees(t4, B) };
const as2 = await api('POST', `/desk/tickets/${t4}/assign`, { owner_id: U.B }); await sleep(2500);
const s4b = { A: await sees(t4, A), B: await sees(t4, B) };
R('TB-04', s4a.A === 'go' && s4a.B === '-' && s4b.B === 'go' && s4b.A === '-' ? 'PASS' : 'FAIL', `owner A (${as1.s}): ${JSON.stringify(s4a)}; owner B (${as2.s}): ${JSON.stringify(s4b)}`);
// TB-05 other department owner: Full runs; Read only / Restricted + required reply/resolution/approval refused at save
const mkX = async (access, items) => mkBp(DEF('TB5' + access + uid(), S3(), [TR('go', 'Open', 'Escalated', { before: { departmentOwners: [{ departmentId: TECH, access, userIds: [U.C], teamIds: [] }] }, during: { deskItems: items } }), TR('end', 'Escalated', 'Closed')]), false);
const x = { roReply: await mkX('read_only', [{ kind: 'reply', mandatory: true }]), roResolution: await mkX('read_only', [{ kind: 'resolution', mandatory: true }]), rsReply: await mkX('restricted', [{ kind: 'reply', mandatory: true }]), rsApproval: await mkX('restricted', [{ kind: 'approval', mandatory: true, approverUserIds: [U.B] }]), roOptional: await mkX('read_only', [{ kind: 'reply', mandatory: false }]) };
const t5g = 'TB5F' + uid(); await mkBp(DEF(t5g, S3(), [TR('go', 'Open', 'Escalated', { before: { departmentOwners: [{ departmentId: TECH, access: 'full', userIds: [U.C], teamIds: [] }] } }), TR('end', 'Escalated', 'Closed')]));
const t5 = await mkT(t5g); await waitIn(t5); await sleep(3000);
const shares5 = L((await api('GET', `/desk/tickets/${t5}/shares`)).j?.data);
const cSees = await sees(t5, C); const r5 = await runT(t5, 'go', 'Open', {}, C); await sleep(3000);
const shares5b = L((await api('GET', `/desk/tickets/${t5}/shares`)).j?.data);
const refusedOk = !x.roReply.ok && !x.roResolution.ok && !x.rsReply.ok && !x.rsApproval.ok && x.roOptional.ok;
R('TB-05', refusedOk && cSees === 'go' && ok(r5) ? 'PASS' : 'FAIL', `save: RO+required reply ${x.roReply.ok ? 'SAVED' : code(x.roReply.r)}, RO+resolution ${x.roResolution.ok ? 'SAVED' : code(x.roResolution.r)}, Restricted+reply ${x.rsReply.ok ? 'SAVED' : code(x.rsReply.r)}, Restricted+approval ${x.rsApproval.ok ? 'SAVED' : code(x.rsApproval.r)}, RO+optional reply ${x.roOptional.ok ? 'saved' : 'REFUSED'}; Full: shared while in Open ${JSON.stringify(shares5.map(s => s.department_id === TECH ? s.access : '-'))}, C sees ${cSees}, C runs ${E(r5)}; shares after leaving Open ${JSON.stringify(shares5b.map(s => s.department_id === TECH ? s.access : '-'))}`);
// TB-06 suspended owner: would suspend a shared account
R('TB-06', 'BLOCKED', 'Needs an owner account suspended or deactivated; all agent accounts are shared NDC-Staging accounts (designer "Suspended"/"No active owner" texts checked in Phase 3 if a suspended user exists)');
RG('NDC-3036', 'BLOCKED', 'only-owner deactivated: needs suspending a shared account');
// TB-07 unknown / malformed owner ids
const u1 = await mkBp(DEF(tag, S3(), [TR('go', 'Open', 'Escalated', { before: { allowedUserIds: [crypto.randomUUID()] } }), TR('end', 'Escalated', 'Closed')]), false);
const u2 = await mkBp(DEF(tag, S3(), [TR('go', 'Open', 'Escalated', { before: { allowedUserIds: ['not-a-uuid'] } }), TR('end', 'Escalated', 'Closed')]), false);
const msg2 = u2.r.j?.error?.message || u2.r.t || '';
const readable = !/System\.|JSON|\$\.|parse|LineNumber|BytePosition/i.test(msg2);
R('TB-07', !u1.ok && !u2.ok && readable ? 'PASS' : 'FAIL', `unknown user id: ${u1.ok ? 'SAVED' : E(u1.r)}; malformed id: ${u2.ok ? 'SAVED' : E(u2.r)}`);
RG('NDC-3037', !u1.ok ? 'PASS' : 'FAIL', 'unknown owner id ' + (u1.ok ? 'saved' : code(u1.r)));
RG('NDC-3069', !u2.ok && readable ? 'PASS' : 'FAIL', 'malformed owner id message: ' + msg2.slice(0, 160));
// TB-08 view-only member as owner
const v1 = await mkBp(DEF(tag, S3(), [TR('go', 'Open', 'Escalated', { before: { allowedUserIds: [U.VO] } }), TR('end', 'Escalated', 'Closed')]), false);
const ro = await api('GET', `/modules/${T}/blueprints/read-only-agents?departmentId=${DEPT}`);
both('TB-08', 'NDC-3112', !v1.ok, `view-only member as owner: ${v1.ok ? 'SAVED' : E(v1.r)}; read-only-agents endpoint ${ro.s} lists ${JSON.stringify(ro.j?.data).includes(U.VO)}`);
R('API-05', ok(ro) && JSON.stringify(ro.j?.data).includes(U.VO) && !JSON.stringify(ro.j?.data).includes(U.A) ? 'PASS' : 'FAIL', 'read-only-agents: ' + JSON.stringify(ro.j?.data).slice(0, 200));
// TB-09/10 criteria on the transition
const t9g = 'TB9' + uid(); await mkBp(DEF(t9g, S3(), [TR('go', 'Open', 'Escalated', { before: { visibilityCriteria: { op: 'eq', field: 'priority', value: 'high' } } }), TR('end', 'Escalated', 'Closed')]));
const th = await mkT(t9g, 'high', { priority: 'high' }), tl = await mkT(t9g, 'low', { priority: 'low' }); await waitIn(th); await waitIn(tl);
const s9 = { high: await sees(th), low: await sees(tl) };
R('TB-09', s9.high === 'go' && s9.low === '-' ? 'PASS' : 'FAIL', 'step shown only on matching ticket: ' + JSON.stringify(s9));
const r10 = await runT(tl, 'go', 'Open'); await sleep(1500); const still = st(await bstate(tl));
both('TB-10', 'NDC-3117', code(r10) === 'BLUEPRINT_CRITERIA_NOT_MET' && still === 'Open', `run hidden step on non-matching ticket → ${E(r10)}; state ${still}`);
// TB-11 other criteria fields (channel + approval status pick lists)
const t11g = 'TB11' + uid(); await mkBp(DEF(t11g, S3(), [TR('go', 'Open', 'Escalated', { before: { visibilityCriteria: { op: 'and', children: [{ op: 'eq', field: 'channel', value: 'phone' }, { op: 'neq', field: 'priority', value: 'urgent' }] } } }), TR('end', 'Escalated', 'Closed')]));
const tp = await mkT(t11g, 'phone', { channel: 'phone' }), tw = await mkT(t11g, 'web', { channel: 'web' }); await waitIn(tp); await waitIn(tw);
const s11 = { phone: await sees(tp), web: await sees(tw) };
R('TB-11', s11.phone === 'go' && s11.web === '-' ? 'PARTIAL' : 'FAIL', 'AND criteria on Channel + Priority: ' + JSON.stringify(s11) + ' — related (Contact) fields in criteria not checked through the API; see Phase 3 builder');
return await cleanup();
