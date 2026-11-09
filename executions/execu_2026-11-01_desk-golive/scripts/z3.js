(async (page) => { const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/bugs/'; const o = {};
  const msg = async () => (await page.innerText('body')).replace(/\s+/g, ' ').match(/.{0,80}(valid|invalid|enter a|must|error|characters|allowed|updated successfully|saved)[^.]{0,80}/ig) || [];
  // 1 website
  await page.fill('#ZD_24', 'not a url'); await page.waitForTimeout(800); await page.screenshot({ path: R + 'zoho-B1-1-website-typed.png' });
  await page.getByRole('button', { name: /^Update$/ }).click(); await page.waitForTimeout(4000); await page.screenshot({ path: R + 'zoho-B1-2-website-update.png' });
  o.web = { msgs: (await msg()).slice(0, 4), stillEdit: await page.locator('#ZD_24').count(), value: await page.locator('#ZD_24').inputValue().catch(() => null) };
  return o; })
