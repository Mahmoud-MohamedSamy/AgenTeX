const H = 'https://staging-crm.taviportal.com', LEADS = '841043e1-c078-41f9-8d6e-dfd61bee45c3', DEALS = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const rows = async (sec) => { const t0 = Date.now(); try { await page.waitForSelector("tbody tr a[href*='/records/'], [role=row] a[href*='/records/']", { timeout: sec * 1000 }); return (Date.now() - t0) / 1000; } catch (e) { return -1; } };
out.leadsList = [];
for (let i = 0; i < 3; i++) { await page.goto(H + '/modules/' + LEADS, { waitUntil: 'domcontentloaded' }); out.leadsList.push(await rows(40)); }
await page.screenshot({ path: RAW + 'leads-list.png' });
const btns = await page.$$eval('button, [role=button], [role=tab]', bs => bs.map(b => (b.getAttribute('title') || b.getAttribute('aria-label') || b.innerText || '').trim()).filter(Boolean));
out.toolbarButtons = [...new Set(btns)].slice(0, 60);
