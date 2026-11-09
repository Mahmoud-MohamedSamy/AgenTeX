const H = 'https://staging-crm.taviportal.com', LEADS = '841043e1-c078-41f9-8d6e-dfd61bee45c3', DEALS = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const firstRow = async (sec) => { const t0 = Date.now(); try { await page.waitForFunction(() => [...document.querySelectorAll('tbody tr')].some(r => r.querySelectorAll('td').length > 3 && r.innerText.trim().length > 5), null, { timeout: sec * 1000 }); return (Date.now() - t0) / 1000; } catch (e) { return -1; } };
out.leadsList = [];
for (let i = 0; i < 3; i++) { await page.goto(H + '/modules/' + LEADS, { waitUntil: 'domcontentloaded' }); out.leadsList.push(await firstRow(40)); }
// kanban on Transactions
await page.goto(H + '/modules/' + DEALS, { waitUntil: 'domcontentloaded' }); await firstRow(40);
const t0 = Date.now(); await page.click('[title="Kanban view"], [aria-label="Kanban view"]');
let kan = -1; try { await page.waitForFunction(() => document.body.innerText.match(/Qualification|qualification/) && document.querySelectorAll('[draggable=true], [data-rbd-draggable-id], [data-card-id]').length > 0, null, { timeout: 30000 }); kan = (Date.now() - t0) / 1000; } catch (e) {}
out.kanbanFirstCards = kan;
out.kanbanToolbar = await page.$$eval('select, [role=combobox], button[aria-haspopup]', es => es.filter(e => e.offsetParent).map(e => (e.getAttribute('aria-label') || e.getAttribute('title') || e.innerText || '').trim().slice(0, 40)));
await page.screenshot({ path: RAW + 'kanban.png' });
// split view on Leads
await page.goto(H + '/modules/' + LEADS, { waitUntil: 'domcontentloaded' }); await firstRow(40);
await page.click('[title="Split view"], [aria-label="Split view"]'); await page.waitForTimeout(4000);
out.splitText = (await page.innerText('main')).replace(/\s+/g, ' ').slice(0, 400);
await page.screenshot({ path: RAW + 'split-view.png' });
