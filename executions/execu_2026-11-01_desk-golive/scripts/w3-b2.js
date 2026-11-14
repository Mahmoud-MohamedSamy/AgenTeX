const WH = 'da6d011e-6d09-4645-a3ed-c828bc374e37';
const SPEC = JSON.stringify({ openapi: '3.0.0', info: { title: 'QA GL W3 echo API', version: '1.0' }, servers: [{ url: 'https://webhook.site' }], paths: { ['/' + WH + '/echo/{ref}']: { post: { operationId: 'qaGlW3Echo', summary: 'QA GL W3 echo', parameters: [{ name: 'ref', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { content: { 'application/json': { schema: { type: 'object', required: ['note'], properties: { note: { type: 'string' }, count: { type: 'integer' } } } } } }, responses: { '200': { description: 'ok', content: { 'application/json': { schema: { type: 'object', properties: { ok: { type: 'boolean' }, echo: { type: 'string' } } } } } } } } } } }, null, 1);
const MC = page.locator('#main-content'); const dlg = () => page.locator('body');
const ctrls = async (loc) => loc.locator('input,textarea,select,button,[role=combobox],[role=switch],[role=checkbox],[role=radio]').evaluateAll(es => es.filter(e => e.offsetParent).map(e => [e.tagName, e.type || '', e.placeholder || '', e.getAttribute('aria-label') || '', (e.innerText || '').trim().slice(0, 30), e.checked ? 'on' : ''].join('|'))).catch(() => []);
const tail = async () => (await page.locator("body").innerText()).replace(/\s+/g, " ").slice(-6000);
await go("/settings/developer/custom-actions", 10000);
await page.getByRole("button", { name: "New action" }).first().click(); await sleep(3000);
await page.getByText("Paste", { exact: true }).last().click(); await sleep(1500); await shot("w3/W3-13-s1-paste");
const ta = page.locator("textarea:visible").last(); out.ta = await ta.count(); await ta.fill(SPEC); await sleep(500);
const pb = page.getByRole("button", { name: "Parse" }).last(); out.pbDisabled = await pb.isDisabled().catch(() => "x"); if (!out.pbDisabled) { await pb.click(); await sleep(4000); }
out.s1 = await tail(); await shot("w3/W3-13-s1-parsed");
const cb = page.getByRole("button", { name: "Continue" }).last(); out.cDisabled = await cb.isDisabled().catch(() => "x"); if (!out.cDisabled) { await cb.click(); await sleep(4000); }
await page.getByText("Select all", { exact: true }).last().click(); await sleep(800);
await page.getByRole("button", { name: "Continue" }).last().click(); await sleep(4000);
const panel = page.locator("body"); out.s3 = await tail(); await shot("w3/W3-13-s3-configure");
out.s3c = 0 && await page.locator("input:visible,textarea:visible,[role=combobox]:visible,[role=switch]:visible,[role=checkbox]:visible,[role=radio]:visible,select:visible").evaluateAll(es => es.slice(-40).map(e => [e.tagName, e.type || "", e.placeholder || "", e.getAttribute("aria-label") || "", (e.value || "").slice(0, 40), (e.innerText || "").trim().slice(0, 30)].join("|")));
await page.getByRole("button", { name: /Create a new source/ }).last().click().catch(() => {}); await sleep(800);
await page.locator("input[type=url]:visible").last().fill("https://webhook.site"); await sleep(800);
out.authOpts = ""; await shot("w3/W3-12-source-in-wizard");
const c3 = page.getByRole("button", { name: "Continue" }).last(); out.c3Disabled = await c3.isDisabled(); if (!out.c3Disabled) { await c3.click(); await sleep(4000); }
out.s4 = (await tail()).slice(-2500); await shot("w3/W3-13-s4-usage");
const fb = page.getByRole("button", { name: /^(Save|Finish|Create|Done|Save action|Create action)/ }).last(); out.fb = await fb.innerText().catch(() => "none"); if (out.fb !== "none") { await fb.click(); await sleep(5000); }
out.after = (await tail()).slice(-800); await shot("w3/W3-13-saved");
return fin({ out });
