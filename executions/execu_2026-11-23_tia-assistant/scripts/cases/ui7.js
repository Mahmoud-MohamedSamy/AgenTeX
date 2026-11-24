const P = '[data-testid="tia-panel"]';
await go('/'); await page.waitForTimeout(3000);
const lang = page.locator('header button, nav button', { hasText: /^EN$/ }).first();
log('lang btn', await lang.count());
await lang.click(); await page.waitForTimeout(1000); await shot('M01-lang-menu');
const ar = page.locator('[role=menuitem], [role=option], button, li', { hasText: /العربية|Arabic/ }).first(); log('ar option', await ar.count());
await ar.click(); await page.waitForTimeout(4000);
log('html dir', await page.evaluate(() => document.documentElement.dir), 'lang', await page.evaluate(() => document.documentElement.lang));
if (!(await page.locator(P).count())) { await page.locator('[data-testid="tia-launcher"]').click(); await page.waitForTimeout(2000); }
log('launcher aria', await page.locator('[data-testid="tia-launcher"]').getAttribute('aria-label').catch(() => ''));
await page.locator(`${P} button`).nth(2).click().catch(() => {}); await page.waitForTimeout(1500);
await shot('M01-panel-arabic');
log('panel ar text', (await page.locator(P).innerText()).replace(/\n+/g, ' / ').slice(0, 500));
log('btn labels', (await page.$$eval(`${P} button`, b => b.map(x => x.getAttribute('aria-label')).filter(Boolean))).join(' | '));
const pb = await page.locator(P).boundingBox(); log('panel box', JSON.stringify(pb));
const ta = page.locator(`${P} textarea`); log('placeholder', await ta.getAttribute('placeholder'));
await ta.fill('ما هو عدد التذاكر المفتوحة التي يمكنني رؤيتها؟'); await ta.press('Enter');
await page.waitForFunction(() => document.querySelectorAll('[data-testid="tia-reply-text"]').length >= 1, null, { timeout: 120000 }).catch(() => {}); await page.waitForTimeout(3000);
await shot('M03-arabic-answer'); const rt = page.locator('[data-testid="tia-reply-text"]').last(); log('reply dir', await rt.getAttribute('dir'), 'computed', await rt.evaluate(e => getComputedStyle(e).direction), 'text', (await rt.innerText()).slice(0, 200));
// can-see in Arabic
await page.locator(`${P} [data-testid="tia-can-see"], ${P} button`).first().click().catch(() => {}); await page.waitForTimeout(2000); await shot('M01-can-see-arabic');
log('can-see ar', (await page.locator('[data-testid="tia-capabilities"]').innerText().catch(() => '')).replace(/\n+/g, ' / ').slice(0, 400));
await page.keyboard.press('Escape');
// back to EN
const l2 = page.locator('header button, nav button', { hasText: /^(AR|ع|EN)$/ }).first(); log('lang2', await l2.innerText().catch(() => 'n/a'));
await l2.click().catch(() => {}); await page.waitForTimeout(800); await page.locator('[role=menuitem], [role=option], button, li', { hasText: /^English$|الإنجليزية/ }).first().click().catch(() => {}); await page.waitForTimeout(3000);
log('dir after restore', await page.evaluate(() => document.documentElement.dir));
return 'ok';
