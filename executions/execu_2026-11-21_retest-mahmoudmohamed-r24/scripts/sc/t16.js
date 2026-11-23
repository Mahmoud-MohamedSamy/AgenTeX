const r = await api('GET', '/modules/' + L + '/records?q=QA%20RT20%20SC&per_page=20');
return arr(r.j.data).map(x => { const d = x.data || []; const g = k => { const e = d.find(y => y.field === k); return e && e.value && e.value.value; }; return g('last_name') + ':' + g('score') + ' mod ' + (x.updated_at || x.last_modified_at || g('modified_at') || '').toString().slice(11, 19); });
