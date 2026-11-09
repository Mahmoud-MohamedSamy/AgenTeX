const M = 'bb375218-6a5d-48ec-a832-fb062fd0311b', LB = 'f0bf4593-f455-4cee-8230-2e7c1b3d09d9';
const d = (await call('GET', `/modules/${M}/layouts/${LB}`)).j.data; const c = {}; for (const [k, v] of Object.entries(d)) if (k !== 'views') c[k] = v;
const acc = (await call('GET', `/modules/${M}/layouts/accessible`)).j.data;
return { layout: c, accessible: acc.map(a => a.name + ':' + a.access_mode) };
