const st = await api('GET', '/agents/tia/status');
const a = await getAgent();
const pol = (await api('GET', '/ai/policy')).j?.data;
const rt = (await api('GET', '/agents/runtime-settings')).j;
const prof = (await api('GET', `/iam/profiles/${DESK_AGENT_PROFILE}/permissions`)).j?.data;
const dept = (await api('GET', `/desk/departments/${DEPT_A}`)).j?.data;
const base = { status: st.j?.data, agent: { version: a?.deployed_version_no ?? a?.version_no, status: a?.status, undeployed: a?.has_undeployed_changes, updated_at: a?.updated_at, def: a?.definition || a?.deployed_definition || a?.draft_definition }, policy: pol, runtime: rt, deskAgentPerms: (prof||[]).map(p=>p.permissionKey+':'+(p.effect||'')).sort(), deptA: dept };
fs.writeFileSync(RUN + '/out/baseline-' + process.env.APP + '.json', JSON.stringify(base, null, 1));
return { app: process.env.APP, status: st.s, avail: st.j?.data?.available ?? st.j?.data, version: base.agent.version, undeployed: base.agent.undeployed, polVer: pol?.version, tiaPolicy: pol?.descriptor?.features?.tia, perms: base.deskAgentPerms.length, hasTia: base.deskAgentPerms.some(x=>x.startsWith('ai:tia:use')), deptKeys: Object.keys(dept||{}).slice(0,30) };
