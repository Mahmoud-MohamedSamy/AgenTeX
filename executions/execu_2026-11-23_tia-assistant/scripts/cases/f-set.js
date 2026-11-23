const T = JSON.parse(process.env.TOP);
const s = await saveDraft(d => { d.tia = { ...(d.tia || {}), allowed_topics: T.a ?? null, denied_topics: T.d ?? null }; });
const dp = process.env.NODEPLOY ? { s: 'skip' } : await deploy(); const a = await getAgent();
return { draft: s.s, err: s.err, deploy: dp.s, v: a.deployed_version_no, allowed: a.draft_definition.tia.allowed_topics, deniedN: (a.draft_definition.tia.denied_topics || []).length, denied: (a.draft_definition.tia.denied_topics || []).slice(0, 3), lens: (a.draft_definition.tia.denied_topics || []).map(x => x.length).slice(-3) };
