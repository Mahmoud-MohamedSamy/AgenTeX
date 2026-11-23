const mods = L((await api('GET', '/modules')).j?.data); const out = {};
out.qaModules = mods.filter(m => /qa_fx/.test(m.moduleKey || '')).map(m => m.moduleKey);
for (const k of ['leads', 'contacts', 'accounts']) { const m = mods.find(x => x.moduleKey === k); out[k + 'Fields'] = L((await api('GET', `/modules/${m.id}/fields`)).j?.data).filter(f => /qa_fx/.test(f.fieldName)).map(f => f.fieldName); }
out.leadsRecord = (await api('GET', `/modules/${mods.find(x => x.moduleKey === 'leads').id}/records/662cf0f9-661b-4d51-bb89-df00214a8e66`)).s;
out.workflowRules = L((await api('GET', '/workflow/rules?limit=200')).j?.data).filter(r => /^QA FX/.test(r.name)).map(r => r.name);
out.tpl = L((await api('GET', '/mail/templates')).j?.data).filter(t => /^QA FX/.test(t.name)).length;
const bin = []; let cur = ''; for (let i = 0; i < 60; i++) { const r = await api('GET', `/audit/recycle-bin/items?app_key=crm&app_key=desk&app_key=iam&app_key=workflow&app_key=mail&limit=200${cur}`); for (const it of L(r.j?.data)) if (/^(QA FX|qafx)/i.test(it.record_label || '') || [made.mod, made.child].includes(it.module_id)) bin.push(it); const n = r.j?.meta?.next_cursor; if (!n) break; cur = '&cursor=' + encodeURIComponent(n); }
out.binLeft = bin.length; out.binSample = bin.slice(0, 5).map(b => b.record_label + ' / ' + (b.module_name || b.module_id));
if (bin.length) { let ok = 0, bad = []; for (let i = 0; i < bin.length; i += 25) { const r = await api('POST', '/audit/recycle-bin/delete', { ids: bin.slice(i, i + 25).map(b => b.id) }); if (r.s < 300) ok += Math.min(25, bin.length - i); else bad.push(E(r).slice(0, 200)); } out.binPurgedNow = ok; out.binPurgeErrors = bad.slice(0, 2); }
log(JSON.stringify(out, null, 1));
