const a = await getAgent();
fs.writeFileSync(RUN + '/out/pa-agent-before.json', JSON.stringify(a, null, 1));
const v = arr((await api('GET', `/agents/${AGENT}/versions`)).j?.data).slice(0, 3).map(x => ({ no: x.version_no ?? x.versionNo, at: x.created_at ?? x.createdAt, by: x.created_by_name ?? x.createdByName }));
return { id: AGENT, name: a.name, status: a.status, deployed: a.deployed_version_no, undeployed: a.has_undeployed_changes, updated_at: a.updated_at, versions: v, sameDraft: JSON.stringify(a.draft_definition) === JSON.stringify(a.definition || a.deployed_definition), defKeys: Object.keys(a).filter(k => /def/i.test(k)) };
