const res = [];
const acts = await call('GET', '/workflow/custom-actions?take=200');
const al = (acts.j && (Array.isArray(acts.j.data) ? acts.j.data : acts.j.data && acts.j.data.items)) || [];
for (const a of al) if (/^QA W3/.test(a.name || a.displayName || '')) res.push('action ' + (a.name || a.displayName) + ' runs ' + (await call('GET', `/workflow/custom-actions/runs?actionId=${a.id}&take=5`)).s + ' delete -> ' + (await call('DELETE', `/workflow/custom-actions/${a.id}`)).s);
const src = await call('GET', '/workflow/custom-actions/sources?take=200');
const sl = (src.j && (Array.isArray(src.j.data) ? src.j.data : src.j.data && src.j.data.items)) || [];
for (const s of sl) if (/QA W3/.test(JSON.stringify(s).slice(0, 400))) res.push('source ' + (s.name || s.title) + ' delete -> ' + (await call('DELETE', `/workflow/custom-actions/sources/${s.id}`)).s + ' ' + '');
res.push('left actions: ' + ((await call('GET', '/workflow/custom-actions?take=200')).t.match(/QA W3[^"]*/g) || []).join(','));
return res;
