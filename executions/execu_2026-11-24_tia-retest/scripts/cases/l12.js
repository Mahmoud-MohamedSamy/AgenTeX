const p = (await api('GET', '/ai/policy')).j?.data; const d = p?.descriptor || {};
const find = (o, pre = '') => Object.entries(o || {}).flatMap(([k, v]) => v && typeof v === 'object' && !Array.isArray(v) ? find(v, pre + k + '.') : [pre + k]);
const keys = find(d); return { version: p?.version, langKeys: keys.filter(k => /lang|locale/i.test(k)), topKeys: Object.keys(d), featureKeys: Object.keys(d.features || {}) };
