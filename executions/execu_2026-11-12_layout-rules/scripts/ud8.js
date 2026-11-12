async (page) => {
  const mid = '88e8ea44-1658-4df3-9930-d0902b91073d', lid = 'e8eb01f2-214d-4ce1-9790-8d8a93c2e953';
  const R = {}; await openCreate(mid, lid);
  const dpick = async name => { await wrap('department').locator('button[aria-label=Department]').first().click(); await sleep(800); const o = page.getByRole('option', { name, exact: true }); if (await o.count()) await o.first().click(); else await page.getByText(name, { exact: true }).last().click(); await sleep(1200); };
  R.deptNow = await valOf('department');
  await tick('qa_lr_vip', true); R.vip_dept_now = await vis('qa_lr_date');
  await dpick('Customer Support'); R.deptAfterCS = await valOf('department'); R.vip_CS = await vis('qa_lr_date');
  await dpick('HR'); R.deptAfterHR = await valOf('department'); R.vip_HR = await vis('qa_lr_date');
  await dpick('Customer Support'); R.vip_CS2 = await vis('qa_lr_date');
  await shot('desk-G16-dept');
  return R;
}
