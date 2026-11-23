const mods = L((await api('GET', '/modules')).j?.data); const TK = mods.find(m => m.moduleKey === 'desk_tickets').id;
const tf = L((await api('GET', `/modules/${TK}/fields`)).j?.data).filter(f => /qa_fx/.test(f.fieldName)).map(f => f.fieldName);
const bps = L((await api('GET', `/modules/${TK}/blueprints?includeInactive=true`)).j?.data).filter(b => /QA FX/.test(b.name || b.definition?.name || '')).length;
const ar = await api('GET', '/desk/assignment-rules?type=direct'); const rules = (ar.j?.data?.rules || []).filter(r => /^QA FX/.test(r.name)).length;
const wf = L((await api('GET', '/workflow/rules?limit=200')).j?.data).filter(r => /^QA FX/.test(r.name)).length;
const recent = L((await api('GET', `/modules/${TK}/records?limit=50&sort_by=created_at&sort_dir=desc`)).j?.data).map(x => flat(x.data).subject).filter(s => /^QA FX/.test(s || '')).length;
let bin = 0, cur = ''; for (let i = 0; i < 60; i++) { const r = await api('GET', `/audit/recycle-bin/items?app_key=desk&limit=200${cur}`); bin += L(r.j?.data).filter(it => /^(QA FX|qafx)/i.test(it.record_label || '')).length; const n = r.j?.meta?.next_cursor; if (!n) break; cur = '&cursor=' + encodeURIComponent(n); }
log(JSON.stringify({ qaModules: mods.filter(m => /qa_fx/.test(m.moduleKey)).map(m => m.moduleKey), ticketFields: tf, ticketBlueprints: bps, assignmentRules: rules, workflowRules: wf, qaTicketsRecent: recent, binLeft: bin }));
