async (page) => {
  let tok = null; const h = r => { const v = r.headers()['x-zcsrf-token']; if (v) tok = v; }; page.on('request', h);
  await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForTimeout(10000); page.off('request', h);
  globalThis.__ztok = tok;
  const base = '/supportapi/zd/techsolutionsegypt/api/v1/';
  const probe = ['workflowRules?module=tickets&departmentId=1475109000000426945', 'workflows?module=tickets&departmentId=1475109000000426945', 'notifyRules?departmentId=1475109000000426945', 'tickets?limit=3&departmentId=1475109000000426945&sortBy=-createdTime', 'contacts?limit=5'];
  const out = {};
  for (const p of probe) out[p] = await page.evaluate(async ([u, t]) => { const r = await fetch(u, { headers: { orgId: '944875504', 'X-ZCSRF-TOKEN': t } }); return r.status + ' ' + (await r.text()).slice(0, 500); }, [base + p, tok]);
  return { tokLen: tok && tok.length, out };
}
