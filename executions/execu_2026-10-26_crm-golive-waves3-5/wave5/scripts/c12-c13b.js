const T = '797ad4d2-9724-4c60-b8dd-f3c6aab1b6fc', F = '0e8845b4-1feb-4db9-8d32-9fbd9444538e', out = {}, made = {};
const lm = await call('POST', `/teamspaces/${T}/folders/${F}/modules`, { moduleIds: ['bb375218-6a5d-48ec-a832-fb062fd0311b'] }); out.linkModule = lm.s + ' ' + lm.t.slice(0, 200);
const fl = await call('GET', `/teamspaces/${T}/folders`); out.folders = fl.s + ' ' + fl.t.slice(0, 400);
const dupF = await call('POST', `/teamspaces/${T}/folders`, { name: 'QA W5 Folder' }); out.duplicateFolderAgain = dupF.s + ' ' + dupF.t.slice(0, 160); if (dupF.s < 300) made.folder2 = dupF.j.data.id;
const dupT = await call('POST', '/teamspaces', { name: 'QA W5 Teamspace' }); out.duplicateTeamspace = dupT.s + ' ' + dupT.t.slice(0, 160); if (dupT.s < 300) made.ts2 = dupT.j.data.id;
for (const b of [{ key: 'qa_w5_dt', label: 'QA W5 Data type', base_datatype_key: 'single_line' }, { Key: 'qa_w5_dt', Label: 'QA W5 Data type', BaseDatatypeKey: 'single_line' }, { key: 'qa_w5_dt', label: { en: 'QA W5 Data type' }, baseDatatypeKey: 'single_line' }]) { const dt = await call('POST', '/custom-datatypes', b); out['datatype ' + Object.keys(b).join(',')] = dt.s + ' ' + dt.t.slice(0, 220); if (dt.s < 300) { made.datatype = dt.j.data.id || dt.j.data.key; break; } }
out.inCatalog = (await call('GET', '/fields/datatypes')).j.data.some(d => d.key === 'qa_w5_dt');
out.made = made; return out;
