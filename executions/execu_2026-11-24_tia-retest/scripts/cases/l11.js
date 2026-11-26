const P = '[data-testid="tia-panel"]', L = '[data-testid="tia-launcher"]'; const R = {};
await go('/'); await sleep(4000); await page.locator(L).click(); await sleep(1500);
const nc = page.locator(`${P} button[aria-label="New chat"]`); if (await nc.count()) { await nc.click(); await sleep(1000); }
const ta = page.locator(`${P} textarea`); await ta.fill('QA TIA L11: count my open tickets, then list the 10 newest tickets with their status, priority and department.'); await ta.press('Enter');
await sleep(1500); R.thinkingBefore = await page.locator('[data-testid="tia-thinking"]').count();
await page.reload(); await sleep(3000);
if (!(await page.locator(P).isVisible().catch(() => false))) { await page.locator(L).click(); await sleep(1000); }
const snaps = []; for (let i = 0; i < 6; i++) { snaps.push((await page.locator(P).innerText().catch(() => '')).replace(/\n+/g, ' / ').slice(-220)); if (i === 0) await shot('L-11-after-reload'); await sleep(5000); }
R.snaps = snaps; await shot('L-11-later');
return R;
