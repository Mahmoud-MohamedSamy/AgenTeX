const mods = arr((await api.O('GET', '/modules?app_key=desk')).j?.data?.modules || (await api.O('GET', '/modules?app_key=desk')).j?.data);
const out = { names: mods.map(m => m.moduleKey + '/' + m.apiName).join(' | ') };
const te = mods.find(m => /time/i.test(m.moduleKey + m.apiName));
if (te) { const r = await api.O('GET', `/modules/${te.id}/records?page_size=200`); const rows = arr(r.j?.data?.records || r.j?.data?.items || r.j?.data); out.te = te.moduleKey + ' records=' + r.s + ' n=' + rows.length; out.hasQA = rows.some(x => JSON.stringify(x).includes('QA TT')); out.sample = short(rows[0], 300); }
return out;
