const wz = async () => { const t = (await page.locator('body').innerText()).replace(/\s+/g, ' '); const i = t.indexOf('6 Result'); return i >= 0 ? t.slice(i + 8, i + 700) : t.slice(-700); };
await go('/settings/data/import', 10000);
await page.getByText('Choose a module', { exact: true }).last().click(); await sleep(1500); await page.getByRole('option', { name: /^Contacts/ }).first().click(); await sleep(1000);
await page.getByRole('button', { name: /Start import/ }).click(); await sleep(4000);
for (const f of ['w5-bad.txt', 'w5-empty.csv']) { await page.locator('input[type=file]').last().setInputFiles(RUN + '/wave5/files/' + f); await sleep(3000);
  out[f] = await wz(); await shot('w5/W5-37-' + f.replace('.', '-'));
  const nb = page.getByRole('button', { name: /^Next$/ }).last(); out[f + '_nextEnabled'] = await nb.isEnabled().catch(() => 'n/a');
  if (out[f + '_nextEnabled'] === true) { await nb.click(); await sleep(4000); out[f + '_afterNext'] = await wz(); await page.getByRole('button', { name: /^Back$/ }).last().click().catch(() => {}); await sleep(2000); } }
await page.getByRole('button', { name: /^Cancel$/ }).last().click().catch(() => {});
return fin({ out });
