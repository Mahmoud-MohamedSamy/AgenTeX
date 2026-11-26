const P = '[data-testid="tia-panel"]', L = '[data-testid="tia-launcher"]';
const R = {};
for (const p of ['/reports/03d7cdc2-2dda-4d7e-aa38-a1b9fdd65211', '/reports/2804d186-a184-47df-b9bf-0dde53d6ac16']) {
  await go(p); await sleep(6000); R[p] = { url: page.url().replace(/[?#].*/, ''), title: (await text()).slice(0, 0) };
  if (!(await page.locator(P).count())) { await page.locator(L).click(); await sleep(1500); }
  const nc = page.locator(`${P} button[aria-label="New chat"]`); if (await nc.count()) { await nc.click(); await sleep(1500); }
  R[p].panel = (await page.locator(P).innerText()).replace(/\n+/g, ' / ').slice(0, 400);
  await shot('N1-08-crm-report-' + p.slice(-4));
  if (/Explain this report/.test(R[p].panel)) break;
}
return R;
