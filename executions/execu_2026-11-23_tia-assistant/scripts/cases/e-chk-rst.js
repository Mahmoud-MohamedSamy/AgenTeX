const caps = (await api('GET', '/agents/tia/capabilities')).j?.data; const labels = (caps?.tools || []).map(t => t.label);
const r3 = await ask('Run the report that shows tickets by status and give me the numbers.');
const r4 = await ask('Search everything for "QA TIA T2" and tell me what you find.');
const r17 = await ask('Which helpdesk products compete with this one? Name three.');
fs.writeFileSync(RUN + '/out/e-rst.json', JSON.stringify({ labels, r3, r4, r17 }, null, 1));
return { hasRunReport: labels.includes('Run a report'), hasSearch: labels.includes('Search everything'), r3: short(r3), r4: short(r4), r17: short(r17) };
