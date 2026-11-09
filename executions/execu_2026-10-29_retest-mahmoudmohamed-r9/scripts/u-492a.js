// NDC-492 explore: open the Leads "Standard Layout" in the layout editor, open the first section's settings menu (no change saved).
await page.goto(`${H}/settings/modules-and-fields/${T.LEADS}/layouts/b3ab6751-e26a-4641-9dbc-f8737f26c908`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(10000);
await shot('492-editor.png');
const gears = await page.$$('[aria-label*="section" i][aria-label*="setting" i], button[aria-label*="Section settings" i], [data-testid*="section-settings"]');
log('gears', gears.length);
const sec = await page.$('[data-testid*="section"]'); if (sec) await sec.hover().catch(() => {});
if (gears[0]) { await gears[0].click(); await sleep(1500); }
await shot('492-menu.png');
const t = await text();
const btns = await page.$$eval('button[aria-label]', els => els.map(e => e.getAttribute('aria-label')).filter(a => /section|gear|setting|more/i.test(a)).slice(0, 15));
return { url: page.url(), hasTabOrder: /Tab Order/i.test(t), menu: (t.match(/Tab Order.{0,120}/s) || [''])[0].replace(/\s+/g, ' '), btns };
