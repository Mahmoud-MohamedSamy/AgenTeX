const made = JSON.parse(fs.readFileSync(RUN + '/zoho/made.json', 'utf8')); const out = [];
const leads = await zf('GET', '/crm/v8/Leads/search?word=QA%20FX%20Zoho'); const lids = (leads.j?.data || []).map(x => x.id); if (lids.length) out.push('leads ' + (await zf('DELETE', `/crm/v8/Leads?ids=${lids.join(',')}`)).s + ' (' + lids.length + ')');
for (const id of made.fx || []) out.push('fx ' + (await zf('DELETE', `/crm/v8/settings/fields/${id}?module=Leads`)).s);
for (const [t, v] of Object.entries(made.inputs || {})) { const d = await zf('DELETE', `/crm/v8/settings/fields/${v.id}?module=Leads`); out.push(t + ' ' + d.s + (d.s >= 300 ? ' ' + d.t.slice(0, 120) : '')); }
if (made.acc) out.push('account ' + (await zf('DELETE', `/crm/v8/Accounts?ids=${made.acc}`)).s);
const fl = (await zf('GET', '/crm/v8/settings/fields?module=Leads')).j.fields; const left = fl.filter(f => /^QA FX/i.test(f.field_label)).map(f => f.field_label);
const mods = (await zf('GET', '/crm/v8/settings/modules')).j.modules.filter(m => /QA FX/i.test(m.plural_label || '')).map(m => m.plural_label + ' ' + m.api_name + ' ' + m.id);
log(out.join(' | ')); log('QA FX fields left on Leads:', left.length, left.join(', ')); log('QA FX modules left:', mods);
