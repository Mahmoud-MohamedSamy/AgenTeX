// New-build recheck of composer gaps (no send): Articles panel, send options, subject, toolbar; "Also copied" line removable for this reply?
await page.setViewportSize({ width: 1600, height: 900 });
const out = {}; const tk = '0101efed-3a26-4348-b535-77d46f210379';
try {
  await api('POST', `/desk/tickets/${tk}/reopen`, {});
  await go(`/modules/${M.tickets}/records/${tk}`, 4000);
  await page.evaluate(() => { for (const k of Object.keys(localStorage)) if (k.startsWith('desk.composer.draft:')) localStorage.removeItem(k); });
  await go(`/modules/${M.tickets}/records/${tk}`, 10000);
  for (let i = 0; i < 3 && !(await txt()).includes('CONVERSATION'); i++) await go(`/modules/${M.tickets}/records/${tk}`, 15000);
  await page.locator('main button').filter({ hasText: /^Reply All/ }).first().click(); await sleep(5000);
  out.subject = await page.locator('input[aria-label="Subject"]').inputValue().catch(() => '?');
  out.toolbar = await page.$$eval('main [contenteditable=true]', () => 1).then(() => page.$$eval('main button[aria-label], main select', bs => [...new Set(bs.map(b => b.getAttribute('aria-label') || b.tagName))].filter(x => !/Collapse|Edit |Remove |Scroll|Ticket Properties/.test(x))));
  out.alsoCopied = ((await txt()).match(/Also copied on this ticket:[^\n]*(\n[^\n]*)?/) || [''])[0];
  out.alsoCopiedX = await page.$$eval('main button', bs => bs.filter(b => /example\.com/.test(b.getAttribute('aria-label') || '') || /example\.com/.test(b.closest('div') && b.closest('div').textContent || '')).map(b => b.getAttribute('aria-label') || b.textContent.trim()).slice(0, 5));
  await page.getByRole('button', { name: 'Articles' }).click().catch(e => out.artErr = String(e.message).slice(0, 80)); await sleep(2500);
  out.articles = ((await txt()).match(/Articles[\s\S]{0,600}/g) || []).slice(-1)[0];
  out.artShot = await shot('ev-RPL-articles');
  await page.keyboard.press('Escape'); await sleep(600);
  const ed = page.locator('[aria-label="Reply body"]'); await ed.click(); await page.keyboard.type('x'); await sleep(500);
  await page.locator('button[aria-label="More send options"]').last().click(); await sleep(1200);
  out.sendOptions = await page.$$eval('[role=menuitem]', ms => ms.map(m => m.textContent.trim()));
  out.sendShot = await shot('ev-RPL-sendoptions');
  await page.keyboard.press('Escape'); await sleep(400);
  await page.keyboard.press('Control+A'); await page.keyboard.press('Delete');
  await page.getByRole('button', { name: 'Cancel', exact: true }).last().click().catch(() => {}); await sleep(1000);
  const d = page.locator('[role=dialog] button, [role=alertdialog] button').filter({ hasText: /Discard/ }); if (await d.count()) await d.first().click();
  await page.evaluate(() => { for (const k of Object.keys(localStorage)) if (k.startsWith('desk.composer.draft:')) localStorage.removeItem(k); });
  await api('POST', `/desk/tickets/${tk}/close`, {});
} catch (e) { out.err = String(e.message).slice(0, 300); await shot('ev5-error'); }
return JSON.stringify(out);
