const o = {};
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
