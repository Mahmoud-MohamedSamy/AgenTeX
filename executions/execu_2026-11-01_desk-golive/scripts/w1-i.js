const o = {};
await page.goto(H + '/hq', { waitUntil: 'commit', timeout: 60000 }); for (let i = 0; i < 30; i++) { await sleep(1000); if ((await txt()).includes('Headquarters')) break; } await sleep(3000);
const lang = await page.evaluate(() => localStorage.getItem('anyware_language')); o.lang = lang;
// avatar menu
const av = page.locator('header button').filter({ hasText: /^EA$/ }).last(); o.avatar = await av.count();
if (o.avatar) { await av.click(); await sleep(2500); const t = await txt(); o.menuText = t.slice(-600).replace(/\s+/g, ' '); o.menuItems = (await page.$$eval('[role=menuitem],[role=menu] a,[role=dialog] a,[role=dialog] button,[data-radix-popper-content-wrapper] *', ms => [...new Set(ms.map(m => (m.innerText || '').trim()).filter(s => s && s.length < 40))])).slice(0, 25).join(' | '); o.shotMenu = await shot('wave1/W1-57-avatar-menu'); await page.keyboard.press('Escape'); }
// team queue
await page.goto(H + '/hq', { waitUntil: 'commit', timeout: 60000 }); await sleep(8000);
const tq = page.getByText('Team Queue', { exact: true }).first(); if (await tq.count()) { await tq.click(); for (let i = 0; i < 20; i++) { await sleep(1000); if ((await txt()).length > 600) break; } const t = await txt(); o.W1_47 = { url: page.url().replace(H, ''), hasTest: /\btest\b/.test(t), hasQA: t.includes('QA GL Team 2'), tail: t.replace(/\s+/g, ' ').slice(-300) }; }
// keyboard focus on departments list
await page.goto(H + '/settings/organization/departments', { waitUntil: 'commit', timeout: 60000 }); for (let i = 0; i < 25; i++) { await sleep(1000); if ((await txt()).includes('techSupport')) break; }
const foc = []; for (let i = 0; i < 25; i++) { await page.keyboard.press('Tab'); foc.push(await page.evaluate(() => { const e = document.activeElement; if (!e) return ''; const s = getComputedStyle(e); const vis = s.outlineStyle !== 'none' && s.outlineWidth !== '0px' || s.boxShadow !== 'none'; return (e.tagName + ':' + (e.getAttribute('aria-label') || e.innerText || '').trim().slice(0, 20) + (vis ? '' : '[noFocusRing]')); })); }
o.W1_60 = { tabs: foc.join(' > '), noRing: foc.filter(x => x.includes('noFocusRing')).length };
return done(o);
