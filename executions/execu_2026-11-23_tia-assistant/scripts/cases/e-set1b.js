const s = await saveDraft(d => { if (!d.write_module_keys.includes('leads')) d.write_module_keys.push('leads'); });
const dp = await deploy(); const a = await getAgent();
return { s: s.s, d: dp.s, v: a.deployed_version_no, leads: a.draft_definition.write_module_keys.includes('leads'), wf: a.draft_definition.tool_keys.includes('tia_proposeCreateWorkflow'), bp: a.draft_definition.tool_keys.includes('tia_proposeCreateBlueprint') };
