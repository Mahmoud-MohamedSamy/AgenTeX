result('B-13', 'Finding', 'PUT /draft replaces the whole definition: a body with only description wiped tool_keys (28→0), write modules and instructions, with 200. UI always sends the full definition; API clients can wipe Tia by mistake. Restored.');
const nt = await saveDraft(d => { d.tool_keys = []; });
const a1 = await getAgent();
const dn = await deploy(); const a2 = await getAgent();
result('B-10', dn.s >= 400 ? 'Pass' : 'Finding', `instructions kept, tool_keys:[] → draft ${nt.s}; deploy → ${dn.s} ${dn.err?.code||''} "${dn.err?.message||''}"; deployed v${a2.deployed_version_no}, live tool count=${a2.draft_definition.tool_keys.length}`);
if (dn.s < 300) ledger('B-10: deploy with no tools was ACCEPTED (v' + a2.deployed_version_no + ')');
const rs = await saveDraft(() => JSON.parse(JSON.stringify(BASEDEF.draft_definition)), { description: BASEDEF.description });
const rd = await deploy();
// E-16 retest with marker deployed, wait 20 s
const s = await saveDraft(d => { d.instructions = BASEDEF.draft_definition.instructions + ' Always end every answer with the exact token QA-END.'; });
const d = await deploy(); await sleep(20000);
const r1 = await ask('Say hello in three words.');
const r2 = await ask('What is 2 plus 2?');
const has = [r1, r2].filter(r => /QA-END/.test(r.text)).length;
result('E-16', has === 2 ? 'Pass' : has === 1 ? 'Finding' : 'Fail', `instructions "Always end every answer with QA-END" deployed (draft ${s.s}, deploy ${d.s}); 20 s later ${has}/2 answers end with it: "${r1.text.slice(-60)}" | "${r2.text.slice(-60)}"`);
const rs2 = await saveDraft(() => JSON.parse(JSON.stringify(BASEDEF.draft_definition)), { description: BASEDEF.description }); const rd2 = await deploy(); const a3 = await getAgent();
ledger(`restored after B-10/E-16: ${rs2.s}/${rd2.s} v${a3.deployed_version_no}`);
return { v: a3.deployed_version_no, same: JSON.stringify(a3.draft_definition) === JSON.stringify(BASEDEF.draft_definition) };
