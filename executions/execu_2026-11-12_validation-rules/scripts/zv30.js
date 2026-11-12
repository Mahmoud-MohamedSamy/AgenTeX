async (page, ctx, h) => {
  const r = await zf(page, 'POST', '/crm/v8/Leads/actions/mass_update', { data: [{ QA_VR1112_Code: 'X' }], ids: ['7687862000000765105'] });
  let st = null;
  const jid = r.j?.data?.[0]?.details?.job_id;
  if (jid) { await page.waitForTimeout(5000); st = (await zf(page, 'GET', '/crm/v8/Leads/actions/mass_update?job_id=' + jid)).t.slice(0, 300); }
  const rec = await zf(page, 'GET', '/crm/v8/Leads/7687862000000765105?fields=QA_VR1112_Code');
  return { r: r.s + ' ' + r.t.slice(0, 300), st, rec: rec.t.slice(0, 150) };
}
