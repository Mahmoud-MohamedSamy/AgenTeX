// Round 9 cleanup on Anyware — deletes ONLY the exact ids in ../cleanup-ids.json (built from ledger.md + read-only inventory).
// Order: processes off + deleted → web form / report / draft → records → QA module records + modules → Desk contact. Recycle bin is NOT purged.
const P = JSON.parse(process.env.CLEAN_IDS); const res = {}; const add = (k, v) => (res[k] = res[k] || []).push(v);
for (const x of P.rules) { await api('o', 'POST', `/workflow/rules/${x.id}/deactivate`); add('workflowRules', (await api('o', 'DELETE', `/workflow/rules/${x.id}`)).s); }
for (const x of P.approvals) { await api('o', 'PATCH', `/workflow/approval-processes/${x.id}/active`, { isActive: false }); add('approvals', (await api('o', 'DELETE', `/workflow/approval-processes/${x.id}`)).s); }
for (const x of P.reviews) { await api('o', 'PATCH', `/workflow/review-processes/${x.id}/active`, { isActive: false, pendingAction: 'reject_all' }); add('reviews', (await api('o', 'DELETE', `/workflow/review-processes/${x.id}`)).s); }
for (const x of P.assign) { const cur = (await api('o', 'GET', `/workflow/assignment-rules/${x.id}`)).j?.data; if (cur?.isActive) await api('o', 'PATCH', `/workflow/assignment-rules/${x.id}`, { ...cur, isActive: false }); add('assignmentRules', (await api('o', 'DELETE', `/workflow/assignment-rules/${x.id}`)).s); }
for (const x of P.blueprints) { const m = x.module; const cur = (await api('o', 'GET', `/modules/${m}/blueprints/${x.id}`)).j?.data; if (cur?.isActive) await api('o', 'PUT', `/modules/${m}/blueprints/${x.id}`, { isActive: false, definition: cur.definition }); add('blueprints', (await api('o', 'DELETE', `/modules/${m}/blueprints/${x.id}`)).s); }
for (const x of P.webForms) { let s; for (let i = 0; i < 3; i++) { s = (await api('o', 'DELETE', `/web-forms/${x.id}`)).s; if (s < 300 || s === 404) break; await sleep(5000); } add('webForms', s); }
for (const x of P.reports) { let r = await api('o', 'DELETE', `/reporting/reports/${x.id}?expected_revision=1`); if (r.s >= 400) { const rev = (await api('o', 'GET', `/reporting/reports/${x.id}`)).j?.data?.data?.revision; r = await api('o', 'DELETE', `/reporting/reports/${x.id}?expected_revision=${rev}`); } add('reports', r.s); }
for (const x of P.drafts) add('mailDrafts', (await api('o', 'DELETE', `/mail/drafts/${x.id}`)).s);
const MID = { LEADS: T.LEADS, TASKS: T.TASKS, CONTACTS: T.CONTACTS };
for (const x of P.records) add('records', (await api('o', 'DELETE', `/modules/${x.mid || MID[x.m]}/records/${x.id}`)).s);
for (const x of P.moduleRecords) add('qaModuleRecords', (await api('o', 'DELETE', `/modules/${x.mid}/records/${x.id}`)).s);
for (const x of P.modules) add('qaModules', (await api('o', 'DELETE', `/modules/${x.id}?cascade=true`)).s);
for (const x of P.deskContacts) add('deskContacts', (await api('o', 'DELETE', `desk:/modules/0bbb599e-013b-4465-a41e-85a324a4e3ac/records/${x.id}`)).s);
const sum = Object.fromEntries(Object.entries(res).map(([k, v]) => [k, v.reduce((m, s) => (m[s] = (m[s] || 0) + 1, m), {})]));
return sum;
