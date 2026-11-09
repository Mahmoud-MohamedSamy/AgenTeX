(async (page) => { const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/bugs/'; const o = {};
  const edit = async () => { if (!(await page.getByPlaceholder('Enter Website').count())) { await page.getByRole('button', { name: /^Edit$/ }).first().click(); await page.waitForTimeout(5000); } };
  const upd = async () => { await page.getByRole('button', { name: /^Update$/ }).click(); await page.waitForTimeout(4500); };
  const body = async () => (await page.innerText('body')).replace(/\s+/g, ' ');
  // restore website empty
  await edit(); await page.getByPlaceholder('Enter Website').fill(''); await upd(); o.webRestored = !/not a url/.test(await body());
  // phone 300
  await edit(); await page.getByPlaceholder('Enter company phone number').fill('1'.repeat(300)); await page.waitForTimeout(800); o.phoneLenInField = (await page.getByPlaceholder('Enter company phone number').inputValue()).length;
  await page.screenshot({ path: R + 'zoho-B1-3-phone-typed.png' }); await upd(); await page.screenshot({ path: R + 'zoho-B1-4-phone-update.png' });
  const t = await body(); o.afterPhone = { stillEdit: await page.getByPlaceholder('Enter company phone number').count(), msgs: (t.match(/.{0,60}(valid|invalid|must|error|characters|exceed|maximum|limit|allowed)[^.]{0,80}/ig) || []).slice(0, 4), phoneShown: (t.match(/Phone (\d{1,400})/) || [])[1]?.length };
  return o; })
