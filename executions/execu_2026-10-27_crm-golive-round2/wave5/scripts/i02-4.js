const d = page.locator('[role=dialog]').first();
const res = {};
const rq = page.waitForResponse(r => /integrations\/clients/.test(r.url()) && r.request().method() === 'POST', { timeout: 30000 }).catch(() => null);
await d.locator('button', { hasText: /^Create$/ }).click();
const r = await rq; await sleep(2500);
let clientId = null, secret = null;
if (r) { const j = JSON.parse(await r.text()); res.status = r.status(); const dd = j.data || {}; clientId = dd.client_id || dd.clientId || (dd.client && dd.client.client_id); secret = dd.client_secret || dd.clientSecret || dd.secret; res.keys = Object.keys(dd); }
res.clientId = clientId; res.hasSecret = !!secret;
await shot('i02-created-secret-hidden-check');
res.dlgText = (await page.locator('[role=dialog]').first().innerText().catch(() => '')).replace(/\s+/g, ' ').replace(/[A-Za-z0-9_\-]{24,}/g, '<redacted>').slice(0, 600);
if (secret) {
  const tok = await ctx.request.post(H + '/api/v1/iam/integrations/token', { form: { grant_type: 'client_credentials', client_id: clientId, client_secret: secret }, headers: { 'x-tenant-id': 'a7a7a7a7-0000-0000-0000-000000000004' }, failOnStatusCode: false });
  const tj = JSON.parse(await tok.text()); res.token = tok.status() + ' scope=' + (tj.scope || tj.data?.scope) + ' expires=' + (tj.expires_in || tj.data?.expires_in);
  const at = tj.access_token || tj.data?.access_token;
  const ing = async (key, body, extra) => { const x = await ctx.request.post(H + '/api/v1/ingress/modules/' + key + '/records', { data: body, headers: { authorization: 'Bearer ' + at, 'x-tenant-id': 'a7a7a7a7-0000-0000-0000-000000000004', 'content-type': 'application/json', 'Idempotency-Key': 'qa-r2w5-' + Math.random().toString(36).slice(2), ...(extra || {}) }, failOnStatusCode: false }); return x.status() + ' ' + (await x.text()).slice(0, 260); };
  const sch = await ctx.request.get(H + '/api/v1/ingress/modules/qa_r2w5_mod/schema', { headers: { authorization: 'Bearer ' + at, 'x-tenant-id': 'a7a7a7a7-0000-0000-0000-000000000004' }, failOnStatusCode: false });
  res.schema = sch.status() + ' ' + (await sch.text()).slice(0, 300);
  res.ingestOk = await ing('qa_r2w5_mod', { name: 'QA R2W5 ingest', qa_pick: 'Green', qa_email: 'qa.r2w5.ingest@example.com', qa_text: 'QA77' });
  res.ingestBadPick = await ing('qa_r2w5_mod', { name: 'QA R2W5 ingest2', qa_pick: 'Purple', qa_email: 'qa.r2w5.ingest2@example.com', qa_text: 'QA78' });
  res.ingestRuleBreak = await ing('qa_r2w5_mod', { name: 'QA R2W5 ingest3', qa_pick: 'Green', qa_num: 50, qa_email: 'qa.r2w5.ingest3@example.com', qa_text: 'QA79' });
  res.ingestDep = await ing('qa_r2w5_mod', { name: 'QA R2W5 ingest4', qa_pick: 'Red', qa_sub: 'C', qa_email: 'qa.r2w5.ingest4@example.com', qa_text: 'QA80' });
  res.ingestOther = await ing('leads', { name: 'QA R2W5 no' });
  res.ingestStale = await ing('qa_r2w5_mod', { name: 'QA R2W5 stale', qa_email: 'qa.r2w5.st@example.com', qa_text: 'QA81' }, { 'X-Schema-Version': '1' });
  res.ingestEmpty = await ing('qa_r2w5_mod', {});
}
return res;
