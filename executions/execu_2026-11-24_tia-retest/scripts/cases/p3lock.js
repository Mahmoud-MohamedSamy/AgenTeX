const IDF = RUN + '/out/p3-ids.json'; const I = JSON.parse(fs.readFileSync(IDF, 'utf8')); const o = {};
const c = { field: 'first_name', operator: 'starts_with', value: 'QA TIA P3 Lock' };
for (const cond of [{ conditions: [c] }, { conditions: [c, { field: 'last_name', operator: 'equals', value: 'Lead' }], pattern: '1 AND 2' }, { filters: [c] }]) { const r = await api('POST', `/modules/${M.leads}/record-locks`, { name: 'QA TIA P3 Lock', condition: cond }); o[JSON.stringify(cond).slice(0, 50)] = r.s + ' ' + (r.t || '').slice(0, 160); if (r.s < 300) { I.lock = r.j?.data?.id; ledger(`P3: record lock ${I.lock} — delete in R`); break; } }
fs.writeFileSync(IDF, JSON.stringify(I, null, 1));
if (I.lock) { const p = await api('PUT', `/modules/${M.leads}/records/${I.leadLock}`, { data: [{ field: 'company', value: { kind: 'string', value: 'QA P3 Lock Co 2' } }] }); o.ownerEditLocked = p.s + ' ' + (p.t || '').slice(0, 160); }
return o;
