await page.locator("[role=dialog] button:has-text(\"Create Queue\")").click(); await sleep(2500);
await page.locator('[role=dialog] button[aria-label="Module"]').first().click(); await sleep(1000);
out.mods = await page.$$eval('[role=option]', es => es.map(e => e.innerText.trim())).then(a => a.slice(0, 30));
await page.locator('[role=option]:has-text("Transactions")').first().click(); await sleep(1500);
await page.locator('[role=dialog] button[aria-label="Layout"]').first().click(); await sleep(1000);
await page.locator('[role=option]:has-text("Standard")').first().click(); await sleep(800);
await page.locator('[role=dialog] button:has-text("Next")').click(); await sleep(2500);
await page.locator('[role=dialog] button:has-text("Criteria")').first().click(); await sleep(1500);
await page.locator('[role=dialog] button[aria-label="Criteria field"]').first().click(); await sleep(1200);
out.fields = await page.$$eval('[role=option]', es => es.map(e => e.innerText.trim()));
const acc = page.locator('[role=option]:has-text("Account")').first();
if (await acc.count()) { await acc.click(); await sleep(1200);
  await page.locator('[role=dialog] button[aria-label^="Operator for"]').first().click(); await sleep(800); out.ops = await page.$$eval('[role=option]', es => es.map(e => e.innerText.trim()));
  await page.locator('[role=option]').first().click(); await sleep(1500);
  out.valueControls = await page.$$eval('[role=dialog] input, [role=dialog] [role=combobox], [role=dialog] button', es => es.filter(e => e.offsetParent).map(e => e.tagName + ':' + (e.type || '') + ':' + (e.getAttribute('aria-label') || e.placeholder || e.innerText || '').trim().slice(0, 40)).slice(-8));
  await page.screenshot({ path: RAW + 'wq-create-lookup.png' }); }
await page.locator('[role=dialog] button:has-text("Cancel")').last().click(); await sleep(800);
