const o = {}; const B = JSON.parse(fs.readFileSync(RUN + '/out/p3-baseline.json', 'utf8'));
const a = await getAgent(); const def = JSON.parse(JSON.stringify(a.draft_definition)); def.use_desk_articles = true;
const put = await api('PUT', `/agents/${a.id}/draft`, { name: a.name, description: a.description, definition: def, expected_updated_at: a.updated_at }); const dep = await api('POST', `/agents/${a.id}/deploy`, {}); ledger(`P3 D-01: use_desk_articles=true deployed (${put.s}/${dep.s}) — restore`); o.set = put.s + '/' + dep.s + ' ' + (dep.j?.error?.code || '');
await sleep(8000);
for (const app of ['desk', 'crm']) { const r = await ask('According to our knowledge base, what is the QA TIA P3 refund window?', { page: { app } }); o[app] = { text: tiaText(r).slice(0, 300), citations: JSON.stringify(r.final?.citations || null).slice(0, 300) }; }
const a2 = await getAgent(); const put2 = await api('PUT', `/agents/${a2.id}/draft`, { name: a2.name, description: a2.description, definition: B.agent.def, expected_updated_at: a2.updated_at }); const dep2 = await api('POST', `/agents/${a2.id}/deploy`, {}); const a3 = await getAgent();
o.restored = put2.s + '/' + dep2.s + ' same=' + (JSON.stringify(a3.draft_definition) === JSON.stringify(B.agent.def)) + ' ver=' + a3.deployed_version_no; ledger('P3 D-01: restored ' + o.restored);
p3rec('D-01b', '?', JSON.stringify(o).slice(0, 1200)); return o;
