const a0 = await getAgent();
// B-02 draft only: instruction marker should NOT be live
const s1 = await saveDraft(d => { d.instructions = BASEDEF.draft_definition.instructions + ' Always end every answer with the exact token QA-DRAFT-B02.'; d.description = 'QA TIA desc'; });
const a1 = await getAgent();
const live = await ask('Say hello in three words.');
result('B-02', s1.s < 300 && a1.has_undeployed_changes === true && !/QA-DRAFT-B02/.test(live.text) ? 'Pass' : 'Fail', `draft PUT ${s1.s} ${s1.err?.code||''}; has_undeployed=${a1.has_undeployed_changes}; live answer has marker=${/QA-DRAFT-B02/.test(live.text)} ("${live.text.slice(0,80)}")`);
// B-03 deploy
const d1 = await deploy(); const a2 = await getAgent();
await sleep(3000);
const live2 = await ask('Say hello in three words.');
result('B-03', d1.s < 300 && a2.deployed_version_no === a0.deployed_version_no + 1 && !a2.has_undeployed_changes ? 'Pass' : 'Fail', `deploy ${d1.s}; version ${a0.deployed_version_no}→${a2.deployed_version_no}; undeployed=${a2.has_undeployed_changes}`);
result('E-16', /QA-DRAFT-B02/.test(live2.text) ? 'Pass' : 'Finding', `after deploy, answer ends with marker=${/QA-DRAFT-B02/.test(live2.text)} ("${live2.text.slice(-80)}")`);
// B-12 stale write with old expected_updated_at
const stale = await saveDraft(d => { d.description = 'QA TIA stale'; }, { expected: a0.updated_at });
const a3 = await getAgent();
result('B-12', stale.s === 409 || (stale.s >= 400 && /CONFLICT|STALE|VERSION/i.test(stale.err?.code||'')) ? 'Pass' : 'Fail', `stale expected_updated_at → ${stale.s} ${stale.err?.code||''}; description now "${a3.draft_definition.description}"`);
// no expected_updated_at at all
const noexp = await saveDraft(d => { d.description = 'QA TIA no-expected'; }, { noExpected: true });
const a4 = await getAgent();
result('B-12b', noexp.s === 400 || noexp.s === 409 || noexp.s === 428 ? 'Pass' : 'Finding', `draft PUT without expected_updated_at → ${noexp.s} ${noexp.err?.code||''}; saved="${a4.draft_definition.description}" (no version needed = lost-update risk)`);
// B-13 partial definition: send only description in definition
const part = await api('PUT', `/agents/${AGENT}/draft`, { name: 'Tia', definition: { description: 'QA TIA partial' }, expected_updated_at: a4.updated_at });
const a5 = await getAgent();
const lostTools = (a5.draft_definition.tool_keys || []).length;
result('B-13', part.s >= 400 || lostTools === a4.draft_definition.tool_keys.length ? 'Pass' : 'Fail', `PUT draft with partial definition → ${part.s} ${part.j?.error?.code||''}; tool_keys after=${lostTools} (before ${a4.draft_definition.tool_keys.length}); write modules after=${(a5.draft_definition.write_module_keys||[]).length}`);
// B-14 read-only keys
const ro = await api('PUT', `/agents/${AGENT}/draft`, { name: 'Tia', id: '00000000-0000-0000-0000-000000000001', status: 'inactive', kind: 'customer', deployed_version_no: 99, definition: a5.draft_definition, expected_updated_at: a5.updated_at });
const a6 = await getAgent();
result('B-14', a6.id === AGENT && a6.status === 'deployed' && a6.kind === 'assistant' && a6.deployed_version_no !== 99 ? 'Pass' : 'Fail', `PUT with read-only keys → ${ro.s}; id/status/kind/version after: ${a6.id===AGENT}/${a6.status}/${a6.kind}/${a6.deployed_version_no}`);
// B-10 deploy with no tools through the API
const nt = await saveDraft(d => { d.tool_keys = []; });
const dn = await deploy(); const a7 = await getAgent();
result('B-10', dn.s >= 400 ? 'Pass' : 'Finding', `draft with tool_keys:[] → ${nt.s} ${nt.err?.code||''}; deploy → ${dn.s} ${dn.err?.code||''} ${dn.err?.message||''}; deployed v${a7.deployed_version_no}, live tools=${a7.draft_definition.tool_keys.length}`);
// restore draft to baseline + deploy
const rs = await saveDraft(() => JSON.parse(JSON.stringify(BASEDEF.draft_definition)), { description: BASEDEF.description });
const rd = await deploy(); const a8 = await getAgent();
ledger(`Tia definition restored to baseline after B api cases → draft ${rs.s}, deploy ${rd.s}, v${a8.deployed_version_no}`);
return { versions: [a0.deployed_version_no, a2.deployed_version_no, a7.deployed_version_no, a8.deployed_version_no], restore: [rs.s, rd.s], same: JSON.stringify(a8.draft_definition) === JSON.stringify(BASEDEF.draft_definition), part: part.j?.error, ro: ro.j?.error };
