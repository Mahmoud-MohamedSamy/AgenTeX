const blocked = [];
// Safety: abort every write request while the button is clicked, so no rescore can start.
await page.route(u => /\/api\/v1\//.test(u.href), async r => { const m = r.request().method(); if (m !== 'GET' && m !== 'OPTIONS' && m !== 'HEAD') { blocked.push(m + ' ' + r.request().url().replace(/.*\/api\/v1/, '')); return r.abort(); } return r.continue(); });
await page.goto(H + '/settings/automation/scoring-rules?module=841043e1-c078-41f9-8d6e-dfd61bee45c3', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(1500); if (/Run scoring rules/i.test(await text())) break; }
await sleep(2500);
await shot('F14-1-scoring-page.png');
const btn = page.getByRole('button', { name: /Run scoring rules/i }).first(); log('btn ' + await btn.count() + ' box ' + JSON.stringify(await btn.boundingBox()) + ' title ' + await btn.getAttribute('title') + ' aria ' + await btn.getAttribute('aria-label'));
await btn.click(); await sleep(1500);
const dlg = page.locator('[role=dialog]:visible, [role=alertdialog]:visible'); log('dialogs ' + await dlg.count() + ' ' + (await dlg.first().innerText().catch(() => '')).replace(/\n/g, ' | ').slice(0, 600));
log('blocked after click ' + JSON.stringify(blocked));
await shot('F14-2-after-click.png');
if (await dlg.count()) { const c = dlg.first().getByRole('button', { name: /Cancel|Close|No/i }).first(); if (await c.count()) await c.click(); else await page.keyboard.press('Escape'); await sleep(1200); log('cancelled; blocked now ' + JSON.stringify(blocked)); }
const t = await text(); const i = t.search(/Last run|last run|checked/i); log('banner ' + (i >= 0 ? t.slice(i - 100, i + 300).replace(/\n/g, ' | ') : 'none'));
