const o = {};
await page.goto(H + '/settings/automation/workflow-rules', { waitUntil: 'commit' }); await page.locator('tbody tr').first().waitFor({ timeout: 120000 }); await sleep(2000);
const pager = page.getByText(/\d+\s*[–-]\s*\d+\s+of\s+\d+/).first(); await pager.scrollIntoViewIfNeeded(); await sleep(800);
const bar = pager.locator('xpath=ancestor::*[.//button][1]');
o.barText = await bar.innerText().catch(() => ''); o.barHtmlButtons = await bar.locator('button, select, [role=combobox]').evaluateAll(es => es.map(e => ({ tag: e.tagName, aria: e.getAttribute('aria-label'), text: (e.innerText || e.value || '').trim(), disabled: e.disabled })));
o.url = page.url();
await shot('3231-bottom');
const bb = await bar.boundingBox(); o.barBox = bb;
return o;
