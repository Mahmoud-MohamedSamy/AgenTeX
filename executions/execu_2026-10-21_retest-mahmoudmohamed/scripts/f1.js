const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const r = arr((await api('GET', `/modules/${D}/records?page=1&per_page=200`)).j.data).find(x => /QA RT 1325 open/.test(JSON.stringify(x.data)));
await go(`/modules/${D}/records/${r.id}`, 9000);
await page.locator('main').getByText('closed_lost', { exact: true }).first().click(); await sleep(2500);
const d = page.locator('[role=dialog]').last();
const t = await d.innerText();
const ctrls = await d.locator('select, button[aria-haspopup=listbox], input, textarea').evaluateAll(es => es.map(e => e.tagName + ' ' + (e.type||'') + ' ' + (e.getAttribute('aria-label') || e.placeholder || '') + ' = ' + (e.tagName === 'SELECT' ? [...e.options].map(o => o.text).join('|') : (e.innerText || e.value || ''))));
await shot('1311-01-modal');
return done({ id: r.id, t, ctrls });
