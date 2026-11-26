const areas = arr((await api('GET', '/agents/tia-setup-areas')).j?.data);
const a = await getAgent(); const def = a.definition || a.deployed_definition || a.draft_definition;
const sa = def?.tia?.setup_areas || {};
fs.writeFileSync(RUN + '/out/setup-areas.json', JSON.stringify({ areas, setup_areas: sa, version: a.deployed_version_no, enabled_apps: def?.tia?.enabled_apps, tools: def?.tool_keys }, null, 1));
const byApp = {}; areas.forEach(x => { const k = (x.key || x.id || '').split('.')[0]; byApp[k] = (byApp[k] || 0) + 1; });
return { n: areas.length, keys: Object.keys(areas[0] || {}), sample: areas.slice(0, 3), byApp, proposeCount: (sa.propose || []).length, describeOff: sa.describe_off, proposeSample: (sa.propose || []).slice(0, 10), proposable: areas.filter(x => x.can_propose ?? x.proposable ?? x.propose_supported).length, apps: def?.tia?.enabled_apps, hasProposeTool: (def?.tool_keys || []).filter(t => /propose/i.test(t)) };
