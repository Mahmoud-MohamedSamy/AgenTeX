const row = page.getByText('QA W1 FP02 80068', { exact: true }).locator('xpath=ancestor::*[.//input[@type="checkbox"] or .//*[@role="checkbox"]][1]');
await row.locator('input[type=checkbox], [role=checkbox]').nth(1).click(); await page.waitForTimeout(2500);
const pid = '33279398-919f-43d9-9968-ddf89c75787d';
const fpAfterTick = (await call('GET', `/modules/${MODS.leads}/field-permissions`)).j.data.filter(x => x.profileId === pid).map(x => x.id + '|' + x.fieldName + '=' + x.permission);
await page.getByRole('button', { name: 'Cancel', exact: true }).first().click().catch(() => {}); await page.waitForTimeout(1500);
const cancelTop = page.getByRole('button', { name: 'Cancel', exact: true }).first(); await cancelTop.click().catch(() => {}); await page.waitForTimeout(2000);
const discard = page.getByRole('button', { name: /discard|leave/i }).first(); if (await discard.isVisible().catch(() => false)) await discard.click();
await page.waitForTimeout(2000);
const out = { fpAfterTick, url: page.url() };
for (const x of (await call('GET', `/modules/${MODS.leads}/field-permissions`)).j.data.filter(x => x.profileId === pid)) out['delFp_' + x.fieldName] = (await call('DELETE', `/modules/${MODS.leads}/field-permissions/${x.id}`)).s;
const profs = (await call('GET', '/iam/profiles')).j.data.filter(p => /^QA W1 FP02|^QA W2 Import FP/.test(p.name));
for (const p of profs) { const id = p.profileId || p.id;
  for (const x of (await call('GET', `/modules/${MODS.leads}/field-permissions`)).j.data.filter(f => f.profileId === id)) await call('DELETE', `/modules/${MODS.leads}/field-permissions/${x.id}`);
  out['delProfile ' + p.name] = (await call('DELETE', `/iam/profiles/${id}`)).s; }
out.qaProfilesLeft = (await call('GET', '/iam/profiles')).j.data.filter(p => /^QA W/.test(p.name)).map(p => p.name);
return out;
