// Owner: verify QA MF Closed module permission is stored (re-send the same PUT, read the Access Control modal).
const CLOSED = 'fc61433d-7330-4a14-a260-97e68eca9add';
const p = await api('PUT', `/modules/${CLOSED}/permissions`, { profileIds: ['44444444-4444-4444-4444-444444444401'] });
await go('/settings/modules-and-fields', 6000);
const row = page.locator('tr', { hasText: 'QA MF Closed' }).first(); await row.hover(); await sleep(300);
await page.locator('button[aria-label="Open menu for QA MF Closed1"]').first().click(); await sleep(700);
await page.locator('button,[role=menuitem]', { hasText: /^Access Control$/ }).last().click(); await sleep(2000);
const dlg = (await page.locator('[role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
const s = await shot('H10-owner-access-control');
await page.keyboard.press('Escape');
const m = (await api('GET', `/modules/${CLOSED}`)).j.data;
rec('H10.owner', 'INFO', `re-PUT permissions {Desk Administrator} → ${p.s} ${p.t.slice(0, 160)}; module recordVisibility=${m.recordVisibility}; Access Control modal: "${dlg.slice(0, 300)}"`, { shot: s });
return done();
