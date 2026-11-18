const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_zoho-import-owner/';
await page.screenshot({ path: D + 'shots/10-state.png' });
out.inp = await page.$$eval('input', es => es.filter(e=>e.offsetParent).map(e => ({ v: e.value, ph: e.placeholder, ty: e.type, ro: e.readOnly, dt: e.getAttribute('data-id') || e.getAttribute('data-test-id') })).slice(0, 30));
