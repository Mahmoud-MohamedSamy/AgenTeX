const a = await getAgent(); const d = a.draft_definition || {};
return { ver: a.deployed_version_no, latest: a.latest_version_no, undeployed: a.has_undeployed_changes, keys: Object.keys(d), guard: d.guardrails, topics: d.topics, instr: (d.instructions||'').slice(0,200) };
