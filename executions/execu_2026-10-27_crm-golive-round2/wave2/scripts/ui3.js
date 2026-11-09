const H = 'https://staging-crm.taviportal.com', LEADS = '841043e1-c078-41f9-8d6e-dfd61bee45c3', DEALS = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const wait = ms => page.waitForTimeout(ms);
const firstRow = async (sec) => { try { await page.waitForFunction(() => [...document.querySelectorAll('tbody tr')].some(r => r.querySelectorAll('td').length > 3), null, { timeout: sec * 1000 }); } catch (e) {} };
// --- kanban view on Transactions
await page.goto(H + '/modules/' + DEALS, { waitUntil: 'domcontentloaded' }); await firstRow(40);
await page.click('[title="Kanban view"], [aria-label="Kanban view"]'); await wait(1500);
await page.fill('input[placeholder="Enter view name"]', 'QA R2W2 KB'); 
const t0 = Date.now(); await page.click('[role=dialog] button:has-text("Save")');
let kan = -1; try { await page.waitForFunction(() => /Qualification/i.test(document.querySelector('main').innerText) && !document.querySelector('[role=dialog]') && document.querySelector('main').innerText.split('\n').length > 30, null, { timeout: 40000 }); kan = (Date.now() - t0) / 1000; } catch (e) {}
await wait(3000); out.kanbanSeconds = kan; out.kanbanUrl = page.url(); out.kanbanText = (await page.innerText('main')).replace(/\s+/g, ' ').slice(0, 500);
await page.screenshot({ path: RAW + 'kanban-view.png' });
// --- split view on Leads
await page.goto(H + '/modules/' + LEADS, { waitUntil: 'domcontentloaded' }); await firstRow(40);
await page.click('[title="Split view"], [aria-label="Split view"]'); await wait(1500);
await page.fill('input[placeholder="Enter view name"]', 'QA R2W2 SV');
await page.click('[role=dialog] button:has(svg[class*="pen"]), [role=dialog] [aria-label*="dit"]').catch(() => {});
await wait(1500); out.splitPicker = (await page.innerText('body')).replace(/\s+/g, ' ').match(/Splits.{0,400}/)?.[0];
await page.screenshot({ path: RAW + 'split-picker.png' });
