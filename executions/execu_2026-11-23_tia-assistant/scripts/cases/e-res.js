const rs = await saveDraft(() => JSON.parse(JSON.stringify(BASEDEF.draft_definition)), { description: BASEDEF.description }); const rd = await deploy(); const a = await getAgent();
ledger(`restored Tia after E: ${rs.s}/${rd.s} v${a.deployed_version_no}`);
return { v: a.deployed_version_no, same: JSON.stringify(a.draft_definition) === JSON.stringify(BASEDEF.draft_definition) };
