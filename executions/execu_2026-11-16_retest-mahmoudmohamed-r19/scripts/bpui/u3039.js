const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
await page.goto(H + '/settings/automation/blueprints/new', { waitUntil: 'domcontentloaded' }); await sleep(9000);
const canvas = page.locator('.react-flow').first(); const D = page.locator('[draggable=true]');
log('draggables', await D.count(), await D.evaluateAll(a => a.slice(0, 6).map(x => x.innerText.replace(/\s+/g, ' ').slice(0, 30))));
await D.nth(0).dragTo(canvas, { targetPosition: { x: 200, y: 250 } }); await sleep(1200);
await D.nth(2).dragTo(canvas, { targetPosition: { x: 600, y: 250 } }); await sleep(1200);
await D.nth(3).dragTo(canvas, { targetPosition: { x: 900, y: 400 } }).catch(e => log('drag3', String(e).slice(0, 60))); await sleep(1200);
await page.getByRole('button', { name: 'Save and Publish' }).click({ force: true }); await sleep(2500);
const t = (await text()).replace(/\s+/g, ' '); const i = t.search(/issues? to fix/i); log('issue box', i >= 0 ? t.slice(Math.max(0, i - 30), i + 500) : 'NONE ' + t.slice(0, 200));
await page.screenshot({ path: RAW + '3039-1-issue-box.png' });
const box = page.locator('li').filter({ hasText: /needs a name|department|Department/ });
log('items', await box.evaluateAll(a => a.map(x => x.innerText.replace(/\s+/g, ' ').slice(0, 80) + ' => ' + (x.querySelector('button,a') ? 'clickable' : 'plain'))));
const nameItem = page.locator('li').filter({ hasText: 'The blueprint needs a name' }).first().locator('button,a').first();
if (await nameItem.count()) { await nameItem.click(); await sleep(1500); log('focused after name click', await page.evaluate(() => { const e = document.activeElement; if (!e) return null; const r = e.getBoundingClientRect(); return e.tagName + ' ' + (e.getAttribute('aria-label') || e.name || e.placeholder || e.id || '') + ' at x=' + Math.round(r.x) + ',y=' + Math.round(r.y); })); await page.screenshot({ path: RAW + '3039-2-after-name-click.png' }); }
const depItem = page.locator('li').filter({ hasText: 'Choose the department the blueprint belongs to' }).first().locator('button,a').first();
if (await depItem.count()) { await depItem.click(); await sleep(1500); log('focused after dept click', await page.evaluate(() => { const e = document.activeElement; return e ? e.tagName + ' ' + (e.getAttribute('aria-label') || e.getAttribute('role') || e.name || e.id || '') + ' text=' + (e.innerText || e.value || '').slice(0, 40) : null; })); await page.screenshot({ path: RAW + '3039-3-after-dept-click.png' }); } else log('no clickable department item');
return { ok: 1 };
