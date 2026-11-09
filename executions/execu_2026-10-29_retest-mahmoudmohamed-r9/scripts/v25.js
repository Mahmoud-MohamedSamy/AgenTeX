const out = {}; await page.getByText('EN', { exact: true }).first().click(); await sleep(1200);
await page.locator('[role=menuitem],[role=option],[role=menuitemradio]', { hasText: /العربية/ }).first().click(); await sleep(9000); await shot('v25-signals-ar');
const t = (await txt()).split('\n').map(l => l.trim()).filter(Boolean); out.rawKeys = t.filter(l => /^[a-z_]+\.[a-z_.*]+$/.test(l)).slice(0, 25);
const i = t.findIndex(l => /الإشارة|إشارة/.test(l)); out.ar = t.slice(Math.max(0, i), i + 30).filter(l => l.length < 70);
await page.getByText('AR', { exact: true }).first().click(); await sleep(1200); await page.locator('[role=menuitem],[role=option],[role=menuitemradio]', { hasText: /English/ }).first().click(); await sleep(6000);
out.back = (await txt()).includes('My Notifications') ? 'EN' : '?'; return done(out);
