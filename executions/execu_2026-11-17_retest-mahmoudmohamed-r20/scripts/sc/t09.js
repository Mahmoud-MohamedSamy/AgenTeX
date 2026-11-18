const o = {};
for (const p of ['/scoring-rules/rescore?module_id=' + L, '/scoring-rules/rescore-status?module_id=' + L, '/scoring-rules/rescore/status?module_id=' + L, '/scoring-rules/run?module_id=' + L, '/scoring-rules/runs?module_id=' + L, '/scoring-rules/rescore-runs/latest?module_id=' + L, '/modules/' + L + '/scoring/rescore', '/modules/' + L + '/scoring-rules/rescore']) { const r = await api('GET', p); o[p.replace(L, 'L')] = SR(r).slice(0, 60) + (r.s === 200 ? ' ' + r.t.slice(0, 400) : ''); }
o.E = await score(I.E); o.F = await score(I.F); o.C = await score(I.C);
return o;
