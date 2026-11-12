async (page, ctx, h) => {
  const d = await zdPage(ctx);
  const ev = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/evidence/';
  await d.mouse.click(144, 390); await d.waitForTimeout(3000);
  await d.screenshot({ path: ev + 'zoho-desk-vr-option.png' });
  const txt = await d.evaluate(() => [...document.querySelectorAll('body *')].filter(e => e.children.length===0 && e.offsetParent && e.getBoundingClientRect().top>100 && e.getBoundingClientRect().top<800 && e.getBoundingClientRect().left>230).map(e => e.textContent.trim()).filter(Boolean).slice(0,60).join(' | '));
  await d.getByText('Cancel', { exact: true }).last().click({ force: true }).catch(()=>0); await d.waitForTimeout(1500);
  await d.getByText(/^(Yes|Discard|OK)$/).first().click({ timeout: 3000 }).catch(()=>0);
  return { txt: txt.slice(0, 1200), rules: (await zd(d, 'GET', '/validationRules?module=tickets')).t.slice(0, 200) };
}
