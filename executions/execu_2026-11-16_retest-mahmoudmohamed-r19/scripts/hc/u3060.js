const id = 'a578ae5c-05fc-4161-b76c-648dbd0517df'; const out = {}; const U = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(H + '/views/all/tickets/' + id, { waitUntil: 'domcontentloaded' });
await page.getByText('QA BP RT19 HC 3060 ticket').first().waitFor({ timeout: 90000 }).catch(() => {}); await sleep(5000);
await page.screenshot({ path: RAW + '3060-1-ticket.png' });
const b = page.getByRole('button', { name: /QA hold/ }).first();
out.btn = await b.count(); if (!out.btn) { await page.getByText('QA hold').first().click(); } else await b.click();
await sleep(5000);
const dlg = page.getByRole('dialog').first(); const dt = (await dlg.innerText().catch(() => text())).replace(/\s+/g, ' ');
out.form = dt.slice(0, 900); out.uuidsInForm = (dt.match(U) || []); 
const html = await dlg.innerHTML().catch(()=> ''); out.uuidsInFormHtmlAttrs = [...new Set(html.match(U) || [])].length;
out.bodyUuids = ((await text()).match(U) || []);
out.inputs = await dlg.locator('input').evaluateAll(es => es.map(e => [e.type, e.value, e.placeholder]));
await page.screenshot({ path: RAW + '3060-2-transition-form.png' });
// click contact control
const c = dlg.getByText('Mona QA RT18 Export').first(); out.contactCtl = await c.count();
if (out.contactCtl) { await c.click(); await sleep(3000); out.afterClick = (await text()).replace(/\s+/g, ' ').slice(0, 0); const d2 = page.getByRole('dialog'); out.dialogs = await d2.count(); out.picker = (await d2.last().innerText().catch(()=> '')).replace(/\s+/g,' ').slice(0, 600); await page.screenshot({ path: RAW + '3060-3-contact-picker.png' }); await page.keyboard.press('Escape'); await sleep(1000); }
return out;
