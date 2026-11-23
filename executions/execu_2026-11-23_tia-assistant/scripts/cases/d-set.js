const A = JSON.parse(process.env.AUD);
const s = await saveDraft(d => { d.tia = { ...(d.tia || {}), allowed_profile_ids: A.p ?? null, allowed_user_ids: A.u ?? null }; });
const dp = await deploy(); const a = await getAgent();
return { draft: s.s, err: s.err, deploy: dp.s, derr: dp.err, tia: { p: a.draft_definition.tia.allowed_profile_ids, u: a.draft_definition.tia.allowed_user_ids }, v: a.deployed_version_no };
