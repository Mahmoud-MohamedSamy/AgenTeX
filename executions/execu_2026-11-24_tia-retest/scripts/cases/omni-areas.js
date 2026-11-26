const a = arr((await api('GET', '/agents/tia-setup-areas')).j?.data);
const by = k => a.filter(x => x.app === k).map(x => x.title + (x.read_only ? ' (ro)' : '')).join('; ');
const m = arr((await api('GET', '/modules?app=' + (process.env.APPKEY || process.env.APP))).j?.data).map(x => x.name || x.label || x.api_name);
return { salesiq: by('salesiq'), desk: by('desk'), modules: m.slice(0, 60) };
