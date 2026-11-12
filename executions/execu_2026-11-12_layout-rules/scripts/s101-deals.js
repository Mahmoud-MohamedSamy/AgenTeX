const dm = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'; const out = {}; const F = await fieldsOf(dm);
out.stage = (F.find(f => f.fieldName === 'stage') || {}).datatypeKey + ' ' + JSON.stringify(((F.find(f => f.fieldName === 'stage') || {}).datatypeOptions || {}).allowed_values || '').slice(0, 300);
out.money = F.filter(f => /amount|discount|approval|probab/i.test(f.fieldName)).map(f => f.fieldName + ':' + f.datatypeKey);
out.layouts = arr((await api('GET', '/modules/' + dm + '/layouts')).j.data).map(l => l.id + ' ' + l.name);
out.pipes = JSON.stringify((await api('GET', '/pipelines?moduleId=' + dm)).j).slice(0, 400);
return out;
