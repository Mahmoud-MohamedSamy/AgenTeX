const made = JSON.parse(fs.readFileSync('../made.json', 'utf8'));
const tid = made.other.find(x => x.kind === 'team').id;
const t = (await api('GET', '/desk/teams')).j?.data?.teams?.find(x => x.id === tid);
const one = await api('GET', '/desk/teams/' + tid);
const tl = await api('GET', '/desk/email-templates');
const d = tl.j?.data;
return { sources: t.sources, teamOne: one.s + ' ' + JSON.stringify(one.j?.data || {}).slice(0, 400), tplShape: d && !Array.isArray(d) ? Object.keys(d) : 'array ' + (d || []).length, tplSample: JSON.stringify(d).slice(0, 700) };
