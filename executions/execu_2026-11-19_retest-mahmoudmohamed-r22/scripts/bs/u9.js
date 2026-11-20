const out = {};
await page.goto(H + '/modules/0924eb24-e42a-4eab-8efd-e3428f19e882/records/new', { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 30; i++) { await sleep(2000); if (/Support Plan/i.test(await text())) break; } await sleep(2000);
out.t = (await text()).replace(/\s+/g, ' ').slice(0, 1500);
out.inputs = await page.locator('input,select,button[role=combobox],[role=combobox]').evaluateAll(es => es.map(e => [e.tagName, e.getAttribute('role'), e.getAttribute('aria-label') || e.getAttribute('placeholder') || e.name || e.id, (e.innerText || e.value || '').slice(0, 30)]).slice(0, 40));
await shot('2841-1-newform.png', { fullPage: true });
return out;
