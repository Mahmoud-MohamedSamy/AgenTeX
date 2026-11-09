const o = {}; const S = x => ({ s: x.s, e: x.j && x.j.error ? (x.j.error.code + ': ' + String(x.j.error.message).slice(0, 140)) : undefined });
const c = await api('POST', '/desk/departments', { name: 'QA GL N Dept', visibility: 'private', description: 'QA GL N go-live test, delete after' }); o.create = S(c); o.id = c.j && c.j.data && c.j.data.id;
// W1-20 list
await page.goto(H + '/settings/organization/departments', { waitUntil: 'commit', timeout: 45000 }).catch(() => {}); let t = ''; for (let i = 0; i < 25; i++) { await sleep(1000); t = await txt().catch(() => ''); if (/QA GL N Dept/.test(t)) break; } await sleep(2000);
o.listShot = await shot('ndc/W1-20-dept-list'); o.listText = t.replace(/\s+/g, ' ').slice(t.indexOf('Departments') > 0 ? 0 : 0).slice(-900);
// form controls
await page.goto(H + '/settings/organization/departments/' + o.id, { waitUntil: 'commit', timeout: 45000 }).catch(() => {}); for (let i = 0; i < 25; i++) { await sleep(1000); t = await txt().catch(() => ''); if (/QA GL N Dept/.test(t) && t.length > 800) break; } await sleep(2000);
o.formShot = await shot('ndc/W1-22-dept-form'); o.url = page.url().replace(H, '');
o.controls = await page.$$eval('button, [role=switch], input, textarea, label', els => els.filter(e => e.offsetParent !== null).map(e => (e.tagName + '|' + (e.getAttribute('role') || e.type || '') + '|' + (e.getAttribute('aria-label') || e.getAttribute('name') || e.id || '') + '|' + (e.getAttribute('aria-checked') || (e.checked !== undefined ? e.checked : '')) + '|' + (e.innerText || e.value || '').trim().slice(0, 40))).slice(0, 80));
return done(o);
