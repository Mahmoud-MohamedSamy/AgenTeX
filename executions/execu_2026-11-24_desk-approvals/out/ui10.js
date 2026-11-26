await go('/settings/personal/locale'); await sleep(5000);
const main = page.locator('main').first();
const o = { text: (await main.innerText().catch(() => '')).slice(0, 1500) };
o.controls = await main.locator('select, [role=combobox], input').evaluateAll(es => es.map(e => ({ tag: e.tagName, id: e.id, name: e.getAttribute('name'), aria: e.getAttribute('aria-label'), val: e.value || e.innerText || e.textContent })).slice(0, 20));
await shot('ui10-B-locale-before');
return o;
