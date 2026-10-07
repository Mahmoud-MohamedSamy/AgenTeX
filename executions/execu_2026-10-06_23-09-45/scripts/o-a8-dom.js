await go('/settings/modules-and-fields', 6000);
const row = page.locator('tr', { hasText: 'QA MF Open' }).first(); await row.hover(); await sleep(300);
await page.locator('button[aria-label="Open menu for QA MF Open1"]').first().click(); await sleep(700);
await page.locator('button,[role=menuitem]', { hasText: /^Access Control$/ }).last().click(); await sleep(1800);
const html = await page.evaluate(() => { const el = [...document.querySelectorAll('*')].filter(e => e.children.length === 0 && /Selected Users/.test(e.textContent)).pop(); let p = el; for (let i = 0; i < 3 && p.parentElement; i++) p = p.parentElement; return p.outerHTML.replace(/class="[^"]*"/g, '').slice(0, 1500); });
await page.keyboard.press('Escape');
rec('DOM', 'INFO', html);
return done();
