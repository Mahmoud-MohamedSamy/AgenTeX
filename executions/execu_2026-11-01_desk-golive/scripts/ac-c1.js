const subj = async () => [...new Set((await page.locator('main').last().innerText().catch(() => '')).match(/QA AC [A-Z0-9]+/g) || [])].sort().join(',');
await go('/views/all/tickets', 10000); out.listUI = await subj(); await shot('access/c-list');
// global search
await page.keyboard.press('Control+k'); await sleep(1500); await page.keyboard.type('QA AC MK1'); await sleep(5000);
out.gsearch = (await page.locator('[role=dialog],[cmdk-root],[role=listbox]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 500); await shot('access/c-gsearch'); await page.keyboard.press('Escape');
const gs = await api('GET', '/search?q=' + encodeURIComponent('QA AC MK1')); out.gsApi = gs.s + ' ' + gs.t.slice(0, 300);
// open MK1 by URL
await go('/views/all/tickets/' + TK.MK1, 10000); out.mk1UI = (await mtxt()).slice(0, 400); await shot('access/c-mk1-url');
// create: department picker
await go('/views/all/tickets', 6000);
const plus = page.getByRole('button', { name: /^(New|Create|\+)$|Quick create|Create new/i }).first(); await plus.click().catch(() => {}); await sleep(1500);
out.plusMenu = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' | ').slice(0, 300);
await page.getByRole('menuitem', { name: /Ticket/ }).first().click().catch(() => {}); await sleep(5000);
out.createUrl = page.url(); out.createTxt = (await mtxt()).slice(0, 600);
const dsel = page.getByRole('combobox', { name: /Department/i }).first(); if (await dsel.count()) { await dsel.click(); await sleep(1500); out.deptOpts = (await page.locator('[role=listbox]').last().innerText().catch(() => '')).replace(/\s+/g, ' | '); await shot('access/c-create-dept'); await page.keyboard.press('Escape'); }
const cr = await api('POST', '/modules/' + TM + '/records', { data: [{ field: 'subject', value: sv('QA AC C into Marketing') }, { field: 'department', value: sv(DEP.MKT) }, { field: 'status', value: sv('Open') }, { field: 'email', value: sv('qa-ac-c1@example.com') }] }); out.apiCreateMkt = cr.s + ' ' + cr.t.slice(0, 250); if (cr.s < 300 && D(cr.j)?.id) CREATED.push({ kind: 'ticket', id: D(cr.j).id, name: 'QA AC C into Marketing' });
return fin({ out });
