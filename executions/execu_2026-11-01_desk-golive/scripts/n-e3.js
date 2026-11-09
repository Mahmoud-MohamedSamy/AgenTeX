const o = {}; const C0 = (await api('GET', '/iam/tenant/company-profile')).j.data; o.orig = { website: C0.website, phone: C0.phone };
const openEdit = async () => { await page.goto(H + '/settings/organization/company', { waitUntil: 'commit', timeout: 45000 }).catch(() => {}); for (let i = 0; i < 30; i++) { await sleep(1000); const t = await txt().catch(() => ''); if (/Primary Information/.test(t)) break; } await sleep(1500); await page.getByRole('button', { name: /^Edit$/ }).first().click(); await sleep(2500); };
const saveB = () => page.getByRole('button', { name: /^Save$/ }).last();
await openEdit(); await page.locator('#company-phone').fill('1'.repeat(300)); await sleep(800);
o.phoneValue = (await page.$eval('#company-phone', e => e.value)).length; o.saveEnabled = await saveB().isEnabled();
o.fieldMsg = (await txt()).replace(/\s+/g, ' ').match(/Phone .{0,120}/)?.[0];
await page.screenshot({ path: SHOT + '/bugs/W1-B1-3-phone-typed.png' });
if (o.saveEnabled) { await saveB().click(); await sleep(5000); await page.screenshot({ path: SHOT + '/bugs/W1-B1-4-phone-after-save.png' });
  o.afterText = (await txt()).replace(/\s+/g, ' ').match(/.{0,60}(unexpected|error|failed|could not|went wrong)[^.]{0,120}/i)?.[0] || null; }
o.apiPhoneLen = String((await api('GET', '/iam/tenant/company-profile')).j.data.phone || '').length;
// 40-digit phone on screen
await openEdit(); await page.locator('#company-phone').fill('1'.repeat(40)); await sleep(800); o.save40Enabled = await saveB().isEnabled();
if (o.save40Enabled) { await saveB().click(); await sleep(5000); await page.screenshot({ path: SHOT + '/bugs/W1-B1-5-phone40-saved.png' }); }
o.apiPhone40 = String((await api('GET', '/iam/tenant/company-profile')).j.data.phone || '').length;
// API check website (server side)
const C1 = (await api('GET', '/iam/tenant/company-profile')).j.data; const { exists, id, updated_at, updated_by, time_zone_version, ...rest } = C1;
const w = await api('PUT', '/iam/tenant/company-profile', { ...rest, phone: C0.phone, website: 'not a url' }); o.apiWebsite = { s: w.s, saved: (await api('GET', '/iam/tenant/company-profile')).j.data.website };
// restore
const C2 = (await api('GET', '/iam/tenant/company-profile')).j.data; const { exists: a, id: b, updated_at: c, updated_by: d, time_zone_version: f, ...rest2 } = C2;
o.restore = (await api('PUT', '/iam/tenant/company-profile', { ...rest2, website: C0.website, phone: C0.phone })).s;
const C3 = (await api('GET', '/iam/tenant/company-profile')).j.data; o.final = { website: C3.website, phone: C3.phone, access_url: C3.access_url, name: C3.name, alias: C3.alias, logo: !!C3.logo_url };
await openEdit().catch(() => {}); await page.getByRole('button', { name: /^Cancel$/ }).first().click().catch(() => {});
return done(o);
