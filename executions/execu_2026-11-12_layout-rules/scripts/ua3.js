async (page) => {
  const out = {}; const U = HOST + '/settings/modules-and-fields/88e8ea44-1658-4df3-9930-d0902b91073d?tab=layout-rules';
  await page.goto(U, { waitUntil: 'domcontentloaded' }); await sleep(12000);
  out.url = page.url(); const t = await bodyText(); out.text = t.slice(0, 500); out.hasNewBtn = await page.getByRole('button', { name: /New Layout Rule/ }).count(); out.rulesShown = (t.match(/QA (LR1112|NDC) [^ ]+/g) || []).length;
  await shot('desk-A3-agent', false);
  await page.goto(HOST + '/settings', { waitUntil: 'domcontentloaded' }); await sleep(8000); const s = await bodyText(); out.settingsHasModules = /Modules and Fields/i.test(s); out.settingsText = s.slice(0, 300);
  return out;
}
