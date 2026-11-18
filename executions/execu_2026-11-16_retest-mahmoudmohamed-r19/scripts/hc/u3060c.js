const id = 'a578ae5c-05fc-4161-b76c-648dbd0517df'; const out = {};
const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(H + '/views/all/tickets/' + id, { waitUntil: 'domcontentloaded' });
await page.getByText('QA BP RT19 HC 3060 ticket').first().waitFor({ timeout: 90000 }).catch(() => {}); await sleep(5000);
await page.getByRole('button', { name: /QA hold/ }).first().click(); await sleep(4000);
for (const n of ['QA RT18 GL Account', 'Laptop Stand']) { await page.getByText(n, { exact: true }).last().click(); await sleep(2500); const d = page.getByRole('dialog'); out[n] = (await d.last().innerText().catch(() => 'NO DIALOG')).replace(/\s+/g, ' ').slice(0, 160); await d.last().getByRole('button', { name: 'Cancel' }).click().catch(() => page.keyboard.press('Escape')); await sleep(1500); }
await page.getByText('Mona QA RT18 Export', { exact: true }).last().click(); await sleep(2500);
const dl = page.getByRole('dialog').last(); await dl.locator('input').first().fill('VR1112 G7'); await sleep(3000); await dl.getByText(/VR1112 G7 ok/).first().click(); await sleep(1500);
if (await page.getByRole('dialog').count()) { const s = page.getByRole('dialog').last().getByRole('button', { name: 'Select' }); if (await s.count()) await s.click(); await sleep(1500); }
await page.getByRole('button', { name: 'Run', exact: true }).click(); await sleep(7000);
out.after = (await text()).replace(/\s+/g, ' ').match(/Contact Info.{0,120}/)?.[0];
await page.screenshot({ path: RAW + '3060-6-after-run.png' });
return out;
