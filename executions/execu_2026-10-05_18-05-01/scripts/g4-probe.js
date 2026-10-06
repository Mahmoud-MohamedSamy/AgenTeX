// Read-only probe: QA module Layouts tab actions + new-layout builder controls.
const QA = arr((await api('GET', '/modules')).j.data).find(m => m.moduleKey === 'desk_qa_mf_assets');
await go(`/settings/modules-and-fields/${QA.id}`, 6000);
const tab = await page.locator('main').innerText();
const row = page.locator('tr', { hasText: 'Default' }).first(); await row.hover(); await sleep(400);
const rowBtns = await row.locator('button').evaluateAll(bs => bs.map(b => b.getAttribute('aria-label') || b.title || b.innerText));
let menu = '';
const mb = row.locator('button[aria-label^="Actions"], button[aria-label^="Open"], button[aria-haspopup]').first();
if (await mb.count()) { await mb.click(); await sleep(700); menu = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\n/g, ' | '); await page.keyboard.press('Escape'); }
await page.getByRole('button', { name: /Create New Layout/ }).click(); await sleep(6000);
const url = page.url();
const top = await page.evaluate(() => [...document.querySelectorAll('button,[role=button],input')].filter(e => e.getBoundingClientRect().y < 110 && e.getBoundingClientRect().width).map(e => (e.getAttribute('aria-label') || e.title || e.innerText || e.placeholder || '').trim()).filter(Boolean));
await page.getByRole('button', { name: 'Cancel' }).first().click().catch(() => { }); await sleep(1500);
const after = page.url();
page.off('request', onReq);
return JSON.stringify({ qa: QA.id, tabText: tab.slice(0, 500), rowBtns, menu, newUrl: url.replace(H, ''), topControls: top, afterCancel: after.replace(H, '') });
