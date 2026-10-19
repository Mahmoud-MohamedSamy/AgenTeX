const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const out = {};
const fr = await api('GET', '/modules/' + L + '/records?page=1&per_page=50&filters=' + encodeURIComponent(JSON.stringify([{ field: 'review_status', operator: 'equals', value: 'approved' }])));
const ids = arr(fr.j && fr.j.data).map(r => r.id); out.approvedIds = ids;
const one = await api('GET', '/modules/' + L + '/records/' + ids[0]);
const raw = one.t; const hits = []; let i = -1; while ((i = raw.toLowerCase().indexOf('review', i + 1)) >= 0 && hits.length < 6) hits.push(raw.slice(Math.max(0, i - 60), i + 90));
out.singleStatus = one.s; out.reviewMentionsInRecord = hits;
for (const v of ['pending', 'rejected', 'not_submitted', 'in_review']) { const r = await api('GET', '/modules/' + L + '/records?page=1&per_page=50&filters=' + encodeURIComponent(JSON.stringify([{ field: 'review_status', operator: 'equals', value: v }]))); out['n_' + v] = r.s + ':' + arr(r.j && r.j.data).length; }
return done(out);
