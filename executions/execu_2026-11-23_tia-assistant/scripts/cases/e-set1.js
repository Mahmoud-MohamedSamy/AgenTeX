const s = await saveDraft(d => {
  d.tool_keys = d.tool_keys.filter(k => k !== 'tia_runReport' && k !== 'tia_search').concat(['tia_proposeCreateWorkflow', 'tia_proposeCreateBlueprint']);
  d.write_module_keys = d.write_module_keys.filter(k => k !== 'leads');
  d.tia.setup_areas = { ...d.tia.setup_areas, describe_off: ['desk.sla_policies'], propose: d.tia.setup_areas.propose.filter(k => k !== 'desk.macros') };
  d.guardrails = { ...d.guardrails, donts: ['Never mention competitor product names such as Zoho, Salesforce or Freshdesk.'] };
});
const dp = await deploy(); const a = await getAgent();
const areas = arr((await api('GET', '/agents/tia-setup-areas')).j?.data);
const ro = areas.filter(x => x.read_only).map(x => x.key);
const prof = await api('GET', '/iam/profiles'); const mah = arr(prof.j?.data).find(p => p.name === 'mahmoud');
const mp = mah ? await api('GET', `/iam/profiles/${mah.profileId}/permissions`) : null;
return { draft: s.s, err: s.err, deploy: dp.s, derr: dp.err, v: a.deployed_version_no, tools: a.draft_definition.tool_keys.length, areas: areas.length, readOnly: ro.length, roSample: ro.slice(0, 8), arabicTitles: areas.filter(x => x.title_ar).length, mahmoudProfile: mah && { app: mah.appKey, isSystem: mah.isSystem, tia: arr(mp.j?.data).some(x => x.permissionKey === 'ai:tia:use'), admin: arr(mp.j?.data).filter(x => /manage/.test(x.permissionKey)).length } };
