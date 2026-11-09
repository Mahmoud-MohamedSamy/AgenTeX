const o = {}; const id = '0d3c1585-5df2-40c2-894c-752cbdaead08';
// keyboard toggle on department form
await page.goto(H + '/settings/organization/departments/' + id, { waitUntil: 'commit', timeout: 45000 }); for (let i = 0; i < 25; i++) { await sleep(1000); if ((await txt()).includes('Display in Help Center')) break; } await sleep(2000);
const sw = page.locator('input[type=checkbox]').first(); o.swNames = await page.$$eval('input[type=checkbox]', es => es.slice(0, 3).map(e => ({ al: e.getAttribute('aria-label'), alb: e.getAttribute('aria-labelledby'), id: e.id, lab: e.id ? !!document.querySelector('label[for="' + e.id + '"]') : false })));
await sw.check({ force: true }).catch(e => o.checkErr = String(e.message).slice(0, 80)); await sleep(800); o.afterCheck = await sw.isChecked();
const save = page.getByRole('button', { name: /^Save/ }).first(); o.saveEnabled = await save.isEnabled().catch(() => false);
if (o.saveEnabled) { await save.click(); await sleep(6000); o.vis = (await api('GET', '/desk/departments/' + id)).j.data.visibility; }
// Arabic / RTL
try { await page.evaluate(() => { localStorage.setItem('anyware_language', 'ar'); }); } catch (e) { }
const ar = {};
for (const u of ['/settings/organization/departments', '/settings/organization/business-hours', '/settings/organization/holidays', '/settings/users-control/teams', '/settings/users-control/ticket-access']) {
  await page.goto(H + u, { waitUntil: 'commit', timeout: 45000 }); let t = ''; for (let i = 0; i < 25; i++) { await sleep(1000); t = await txt(); if (t.length > 500) break; } await sleep(2000); t = await txt();
  const dir = await page.evaluate(() => document.documentElement.dir || getComputedStyle(document.body).direction);
  const latinLines = t.split('\n').map(s => s.trim()).filter(s => s.length > 12 && /^[A-Za-z][A-Za-z ,.'()-]+$/.test(s) && !/QA GL|techSupport|Call Center|DAR Review|Tech|Eslam|Africa|anyware|Mon|Tue/i.test(s));
  ar[u] = { dir, arabicChars: (t.match(/[؀-ۿ]/g) || []).length, englishLines: latinLines.slice(0, 6), raw: (t.match(/\b[a-z][a-zA-Z]+\.[a-z][a-zA-Z_]+\.[a-zA-Z_.]+\b/g) || []).filter(x => !/\.(com|software)/.test(x)).slice(0, 4) };
  if (ar[u].englishLines.length || ar[u].raw.length || ar[u].dir !== 'rtl') ar[u].shot = await shot('wave1/W1-59-ar' + u.replace(/[^a-z]+/gi, '_').slice(-25));
}
o.W1_59 = ar;
try { await page.evaluate(() => { localStorage.setItem('anyware_language', 'en'); }); } catch (e) { }
return done(o);
