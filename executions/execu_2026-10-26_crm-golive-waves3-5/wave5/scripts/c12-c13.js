const out = {}, made = {};
const ts = await call('POST', '/teamspaces', { name: 'QA W5 Teamspace', description: 'QA W5 lane C, deleted after the run', accessMode: 'selected' }); out.teamspace = ts.s + ' ' + (ts.s < 300 ? JSON.stringify(ts.j.data).slice(0, 250) : ts.t.slice(0, 250));
if (ts.s < 300) { const T = ts.j.data.id; made.teamspace = T;
  const f = await call('POST', `/teamspaces/${T}/folders`, { name: 'QA W5 Folder' }); out.folder = f.s + ' ' + (f.s < 300 ? '' : f.t.slice(0, 250));
  if (f.s < 300) { const F = f.j.data.id; made.folder = F;
    const lm = await call('POST', `/teamspaces/${T}/folders/${F}/modules`, { moduleId: 'bb375218-6a5d-48ec-a832-fb062fd0311b' }); out.linkModule = lm.s + ' ' + lm.t.slice(0, 250);
    const ff = await call('GET', `/teamspaces/${T}/folders/${F}`); out.folderRead = ff.s + ' ' + ff.t.slice(0, 300);
    const dupF = await call('POST', `/teamspaces/${T}/folders`, { name: 'QA W5 Folder' }); out.duplicateFolder = dupF.s + ' ' + dupF.t.slice(0, 160); if (dupF.s < 300) made.folder2 = dupF.j.data.id; } }
const dt = await call('POST', '/custom-datatypes', { key: 'qa_w5_dt', label: 'QA W5 Data type', baseDatatypeKey: 'single_line', description: 'QA W5' }); out.customDatatype = dt.s + ' ' + (dt.s < 300 ? JSON.stringify(dt.j.data).slice(0, 250) : dt.t.slice(0, 250)); if (dt.s < 300) made.datatype = dt.j.data.id || 'qa_w5_dt';
const inCatalog = (await call('GET', '/fields/datatypes')).j.data.some(d => d.key === 'qa_w5_dt'); out.inCatalog = inCatalog;
const dupDt = await call('POST', '/custom-datatypes', { key: 'qa_w5_dt', label: 'QA W5 Data type', baseDatatypeKey: 'single_line' }); out.duplicateDatatype = dupDt.s + ' ' + dupDt.t.slice(0, 160);
out.made = made; return out;
