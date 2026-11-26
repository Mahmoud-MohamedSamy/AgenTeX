const all = []; for (let skip = 0; skip < 2000; skip += 100) { const a = arr((await api.O('GET', `/workflow/rules?moduleId=${T}&take=100&skip=${skip}`)).j?.data); all.push(...a); if (a.length < 100) break; }
const D1 = 'a373cfd1-85e8-495d-af9a-1a003d2a08a3';
const need = Math.max(0, 222 - all.length); ST.WF = ST.WF || [];
const t0 = Date.now();
for (let i = 0; i < need; i++) { const r = await api.O('POST', '/workflow/rules', { moduleId: T, name: `QA RT27 list rule ${String(i + 1).padStart(3, '0')}`, isActive: false, mode: 'Recurring', trigger: { kind: 'RecordCreated' }, criteria: { kind: 'StringMatch', field: 'subject', operator: 'StartsWith', stringValue: 'QA RT27 never ', caseInsensitive: false }, actions: [{ order: 0, delaySeconds: 0, type: 'FieldUpdate', fieldUpdates: { qa_ndc_agency_code: { kind: 'string', stringValue: 'x' } } }], departmentIds: [D1] }); if (r.j?.data?.id) ST.WF.push(r.j.data.id); else { ST.wfErr = E(r); break; } }
saveState(); ledger('created ' + ST.WF.length + ' inactive QA RT27 list rules');
const after = []; for (let skip = 0; skip < 2000; skip += 100) { const a = arr((await api.O('GET', `/workflow/rules?moduleId=${T}&take=100&skip=${skip}`)).j?.data); after.push(...a); if (a.length < 100) break; }
const s = Date.now(); await api.O('GET', `/workflow/rules?moduleId=${T}&take=200&skip=0`); const apiMs = Date.now() - s;
return { before: all.length, created: ST.WF.length, err: ST.wfErr, after: after.length, active: after.filter(r => r.isActive).length, apiTake200ms: apiMs, secs: Math.round((Date.now() - t0) / 1000) };
