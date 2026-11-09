const o = {};
await page.goto(H + '/hq', { waitUntil: 'commit', timeout: 60000 }); await sleep(8000);
await page.evaluate(() => { localStorage.setItem('anyware_language', 'ar'); });
for (const [u, probe] of [['/settings/organization/departments', 'techSupport'], ['/settings/organization/business-hours', 'Africa/Cairo'], ['/settings/users-control/ticket-access', 'Public']]) {
  await page.goto(H + u, { waitUntil: 'commit', timeout: 45000 }); let t = ''; for (let i = 0; i < 40; i++) { await sleep(1000); t = await txt(); if (t.includes(probe) || (t.match(/[؀-ۿ]/g) || []).length > 200) break; } await sleep(2500); t = await txt();
  const lines = t.split('\n').map(s => s.trim()).filter(Boolean);
  const eng = lines.filter(s => s.length > 10 && /^[A-Za-z][A-Za-z ,.'()&-]+$/.test(s) && !/QA GL|techSupport|Call Center|DAR Review|^Tech$|Eslam|Africa|anyware|Desk/i.test(s));
  o[u] = { loaded: t.includes(probe), arabicChars: (t.match(/[؀-ۿ]/g) || []).length, english: eng.slice(0, 8), shot: await shot('wave1/W1-59-ar' + u.replace(/[^a-z]+/gi, '_').slice(-25)) };
}
await page.evaluate(() => { localStorage.setItem('anyware_language', 'en'); });
return done(o);
