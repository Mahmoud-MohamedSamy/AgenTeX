// NDC-2796/2801 setup: assign QA NDC ADM to department QA NDC Accounting and make it the department default (backup first)
const fs = require('fs'); const o = {}; const ADM = 'd1e6505d-ad05-45d0-bd8a-8f3f1eca96cb', ACC = 'c0e05c3e-aa51-47ef-be50-53fd4c6edcb1';
const g = await api('o', 'GET', `desk:/modules/${X.TK}/layouts/${ADM}`); const L = g.j.data;
fs.writeFileSync('../2796-adm-layout-backup.json', JSON.stringify(L));
o.before = { dept: L.departmentIds, def: L.defaultDepartmentIds, rv: L.rowVersion };
const body = { ...L, departmentIds: [ACC], defaultDepartmentIds: [ACC] };
const p = await api('o', 'PUT', `desk:/modules/${X.TK}/layouts/${ADM}`, body); o.put = X.err(p) + ' ' + (p.j?.error?.details ? JSON.stringify(p.j.error.details).slice(0, 300) : '');
if (p.s < 300) ledger('NDC-2796: layout QA NDC ADM departmentIds [] -> [QA NDC Accounting], default [QA NDC Accounting] (backup ../2796-adm-layout-backup.json)');
const a = (await api('o', 'GET', `desk:/modules/${X.TK}/layouts/${ADM}`)).j.data; o.after = { dept: a.departmentIds, def: a.defaultDepartmentIds };
const acc = (await api('o', 'GET', `desk:/modules/${X.TK}/layouts/0dabc9a3-c7f2-4f74-bd1b-9e21373a6c06`)).j.data; o.accLayout = { dept: acc.departmentIds, def: acc.defaultDepartmentIds };
return o;
