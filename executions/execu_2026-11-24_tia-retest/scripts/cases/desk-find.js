const o = {};
const mods = arr((await api('GET', '/modules')).j?.data); o.mods = mods.map(m => (m.api_name || m.apiName || m.name) + '=' + m.id).filter(x => /contact|account|task|call|article|kb/i.test(x)).slice(0, 20);
for (const p of ['/kb/sections', '/kb/categories', '/kb/articles', '/knowledge-base/sections', '/knowledge-base/articles', '/desk/kb/sections', '/desk/kb/articles', '/help-center/sections', '/articles']) { const r = await api('GET', p + '?limit=100'); o[p] = r.s + ' ' + (r.s === 200 ? arr(r.j?.data).filter(x => JSON.stringify(x).includes('QA TIA CRUD')).map(x => x.id + ':' + (x.name || x.title)).join(',') : ''); }
return o;
