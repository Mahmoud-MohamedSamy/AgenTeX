const U = '3445ec4a-020e-4f12-b156-dd2de7610164';
const r = await call('GET', `/iam/users/${U}/profiles`); const r2 = await call('GET', `/iam/users/${U}`);
const profs = (await call('GET', '/iam/profiles')).j.data.filter(p => /owner|crm admin|desk admin/i.test(p.name)).map(p => ({ id: p.profileId || p.id, name: p.name, app: p.app_key || p.appKey }));
return { profiles: r.s + ' ' + r.t.slice(0, 900), user: r2.s + ' ' + r2.t.slice(0, 600), candidates: profs };
