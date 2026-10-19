const out = {};
const hasFunnel = async () => (await page.locator('main button[aria-label*="ilter"]').count()) > 0;
const heads = async () => { const b = await page.$$('main [role=region] button[aria-label], main header button[aria-label]'); const t = []; for (const e of b) t.push(await e.getAttribute('aria-label')); return t.filter(x => !/items|queue|activities|Arrange/.test(x)).slice(0, 8); };
for (const q of [/^EveryLeadWithNoAns/, /^All Leads/, /^Blueprint/, /^Approvals/, /^Reviews/]) {
  await page.getByRole('button', { name: q }).first().click(); await sleep(6000);
  const k = String(q).replace(/[\/^]/g, ''); out[k] = { funnel: await hasFunnel(), buttons: await heads() };
  if (/Approvals/.test(k)) await shot('NDC-1787-my-jobs-approvals');
  if (/EveryLead/.test(k)) await shot('NDC-1787-criteria-queue');
}
return done(out);
