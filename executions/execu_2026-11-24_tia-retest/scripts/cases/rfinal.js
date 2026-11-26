const me = (await api('GET', '/iam/me')).j?.data || {};
const lang = Object.fromEntries(Object.entries(me).filter(([k]) => /lang|locale/i.test(k)));
const st = await api('GET', '/agents/tia/status'); const a = await getAgent(); const pol = (await api('GET', '/ai/policy')).j?.data;
return { app: process.env.APP, lang, tia: { avail: st.j?.data?.available, version: a?.deployed_version_no ?? a?.version_no, undeployed: a?.has_undeployed_changes, status: a?.status }, policyVersion: pol?.version, tiaPolicy: pol?.descriptor?.features?.tia };
