(async (page) => { await page.getByText('Not Now', { exact: true }).click().catch(() => {}); await page.waitForTimeout(1500);
  await page.getByRole('button', { name: /^Edit$/ }).first().click().catch(async () => { await page.getByText('Edit', { exact: true }).first().click(); }); await page.waitForTimeout(6000);
  const inputs = await page.$$eval('input, textarea, select', els => els.filter(e => e.offsetParent !== null).map(e => { const lab = (e.closest('div') && e.closest('div').parentElement && e.closest('div').parentElement.innerText || '').trim().split('\n')[0]; return lab.slice(0, 30) + '|' + (e.name || e.id || e.getAttribute('data-id') || '') + '|' + e.type + '|' + (e.placeholder || '') + '|' + String(e.value).slice(0, 30); }));
  const btns = await page.$$eval('button', els => els.filter(e => e.offsetParent !== null).map(e => (e.innerText || '').trim()).filter(x => x && x.length < 20));
  await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/bugs/zoho-company-edit.png' });
  return { inputs, btns: btns.slice(-15) }; })
