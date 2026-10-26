const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const d = page.locator('[role=dialog]').last();
const b = d.getByRole('button', { name: 'Choose a field' }); await b.click(); await sleep(1000);
const id = await b.getAttribute('aria-controls');
const fields = await page.evaluate(id => (document.getElementById(id) || document.querySelector('[role=listbox]'))?.innerText.split('\n').map(s => s.trim()).filter(Boolean), id);
const hasPipe = (fields || []).includes('Pipeline');
if (hasPipe) { await page.locator(id ? `#${id}` : '[role=listbox]').getByText('Pipeline', { exact: true }).first().click(); await sleep(1500); }
const after = (await d.innerText()).slice(0, 600);
const ctrls = await d.locator('button, select, input').evaluateAll(es => es.map(e => (e.tagName + ' ' + (e.getAttribute('aria-label') || e.placeholder || '') + ' | ' + (e.innerText || e.value || '').trim()).slice(0, 70)));
await shot('1316-04-pipeline-field');
return done({ fields: (fields || []).slice(0, 40), hasPipe, after, ctrls });
