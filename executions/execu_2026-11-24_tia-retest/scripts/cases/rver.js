const v = await api('GET', `/agents/${AGENT}/versions`); const vs = arr(v.j?.data).slice(0, 4).map(x => ({ no: x.version_no ?? x.versionNo, at: x.created_at ?? x.createdAt ?? x.deployed_at, by: x.created_by_name ?? x.createdByName ?? x.created_by ?? x.deployed_by }));
const a = await getAgent(); const base = JSON.parse(fs.readFileSync(RUN + '/out/baseline-crm.json', 'utf8')).agent;
const now = a.definition || a.deployed_definition || a.draft_definition; const b = base.def;
const diff = Object.keys({ ...now, ...b }).filter(k => JSON.stringify(now?.[k]) !== JSON.stringify(b?.[k]));
const tk = k => { const x = new Set(b?.[k] || []), y = new Set(now?.[k] || []); return { added: [...y].filter(z => !x.has(z)), removed: [...x].filter(z => !y.has(z)) }; };
return { versions: vs, updated_at: a.updated_at, baseUpdated: base.updated_at, changedKeys: diff, tool_keys: tk('tool_keys'), write_module_keys: tk('write_module_keys'), custom_action_keys: tk('custom_action_keys') };
