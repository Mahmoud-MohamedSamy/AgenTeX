const s = await saveDraft(d => { d.instructions = BASEDEF.draft_definition.instructions + ' Always end every answer with the exact token QA-END.'; });
const d = await deploy(); const a = await getAgent(); await sleep(30000);
const r1 = await ask('What is 2 plus 2?'); const r2 = await ask('Name one colour.');
const rs = await saveDraft(() => JSON.parse(JSON.stringify(BASEDEF.draft_definition)), { description: BASEDEF.description }); const rd = await deploy();
ledger(`restored after E-16b: ${rs.s}/${rd.s}`);
return { deployed: d.s, v: a.deployed_version_no, instr: a.draft_definition.instructions.slice(-60), r1: short(r1), r1types: r1.types, r1final: JSON.stringify(r1.final||{}).slice(0,500), r2: short(r2) };
