const o = {}; const C0 = (await api('GET', '/iam/tenant/company-profile')).j.data; o.orig = { website: C0.website, phone: C0.phone };
const openEdit = async () => { await page.goto(H + '/settings/organization/company', { waitUntil: 'commit', timeout: 45000 }).catch(() => {}); for (let i = 0; i < 30; i++) { await sleep(1000); const t = await txt().catch(() => ''); if (/Primary Information/.test(t)) break; } await sleep(1500); await page.getByRole('button', { name: /^Edit$/ }).first().click(); await sleep(2500); };
const save = async () => { await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(4000); };
const err = async () => (await txt()).replace(/\s+/g, ' ').match(/.{0,80}(invalid|valid|error|unexpected|failed|could not|must)[^.]{0,100}/i)?.[0] || null;
// 1 website "not a url"
await openEdit(); await page.locator('#company-website').fill('not a url'); await sleep(500);
o.urlValidity = await page.$eval('#company-website', e => e.validity.valid + ':' + e.validationMessage);
await page.screenshot({ path: SHOT + '/bugs/W1-B1-1-website-typed.png' });
await save(); await page.screenshot({ path: SHOT + '/bugs/W1-B1-2-website-after-save.png' });
o.web = { err: await err(), apiWebsite: (await api('GET', '/iam/tenant/company-profile')).j.data.website, stillEditing: await page.locator('#company-website').count() };
// 2 phone 300 digits
await openEdit(); await page.locator('#company-phone').fill('1'.repeat(300)); await sleep(500);
await page.screenshot({ path: SHOT + '/bugs/W1-B1-3-phone-typed.png' });
await save(); await page.screenshot({ path: SHOT + '/bugs/W1-B1-4-phone-after-save.png' });
o.phone = { err: await err(), apiPhoneLen: String((await api('GET', '/iam/tenant/company-profile')).j.data.phone || '').length };
// restore exact
const C1 = (await api('GET', '/iam/tenant/company-profile')).j.data;
if (C1.website !== C0.website || C1.phone !== C0.phone) { const { exists, id, updated_at, updated_by, time_zone_version, ...rest } = C1; o.restore = (await api('PUT', '/iam/tenant/company-profile', { ...rest, website: C0.website, phone: C0.phone })).s; }
const C2 = (await api('GET', '/iam/tenant/company-profile')).j.data; o.final = { website: C2.website, phone: C2.phone, access_url: C2.access_url, name: C2.name, alias: C2.alias };
return done(o);
