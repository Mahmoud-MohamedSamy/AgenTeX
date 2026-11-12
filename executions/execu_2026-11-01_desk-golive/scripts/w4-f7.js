const l = arr(D((await api('GET', '/web-forms')).j));
out.list = l.map(f => f.id + ' | ' + f.kind + ' | ' + f.name + ' | ' + f.department_id.slice(0, 8) + ' | ' + f.is_enabled + ' | ' + (f.definition && f.definition.fields || []).map(x => x.key).join(','));
out.limits = JSON.stringify(D((await api('GET', '/web-forms/limits')).j));
out.url = page.url();
return fin({ out });
