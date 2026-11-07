const o = {};
await page.goto(H + '/activities', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 40; i++) { await sleep(3000); if (/Add Activity|New Activity|Add Task/i.test(await text())) break; } await sleep(2000);
o.url = page.url();
const add = page.getByRole('button', { name: /Add Activity|New Activity/i }).first(); await add.click(); await sleep(1500);
await page.getByRole('menuitem', { name: /^Task/ }).first().click().catch(async () => { await page.getByText('Task', { exact: true }).last().click(); }); await sleep(4000);
const dlg = page.getByRole('dialog').last(); await shot('2643-a-drawer.png');
o.aria = (await dlg.ariaSnapshot().catch(e => 'ERR ' + e.message)).split('\n').filter(l => /textbox|combobox|button|radio|checkbox|spinbutton|listbox/.test(l)).slice(0, 40);
// accessible names computed by the browser for every form control
o.names = await dlg.locator('input, select, textarea, button[role=combobox], [role=combobox], [role=radio], [contenteditable=true]').evaluateAll(els => els.map(e => { const id = e.id; const lab = id ? document.querySelector('label[for="' + id + '"]')?.innerText : ''; const lb = e.getAttribute('aria-labelledby'); const lbt = lb ? lb.split(' ').map(x => document.getElementById(x)?.innerText || '').join(' ') : ''; return (e.getAttribute('role') || e.tagName) + ' | aria-label=' + (e.getAttribute('aria-label') || '') + ' | labelledby=' + lbt.slice(0, 40) + ' | label=' + (lab || e.closest('label')?.innerText || '').slice(0, 40) + ' | ph=' + (e.placeholder || ''); }));
return o;
