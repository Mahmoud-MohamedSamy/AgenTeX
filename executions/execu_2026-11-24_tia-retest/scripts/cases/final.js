const out = {};
const a = await getAgent(); const O = JSON.parse(fs.readFileSync(RUN + '/out/b09-orig.json', 'utf8'));
out.tia = { id: AGENT.slice(0, 8), live: a.deployed_version_no, undeployed: a.has_undeployed_changes, sameSetupAsBeforeRound: JSON.stringify(a.draft_definition) === JSON.stringify(O.def), proposeAreas: a.draft_definition.tia?.setup_areas?.propose?.length };
const P = JSON.parse(fs.readFileSync(RUN + '/out/g14-policy-before.json', 'utf8')); const p = (await api('GET', '/ai/policy')).j?.data; out.policySameTia = JSON.stringify(p.descriptor.features.tia) === JSON.stringify(P.descriptor.features.tia); out.policyTia = p.descriptor.features.tia;
const perm = async id => arr((await api('GET', `/iam/profiles/${id}/permissions`)).j?.data).map(x => x.permissionKey);
const da = await perm(DESK_AGENT_PROFILE); out.deskAgent = { n: da.length, tia: da.includes('ai:tia:use') };
const sup = await perm('44444444-4444-4444-4444-444444444404'); out.deskSupervisor = { n: sup.length, agentManage: sup.includes('ai:agent:manage') };
out.status = (await api('GET', '/agents/tia/status')).j?.data?.available;
return out;
