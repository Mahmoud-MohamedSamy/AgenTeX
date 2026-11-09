const o = {}; const MID = 'b9f87f12-8fd8-499d-a8e6-b50b092e31b3';
await page.goto(H + '/settings/modules-and-fields/' + MID, { waitUntil: 'commit', timeout: 45000 }).catch(() => {});
for (let i = 0; i < 25; i++) { await sleep(1000); if (/QA GL N/.test(await txt().catch(() => ''))) break; } await sleep(2500);
o.tabs = await page.$$eval('[role=tab]', bs => bs.filter(b => b.offsetParent).map(b => (b.innerText || '').trim()));
const fp = page.getByRole('tab', { name: /permission/i }); o.fp = await fp.count();
if (o.fp) { await fp.first().click().catch(() => {}); await sleep(5000); }
o.url = page.url(); const t = (await txt()).replace(/\s+/g, ' '); o.text = t.slice(t.indexOf('QA GL N'), t.indexOf('QA GL N') + 1500);
o.selects = await page.$$eval('select, [role=combobox]', s => s.filter(x => x.offsetParent).map(x => (x.getAttribute('aria-label') || x.name || x.innerText || '').trim().slice(0, 40)).slice(0, 20));
await page.screenshot({ path: SHOT + '/ndc/NDC-2387-2-field-perms.png' });
return done(o);
