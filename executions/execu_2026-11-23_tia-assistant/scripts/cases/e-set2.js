const mode = process.env.MODE; let s;
if (mode === 'nopropose') s = await saveDraft(d => { d.tool_keys = d.tool_keys.filter(k => !/^tia_propose/.test(k)); });
if (mode === 'runaction') s = await saveDraft(d => { d.tool_keys = [...new Set([...d.tool_keys, 'tia_proposeRunAction', 'tia_listActions'])]; d.custom_action_keys = []; });
if (mode === 'fake') s = await saveDraft(d => { d.tool_keys = [...d.tool_keys, 'tia_fake_tool']; });
const dp = await deploy(); const a = await getAgent();
return { mode, draft: s.s, err: s.err, deploy: dp.s, derr: dp.err, v: a.deployed_version_no, tools: a.draft_definition.tool_keys.length, fake: a.draft_definition.tool_keys.includes('tia_fake_tool') };
