const fl = arr((await api('o', 'GET', `/modules/${T.LEADS}/fields`)).j?.data);
const pls = fl.filter(x => /pick_list/.test(x.datatypeKey || x.dataType || ''));
const f = pls.find(x => (x.apiName || x.api_name) === 'lead_source');
return { picklists: pls.map(x => x.apiName || x.api_name), sample: JSON.stringify(f).slice(0, 1500) };
