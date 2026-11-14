await go('/settings/organization/signals', 12000); { const t = (await page.locator('body').innerText()).replace(/\s+/g, ' '); const c = t.indexOf('Email Providers'); out.sig = page.url().replace(H, '') + ' | ' + t.slice(c + 15, c + 700); } await shot('w5/W5-66-signals-direct');
await go('/modules/' + CM, 10000); await page.locator('main').getByText('QA GL W5 Contact 1', { exact: true }).first().click(); await sleep(8000);
out.c_url = page.url().replace(H, ''); out.c_btns = await page.locator('main').getByRole('button').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim().slice(0, 40)).filter(Boolean).slice(0, 40));
const mb = page.locator('main').getByRole('button', { name: /^(More|More actions|Record actions|Actions)$/i }).first(); if (await mb.count()) { await mb.click(); await sleep(1200); out.c_menu = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' '); await shot('w5/W5-08-contact-menu'); await page.keyboard.press('Escape'); }
out.c_text = (await mtxt()).match(/(portal|help center|invite)[^.]{0,80}/gi);
await page.getByRole('button', { name: 'Open profile' }).click(); await sleep(2000); out.prof = (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(-600); await shot('w5/W5-70-profile');
return fin({ out });
