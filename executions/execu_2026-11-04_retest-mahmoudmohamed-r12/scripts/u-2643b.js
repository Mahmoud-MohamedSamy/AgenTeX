const o = {};
const openDrawer = async kind => { await page.goto(H + '/activities', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 40; i++) { await sleep(3000); if (/Add Activity|New Activity/i.test(await text())) break; } await sleep(1500);
  await page.getByRole('button', { name: /Add Activity|New Activity/i }).first().click(); await sleep(1500); await page.getByRole('menuitem', { name: new RegExp('^' + kind) }).first().click().catch(async () => { await page.getByText(kind, { exact: true }).last().click(); }); await sleep(4000); return page.getByRole('dialog').last(); };
let d = await openDrawer('Task');
const sel = d.getByRole('button', { name: 'Select', exact: true }).first(); o.selectBtnContext = await sel.evaluate(e => (e.closest('div')?.parentElement?.innerText || '').replace(/\s+/g, ' ').slice(0, 80)).catch(() => 'none');
await d.getByRole('checkbox', { name: /Set Reminder/ }).check(); await sleep(1500);
o.reminder = (await d.ariaSnapshot()).split('\n').filter(l => /radio|Reminder|combobox|spinbutton|textbox/.test(l) && !/Subject|Ticket|Due Date|Task Owner|Contact|Priority|Status|Description/.test(l)).slice(0, 15);
await shot('2643-b-reminder.png');
for (const k of ['Call', 'Event']) { d = await openDrawer(k); o[k] = (await d.ariaSnapshot()).split('\n').filter(l => /textbox|combobox|button|radio|checkbox|spinbutton/.test(l)).map(l => l.trim()).filter(l => !/Close|Cancel|Save|Information/.test(l)).slice(0, 25); if (k === 'Call') await shot('2643-c-call.png'); }
return o;
