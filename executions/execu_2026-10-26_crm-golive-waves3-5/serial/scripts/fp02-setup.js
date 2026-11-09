const r = await call('POST', '/iam/profiles', { name: 'QA W1 FP02 ' + (Date.now() % 100000), parent_profile_id: '11111111-1111-1111-1111-111111111102', rank: 100, is_tenant_wide: false, source_profile_id: '11111111-1111-1111-1111-111111111103', app_key: 'crm' });
const id = r.j && r.j.data && (r.j.data.profile_id || r.j.data.profileId || r.j.data.id);
await page.goto(`https://staging-crm.taviportal.com/settings/modules-and-fields/${MODS.leads}`, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(8000);
const txt = (await page.innerText('body')).replace(/\s+/g, ' ');
const links = await page.locator('a, button').evaluateAll(es => es.map(e => e.innerText.trim()).filter(t => t && t.length < 40));
return { profile: r.s, id, name: r.j && r.j.data && r.j.data.name, pageText: txt.slice(0, 500), buttons: [...new Set(links)].slice(0, 60) };
