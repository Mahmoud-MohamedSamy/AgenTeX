const fl = await fieldsOf(L);
const pick = ['company','no_of_employees','annual_revenue','lead_status','rating','industry','lead_source','email','city','title'];
const o = {}; for (const k of pick) { const f = fl.find(x => x.fieldName === k); o[k] = f ? f.datatypeKey + ' ' + JSON.stringify((f.datatypeOptions && f.datatypeOptions.allowed_values) || (f.config && f.config.allowed_values) || '').slice(0, 300) : 'none'; }
o.numeric = fl.filter(x => /number|integer|currency|decimal|percent/.test(x.datatypeKey)).map(x => x.fieldName + ':' + x.datatypeKey).join(', ');
const v = await api('GET', '/modules/' + L + '/views'); o.views = v.s + ' ' + v.t.slice(0, 700);
return o;
