await go('/settings/modules-and-fields', 6000); await page.getByRole('button', { name: /Create New Module/ }).click(); await sleep(1500);
const d = (await page.locator('[role=dialog]').last().innerText()).replace(/\s+/g, ' ');
const ctl = await page.locator('[role=dialog] input, [role=dialog] select, [role=dialog] [role=radio], [role=dialog] [role=combobox]').evaluateAll(es => es.map(e => e.tagName + ':' + (e.type || e.getAttribute('role') || '') + ':' + (e.placeholder || e.value || '')));
const s = await shot('C4-create-dialog'); await page.keyboard.press('Escape');
rec('C4.scan', 'INFO', `dialog "${d.slice(0, 700)}"; controls ${ctl.join(', ')}`, { shot: s });
return done();
