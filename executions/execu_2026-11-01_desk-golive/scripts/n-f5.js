const o = {};
await page.goto(H + '/settings/security/audit-log', { waitUntil: 'commit', timeout: 45000 }).catch(() => {});
for (let i = 0; i < 30; i++) { await sleep(1000); const t = await txt().catch(() => ''); if (/RECENT ACTIVITY/.test(t) && t.length > 1500) break; } await sleep(2000);
o.buttons = await page.$$eval('main button, main [role=combobox], main input', bs => bs.filter(b => b.offsetParent).map(b => (b.tagName + ':' + (b.getAttribute('aria-label') || b.getAttribute('placeholder') || b.innerText || '').trim().replace(/\s+/g, ' ')).slice(0, 60)).slice(0, 40));
const t = (await txt()).replace(/\s+/g, ' '); const i = t.indexOf('RECENT ACTIVITY'); o.text = t.slice(i, i + 2500);
return done(o);
