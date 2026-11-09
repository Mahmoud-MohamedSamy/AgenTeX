const S = x => ({ s: x.s, e: x.j && x.j.error ? (x.j.error.code + ': ' + String(x.j.error.message).slice(0, 140)) : undefined });
const o = {}; const g = (await api('GET', '/iam/tenant/company-profile')).j.data; const b = { ...g }; for (const k of ['id', 'exists', 'created_at', 'updated_at', 'updated_by']) delete b[k];
o.phone300 = S(await api('PUT', '/iam/tenant/company-profile', { ...b, phone: '1'.repeat(300) }));
o.phone40 = S(await api('PUT', '/iam/tenant/company-profile', { ...b, phone: '1'.repeat(40) }));
const now = (await api('GET', '/iam/tenant/company-profile')).j.data;
if (now.phone !== g.phone || now.access_url !== g.access_url || now.website !== g.website) { o.restore = S(await api('PUT', '/iam/tenant/company-profile', b)); }
const fin = (await api('GET', '/iam/tenant/company-profile')).j.data; o.final = { phone: fin.phone, access_url: fin.access_url, website: fin.website, name: fin.name, tz: fin.time_zone };
await page.goto(H + '/settings/organization/company', { waitUntil: 'commit', timeout: 60000 }); for (let i = 0; i < 25; i++) { await sleep(1000); if ((await txt()).includes('Anyware')) break; }
o.shot = await shot('wave1/W1-04-company-page');
return done(o);
