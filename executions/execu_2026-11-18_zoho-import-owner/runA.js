const FILE='data/A/Tickets.csv', TAG='A3'; const MAP={ 'Department':'Department :: Department Name', 'Email':'Contact :: Contact Email ID' };
// Full import flow for one file. Set FILE and MAP (file column -> exact option label) before this body.
const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_zoho-import-owner/';
const typ = async s => { await page.keyboard.press('Control+A'); await page.keyboard.press('Backspace'); await page.keyboard.type(s); await page.waitForTimeout(1500); };
const choose = async (label) => { for (const l of await page.locator('li:visible').all()) { if ((await l.innerText()).replace(/\s+/g, ' ').trim() === label) { await l.click(); return 1; } } return 0; };
await page.reload({ waitUntil: 'commit' }).catch(()=>{}); await page.waitForTimeout(4000); await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup#setup/data-administration/import', { waitUntil: 'commit' }).catch(()=>{});
await page.waitForTimeout(10000); await page.keyboard.press('Escape').catch(()=>{});
await page.getByText('Not Now').first().click({ timeout: 2000 }).catch(()=>{});
await page.mouse.click(984, 40).catch(()=>{}); await page.waitForTimeout(800); await page.locator('button:visible').filter({ hasText: 'New Import' }).first().click(); await page.waitForTimeout(6000);
await page.locator('[placeholder*="Find a module"]').first().click(); await page.waitForTimeout(1000);
await page.keyboard.type('Tickets'); await page.waitForTimeout(1500);
await page.locator('li').filter({ hasText: /^Tickets$/ }).first().click(); await page.waitForTimeout(1000);
await page.setInputFiles('input[type=file]', D + FILE); await page.waitForTimeout(4000);
for (let i = 0; i < 40; i++) { if (await page.locator('[data-id="nextImportStage_disabled"]').count() === 0) break; await page.waitForTimeout(3000); } await page.getByText(/^Next$/).first().click();
for (let i = 0; i < 30; i++) { await page.waitForTimeout(3000); if (await page.locator('[data-id="findByField_textBox"]:visible').count()) break; }
await page.waitForTimeout(3000);
await page.getByText(/^Create$/).first().click(); await page.waitForTimeout(800);
await page.locator('[data-id="findByField_textBox"]').first().click(); await page.waitForTimeout(1500); out.idNone = await choose('None'); await page.waitForTimeout(1000);
out.map = {};
for (const [col, label] of Object.entries(MAP)) {
  const src = await page.$$eval('input', es => es.filter(e => e.offsetParent && /^source_/.test(e.getAttribute('data-id') || '')).map(e => e.value));
  const idx = src.indexOf(col); if (idx < 0) { out.map[col] = 'no column'; continue; }
  const dest = page.locator('input[data-id^="dest_"][data-id$="_textBox"]:visible').nth(idx);
  await dest.click(); await page.waitForTimeout(1500); await typ(label.split(' :: ').pop());
  out.map[col] = await choose(label); await page.waitForTimeout(1500); await page.keyboard.press('Escape').catch(()=>{});
}
out.src = await page.$$eval('input', es => es.filter(e => e.offsetParent && /^source_/.test(e.getAttribute('data-id') || '')).map(e => e.value));
out.dest = await page.$$eval('input', es => es.filter(e => e.offsetParent && /^dest_/.test(e.getAttribute('data-id') || '') && /_textBox$/.test(e.getAttribute('data-id'))).map(e => e.value));
await page.screenshot({ path: D + 'shots/' + TAG + '-mapping.png', fullPage: true });
await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(800);
await page.locator('[data-id="mapModule"]').first().click({ timeout: 15000 }); await page.waitForTimeout(6000);
await page.mouse.click(75, 837); await page.waitForTimeout(8000);
let t = await body(page); out.step = /Start Import/.test(t) ? 'review' : 'other';
await page.screenshot({ path: D + 'shots/' + TAG + '-review.png' });
if (out.step === 'review') { await page.mouse.click(84, 837); await page.waitForTimeout(20000); }
t = await body(page); const i = t.indexOf('IMPORT ID'); out.list = t.slice(i + 75, i + 200);
