await go('/activities', 6000); for (let i = 0; i < 30 && !(await txt()).includes('Total Count'); i++) await sleep(1000);
await page.getByRole('button', { name: 'Add Activity' }).first().click(); await sleep(1000); await page.getByRole('menuitem', { name: /Task/ }).first().click(); await sleep(3000);
const f = await page.$$eval('input, textarea, [contenteditable=true], button', es => es.filter(e => e.offsetParent !== null).map(e => { const lab = e.id ? document.querySelector('label[for="' + e.id + '"]') : null; return [e.tagName, e.type || '', e.getAttribute('name') || '', e.getAttribute('aria-label') || '', e.getAttribute('placeholder') || '', lab ? lab.innerText : '', (e.closest('[role=dialog]') ? 'DLG' : '') + (e.closest('aside') ? 'ASIDE' : '')].join('|'); }));
await page.keyboard.press('Escape');
return JSON.stringify(f.filter(x => /DLG|ASIDE/.test(x)));
