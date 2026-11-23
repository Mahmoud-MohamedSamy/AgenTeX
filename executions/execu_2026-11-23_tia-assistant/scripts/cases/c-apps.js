const which = process.env.APPS.split(',').filter(Boolean);
const s = await saveDraft(d => { d.tia = { ...(d.tia || {}), enabled_apps: which }; });
const dp = await deploy(); const a = await getAgent();
return { draft: s.s, err: s.err, deploy: dp.s, derr: dp.err, enabled_apps: a.draft_definition.tia.enabled_apps, v: a.deployed_version_no };
