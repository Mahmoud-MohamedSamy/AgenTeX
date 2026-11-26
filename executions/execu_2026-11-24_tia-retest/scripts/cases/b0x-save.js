// MODE=b09 | b08 | orig
const a = await getAgent(); const f = RUN + '/out/b09-orig.json';
if (!fs.existsSync(f)) { if (a.has_undeployed_changes) return { stop: 'undeployed changes exist' }; fs.writeFileSync(f, JSON.stringify({ name: a.name, description: a.description, def: a.draft_definition, version: a.deployed_version_no }, null, 1)); }
const O = JSON.parse(fs.readFileSync(f, 'utf8')); const d = JSON.parse(JSON.stringify(O.def));
if (process.env.MODE === 'b09') d.custom_action_keys = []; if (process.env.MODE === 'b08') d.write_module_keys = [];
const r = await api('PUT', `/agents/${AGENT}/draft`, { name: O.name, description: O.description, definition: d, expected_updated_at: a.updated_at });
const b = await getAgent();
ledger(`B-0x: Tia draft saved as ${process.env.MODE} (${r.s}); live v${b.deployed_version_no}`);
return { mode: process.env.MODE, save: r.s, err: r.j?.error?.code, msg: (r.j?.error?.message || '').slice(0, 200), undeployed: b.has_undeployed_changes, live: b.deployed_version_no, actions: (b.draft_definition.custom_action_keys || []).length, writeMods: (b.draft_definition.write_module_keys || []).length };
