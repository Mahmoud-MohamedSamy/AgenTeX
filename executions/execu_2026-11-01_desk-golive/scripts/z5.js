(async (page) => { const o = {};
  if (!(await page.getByPlaceholder('Enter company phone number').count())) { await page.getByRole('button', { name: /^Edit$/ }).first().click(); await page.waitForTimeout(5000); }
  o.maxlen = await page.getByPlaceholder('Enter company phone number').getAttribute('maxlength'); o.webMax = await page.getByPlaceholder('Enter Website').getAttribute('maxlength');
  await page.getByPlaceholder('Enter company phone number').fill('1099130163'); await page.getByRole('button', { name: /^Update$/ }).click(); await page.waitForTimeout(4500);
  const t = (await page.innerText('body')).replace(/\s+/g, ' '); o.phoneNow = (t.match(/Phone (\d+)/) || [])[1]; o.webNow = (t.match(/Website: (\S+)/) || [])[1] || 'none';
  await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/bugs/zoho-company-restored.png' }); return o; })
