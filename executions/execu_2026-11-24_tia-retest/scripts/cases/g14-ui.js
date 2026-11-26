const P = '[data-testid="tia-panel"]', L = '[data-testid="tia-launcher"]'; const R = {};
await go('/'); await sleep(4000);
R.launcherLabel = await page.locator(L).getAttribute('aria-label').catch(() => '');
await page.locator(L).click(); await sleep(2000);
R.panelOpen = (await page.locator(P).innerText()).replace(/\n+/g, ' / ').slice(0, 400);
const nc = page.locator(`${P} button[aria-label="New chat"]`); if (await nc.count()) { await nc.click(); await sleep(1000); }
const ta = page.locator(`${P} textarea`); if (await ta.count()) { await ta.fill('QA TIA G14 hello'); await ta.press('Enter'); await sleep(6000); }
R.after = (await page.locator(P).innerText()).replace(/\n+/g, ' / ').slice(-400);
R.links = await page.locator(`${P} a, ${P} button`).evaluateAll(es => es.map(e => (e.innerText || e.getAttribute('aria-label') || '').trim()).filter(t => /credit|billing|buy|admin/i.test(t)));
await shot('G-14-' + process.env.WHO_TAG);
return R;
