const P = '[data-testid="tia-panel"]', L = '[data-testid="tia-launcher"]';
const R = {};
await go('/'); await sleep(3500);
// N1-18 keyboard focus inside the panel
await page.locator(L).click(); await sleep(1500);
const seq = []; for (let i = 0; i < 10; i++) { await page.keyboard.press('Tab'); seq.push(await page.evaluate(p => !!document.activeElement?.closest(p), P)); }
const back = []; await page.locator(`${P} textarea`).focus(); for (let i = 0; i < 4; i++) { await page.keyboard.press('Shift+Tab'); back.push(await page.evaluate(p => !!document.activeElement?.closest(p), P)); }
R.n118 = { role: await page.locator(P).getAttribute('role'), modal: await page.locator(P).getAttribute('aria-modal'), tabInside: seq, shiftTabInside: back };
await page.keyboard.press('Escape'); await sleep(800); R.n118.escClosed = !(await page.locator(P).isVisible().catch(() => false));
// N1-16 Arabic
const lang = page.locator('header button, nav button', { hasText: /^EN$/ }).first(); R.langBtn = await lang.count();
await lang.click(); await sleep(1000);
await page.locator('[role=menuitem], [role=option], button, li', { hasText: /العربية|Arabic/ }).first().click(); await sleep(5000);
R.dir = await page.evaluate(() => document.documentElement.dir);
if (!(await page.locator(P).count())) { await page.locator(L).click(); await sleep(2000); }
const nb = page.locator(`${P} button`).nth(2); await nb.click().catch(() => {}); await sleep(1500);
R.panelAr = (await page.locator(P).innerText()).replace(/\n+/g, ' / ').slice(0, 600);
R.btnLabels = (await page.$$eval(`${P} button`, b => b.map(x => x.getAttribute('aria-label')).filter(Boolean))).join(' | ');
await shot('N1-16-crm-panel-arabic');
// N2-04 Arabic question about English-named deal
const ta = page.locator(`${P} textarea`); await ta.fill('ما هي مرحلة الصفقة QA TIA RT Deal 1500؟'); await ta.press('Enter');
await page.waitForFunction(() => document.querySelectorAll('[data-testid="tia-reply-text"]').length >= 1 && !document.querySelector('[data-testid="tia-thinking"]'), null, { timeout: 120000 }).catch(() => {}); await sleep(3000);
const rt = page.locator('[data-testid="tia-reply-text"]').last(); R.n204 = { dir: await rt.getAttribute('dir'), css: await rt.evaluate(e => getComputedStyle(e).direction).catch(() => ''), text: (await rt.innerText().catch(() => '')).slice(0, 400) };
await shot('N2-04-arabic-mixed-answer');
// setup page in Arabic
await go('/settings/integrations/tia'); await sleep(6000); const st = await text(); await shot('N1-16-crm-setup-arabic', { fullPage: true });
const latinLines = st.split('\n').map(s => s.trim()).filter(s => s.length > 3 && /^[A-Za-z][A-Za-z ,.'()-]+$/.test(s));
R.setupEnglishLeft = [...new Set(latinLines)].slice(0, 40);
// restore English
await go('/'); await sleep(3000);
const l2 = page.locator('header button, nav button', { hasText: /^(AR|ع|EN|عربي)$/ }).first(); R.lang2 = await l2.innerText().catch(() => 'n/a');
await l2.click().catch(() => {}); await sleep(900); await page.locator('[role=menuitem], [role=option], button, li', { hasText: /^English$|الإنجليزية/ }).first().click().catch(() => {}); await sleep(4000);
R.dirAfter = await page.evaluate(() => document.documentElement.dir); R.langAfter = await page.locator('header button, nav button', { hasText: /^EN$/ }).count();
return R;
