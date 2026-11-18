const id = 'a578ae5c-05fc-4161-b76c-648dbd0517df'; const out = {}; const U = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(H + '/views/all/tickets/' + id, { waitUntil: 'domcontentloaded' });
await page.getByText('QA BP RT19 HC 3060 ticket').first().waitFor({ timeout: 90000 }).catch(() => {}); await sleep(5000);
await page.getByRole('button', { name: /QA hold/ }).first().click(); await sleep(4000);
const main = page.locator('main').last(); out.visibleUuids = ((await text()).match(U) || []).length;
const ctl = page.getByText('Mona QA RT18 Export', { exact: true }).last(); out.tag = await ctl.evaluate(e => e.tagName + ' ' + (e.closest('button') ? 'in-button' : '') + ' ' + (e.closest('input') ? 'input' : ''));
await ctl.click(); await sleep(3000);
const dl = page.getByRole('dialog'); out.dialogs = await dl.count(); out.picker = (await dl.last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 500);
await page.screenshot({ path: RAW + '3060-3-contact-picker.png' });
// type free text to see it is not a text box
const inp = dl.last().locator('input').first(); out.hasSearch = await inp.count();
if (out.hasSearch) { await inp.fill('VR1112 G7'); await sleep(3000); out.search = (await dl.last().innerText()).replace(/\s+/g, ' ').slice(0, 400); await page.screenshot({ path: RAW + '3060-4-contact-search.png' });
  const opt = dl.last().getByText(/VR1112 G7 ok/).first(); out.opt = await opt.count(); if (out.opt) { await opt.click(); await sleep(2500); } }
const ex = dl.last().getByRole('button', { name: /Select|Choose|Done|Apply/ }); if (await dl.count() && await ex.count()) { await ex.first().click(); await sleep(2000); }
out.formAfter = (await page.locator('text=Moves the ticket to On Hold').locator('xpath=ancestor::*[5]').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400);
await page.screenshot({ path: RAW + '3060-5-picked.png' });
out.uuidsAfter = ((await text()).match(U) || []).length;
return out;
