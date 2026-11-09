const M = 'b4848bdf-9f59-45a9-8336-9f4f2a4fc36b', PID = '2d617f97-13b9-4d22-bb52-742533b4b1a3';
await page.locator('main button', { hasText: /^Actions$/ }).first().click(); await sleep(1200);
const menu = await page.evaluate(() => [...document.querySelectorAll('[role=menu]')].map(e => e.innerText.replace(/\s+/g, ' ')).join(' || '));
await shot('c10-actions-menu'); await page.keyboard.press('Escape');
// trigger formula recompute by an edit
const e = await call('PATCH', `/modules/${M}/records/${PID}`, { data: [{ field: 'qa_num', value: { kind: 'number', value: 4 } }] });
await sleep(2000);
const v = await call('GET', `/modules/${M}/records/${PID}`);
return { menu, edit: e.s + ' ' + e.t.slice(0, 200), vals: JSON.stringify((v.j.data.data || []).filter(x => /qa_sumf|qa_num|qa_formula/.test(x.field))) };
