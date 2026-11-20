const o = {}; const rules = (await listRules()).filter(x => x.name.startsWith(P));
for (const r of rules) { if (r.is_active) { const x = await api('PATCH', '/scoring-rules/' + r.id + '/active', { is_active: false }); o[r.name] = 'deactivated ' + x.s; LED('scoring rule "' + r.name + '" ' + r.id + ' deactivated (end of lane)'); } else o[r.name] = 'already inactive'; }
await sleep(90000);
const rr = await api('GET', '/scoring-rules/run?module_id=' + L); const d = rr.j.data; o.run = [d.status, d.reason, d.processed_count + '/' + d.total_count, 'chg ' + d.changed_count].join(' ');
for (const w of [I.wf, I.wf2]) { const g = await api('GET', '/workflow/rules/' + w); o['wf ' + w.slice(0, 8)] = g.j.data.isActive; }
for (const k of ['A', 'C', 'N', 'D', 'E', 'F', 'G', 'G2', 'H']) o['s' + k] = await score(I[k]);
return o;
