eval(require('fs').readFileSync('zlib.js', 'utf8'));
for (let a = 0; a < 3; a++) { try { await page.goto('https://desk.zoho.com/agent/techegysolutions/tech/tickets/list/all-cases', { waitUntil: 'domcontentloaded', timeout: 120000 }); break; } catch (e) {} } await sleep(10000);
const fu = await api('POST', B + 'automationFieldUpdates', { name: 'QA ZWF fu ui2', departmentId: D, module: 'tickets', fields: { classification: 'Problem' } }); out.fu = fu.s + ' ' + (JSON.parse(fu.t).id || ''); require('fs').writeFileSync('zfu.json', JSON.stringify({ id: JSON.parse(fu.t).id }));
await openWizard('QA ZWF ui probe');
await F().getByText('Create', { exact: true }).first().click(); await sleep(1000);
await next(); out.crit = await until(/3 Criteria/); await sleep(2500);
await page.mouse.click(324, 842); out.actions = await until(/All Actions/); if (!out.actions) { await page.mouse.click(324, 842); out.actions = await until(/All Actions/); } await sleep(3000); await notNow();
await page.mouse.click(1297, 526); out.menu = await until(/Assign Ticket/, 20); await sleep(1000);
await F().getByText('Field Updates', { exact: true }).locator('visible=true').first().click(); await sleep(4000); await shot('zui1-fu'); out.fuPanel = (await body(F())).replace(/^.*?4 Actions/, '4 Actions').slice(0, 800);
