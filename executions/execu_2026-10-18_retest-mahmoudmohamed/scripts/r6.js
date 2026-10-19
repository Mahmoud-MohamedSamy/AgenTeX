const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const out = {};
const p = await api('POST', '/modules/' + L + '/views', { name: 'QA RT review-gate', kind: 'list', visibility: 'private', settings: { criteria: { conditions: [{ field: 'review_status', operator: 'equals', value: 'approved' }] } } });
out.post = p.s + ' ' + p.t.slice(0, 300);
const id = p.j && p.j.data && (p.j.data.id || (p.j.data.view && p.j.data.view.id)); out.id = id;
if (id) { const g = await api('GET', '/modules/' + L + '/views/' + id); out.storedCriteria = JSON.stringify(g.j && g.j.data && (g.j.data.settings || g.j.data.view && g.j.data.view.settings) || g.t).slice(0, 300);
  const r = await api('GET', '/modules/' + L + '/records?view_id=' + id + '&page=1&per_page=50'); out.viewRecords = r.s + ':' + arr(r.j && r.j.data).length; }
return done(out);
