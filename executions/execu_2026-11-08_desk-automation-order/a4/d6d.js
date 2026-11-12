const o = JSON.parse(fs.readFileSync('../a4/d6.json')); const M = o.module; const R = {};
const f = arr((await api('GET', `/modules/${M}/fields?take=200`)).j?.data); const ca = f.find(x => x.apiName === 'created_at');
R.createdAtDeletable = ca.isDeletable; const del = await api('DELETE', `/modules/${M}/fields/${ca.id}`); R.deleteCreatedAt = del.s + ' ' + del.t.slice(0, 160);
const base = { moduleId: M, name: 'QA AO WF D6 api', isActive: false, mode: 'Recurring', actions: [{ order: 0, delaySeconds: 0, type: 'Webhook', method: 'POST', url: 'https://example.com/x', bodyTemplate: '{}', headers: {}, timeoutSeconds: 5 }] };
for (const fld of ['name', 'nope_field']) { const r = await api('POST', '/workflow/rules', { ...base, trigger: { kind: 'DateFieldRelative', dateFieldName: fld, offsetSeconds: -3600, offsetMode: 'wall_clock' } }); R['dateTrigger_' + fld] = r.s + ' ' + (r.j?.error?.message || '') + ' ' + JSON.stringify(r.j?.error?.details || '').slice(0, 160); if (r.j?.data?.id) R['del_' + fld] = (await api('DELETE', '/workflow/rules/' + r.j.data.id)).s; }
let d = await api('DELETE', `/modules/${M}?cascade=true`); R.delModule = d.s; if (d.s >= 300) { d = await api('DELETE', `/modules/${M}`); R.delModule2 = d.s + ' ' + d.t.slice(0, 150); }
R.after = (await api('GET', `/modules/${M}`)).s; R.listed = arr((await api('GET', '/modules?page=1&page_size=200')).j?.data).filter(x => x.moduleKey === 'qa_ao_wf_d6').map(x => x.status);
log(JSON.stringify(R, null, 1));
