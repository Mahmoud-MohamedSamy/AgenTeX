const wz = async () => { const t = (await page.locator('body').innerText()).replace(/\s+/g, ' '); const i = t.indexOf('6 Result'); return i >= 0 ? t.slice(i + 8, i + 1500) : t.slice(-1200); };
await go('/settings/data/import', 10000);
await page.getByText('Choose a module', { exact: true }).last().click(); await sleep(1500); await page.getByRole('option', { name: /^Tickets/ }).first().click(); await sleep(1000);
await page.getByRole('button', { name: /Start import/ }).click(); await sleep(4000);
const so = page.getByRole('button', { name: 'Start over' }); if (await so.count()) { await so.click(); await sleep(2000); }
await page.locator('input[type=file]').last().setInputFiles(RUN + '/wave5/files/w5-tickets.csv'); await sleep(3000);
await page.getByRole('button', { name: /^Next$/ }).last().click(); await sleep(5000); out.op = (await wz()).slice(0, 600); await shot('w5/W5-38-op');
await page.getByRole('button', { name: /^Next$/ }).last().click(); await sleep(5000); out.map = (await wz()).slice(0, 1200); await shot('w5/W5-38-map');
return fin({ out });
