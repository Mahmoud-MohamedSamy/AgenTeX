async (page) => {
  await page.goto(HOST + '/settings/modules-and-fields/841043e1-c078-41f9-8d6e-dfd61bee45c3?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await page.getByText('QA LR1112 B4', { exact: false }).first().waitFor({ timeout: 40000 }).catch(() => {}); await sleep(1500); if (await relogin()) { await page.goto(HOST + '/settings/modules-and-fields/841043e1-c078-41f9-8d6e-dfd61bee45c3?tab=layout-rules'); await sleep(6000); }
  const combos = await page.evaluate(() => [...document.querySelectorAll('button[role=combobox], button[aria-haspopup=listbox], select')].map(b => (b.getAttribute('aria-label') || '') + ' = ' + b.innerText.trim()).slice(0, 12));
  const rows = await page.evaluate(() => [...document.querySelectorAll('tr, [role=row], li')].map(r => r.innerText.replace(/\s+/g, ' ').trim()).filter(t => /QA LR1112/.test(t)).slice(0, 10));
  await shot('crm-B4-0'); return { combos, rows, btns: await page.evaluate(() => [...document.querySelectorAll('button')].map(b => b.innerText.trim()).filter(t => /clear|filter/i.test(t))) };
}
