const f = arr(D((await api('GET', '/modules/' + TM + '/fields?limit=300')).j)); out.lk = f.filter(x => /contact|account/i.test((x.api_name||x.name)+(x.label||''))).map(x => (x.api_name||x.name)+':'+(x.type||x.data_type)+':'+JSON.stringify(x.lookup||x.options||x.settings||'').slice(0,80));
const c = await mk(CM, 'contact', 'QA GL TM contact', { first_name: 'QA GL TM', last_name: 'Contact', email: 'qa-gl-tm-c1@example.com' }); out.c = c;
const m = await api('POST', '/desk/macros', { name: 'QA GL TM macro', department_id: MK, actions: [{ kind: 'add_comment', content_html: '<p>QA GL TM macro comment</p>' }] }); out.macro = m.s + ' ' + m.t.slice(0, 250); const mid = m.j && m.j.data && m.j.data.id; if (mid) CREATED.push({ kind: 'macro', id: mid, name: 'QA GL TM macro' });
return fin({ out });
