const OPEN = '64625328-d671-4fe8-b323-b63b9d15a46c';
const L = arr((await api('GET', `/modules/${OPEN}/layouts`)).j.data);
await go(`/settings/modules-and-fields/${OPEN}`, 6000);
await page.getByRole('tab', { name: 'Layouts' }).first().click().catch(() => {}); await sleep(2000);
const t1 = (await txt()).replace(/\s+/g, ' '); const s1 = await shot('scan-layouts-tab');
const row = page.locator('tr', { hasText: L[0].name }).first(); await row.hover(); await sleep(300);
const mb = page.locator(`button[aria-label^="Open menu for"]`); const mbn = await mb.count(); let menu = '';
if (mbn) { await mb.first().click(); await sleep(700); menu = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' | '); await page.keyboard.press('Escape'); }
await go(`/settings/modules-and-fields/${OPEN}/layouts/${L[0].id}`, 9000);
const btns = (await page.locator('button:visible').allInnerTexts()).map(x => x.trim()).filter(Boolean);
const tabs = (await page.locator('[role=tab]:visible').allInnerTexts()).map(x => x.trim());
const s2 = await shot('scan-builder');
rec('SCAN', 'INFO', `Layouts tab: ${t1.slice(t1.indexOf('Layouts'), t1.indexOf('Layouts') + 300)}; row menu: ${menu}; builder buttons: [${btns.join(' | ').slice(0, 600)}]; builder tabs: [${tabs.join(' | ')}]; layouts: ${L.map(l => l.name + ' assigned=' + JSON.stringify(l.assignedProfiles) + ' deps=' + JSON.stringify(l.dependencies).slice(0, 80) + ' access=' + l.accessMode).join(' ; ')}`, { shot: s2 });
return done();
