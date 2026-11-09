const E = '3d7e0fb3-f9e0-4b4f-964b-698be1d1da70';
const a = await call('GET', `/mail/emails/${E}`); const t = await call('GET', `/mail/emails/${E}/tracking`); const th = await call('GET', `/mail/emails/${E}/thread`);
const d = a.j && a.j.data || {}; const pick = {}; for (const k of Object.keys(d)) if (!/html|body/.test(k)) pick[k] = d[k];
return { email: a.s + ' ' + JSON.stringify(pick).slice(0, 1800), tracking: t.s + ' ' + t.t.slice(0, 400), thread: th.s + ' ' + th.t.slice(0, 300) };
