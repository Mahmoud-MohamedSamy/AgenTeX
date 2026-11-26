const a = await getAgent(); const O = JSON.parse(fs.readFileSync(RUN + '/out/b09-orig.json', 'utf8'));
const r = await api('PUT', `/agents/${AGENT}/draft`, { name: O.name, description: O.description, definition: O.def, expected_updated_at: a.updated_at });
let b = await getAgent(); const same = JSON.stringify(b.draft_definition) === JSON.stringify(O.def);
let dep = null; if (b.has_undeployed_changes) { const d = await api('POST', `/agents/${AGENT}/deploy`, {}); dep = d.s; b = await getAgent(); }
ledger(`B-0x: original draft restored (${r.s}, same=${same}); undeployed=${b.has_undeployed_changes}; deploy ${dep}; live v${b.deployed_version_no}`);
return { save: r.s, sameAsOriginal: same, deploy: dep, undeployed: b.has_undeployed_changes, live: b.deployed_version_no, liveWasV: O.version, actions: b.draft_definition.custom_action_keys.length, writeMods: b.draft_definition.write_module_keys.length };
