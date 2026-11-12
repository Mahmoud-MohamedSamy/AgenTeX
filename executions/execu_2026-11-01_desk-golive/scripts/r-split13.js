const o = { entries: [] }; const TK = '47dc8f0e-9c3a-49d4-9cbc-025a3ece15a5';
await page.goto(H + '/views/all/tickets/' + TK, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await sleep(12000);
const B = page.locator('button[aria-label="Conversation entry actions"]'); const n = await B.count(); o.n = n;
for (let i = 0; i < n; i++) { const b = B.nth(i); await b.scrollIntoViewIfNeeded().catch(() => {}); await sleep(800);
  const head = await b.evaluate(el => { let c = el; for (let k = 0; k < 8 && c; k++) { c = c.parentElement; if (c && c.innerText && c.innerText.length > 60) break; } return (c && c.innerText || '').replace(/\s+/g, ' ').slice(0, 140); });
  await b.click().catch(() => {}); await sleep(1500); const items = await page.locator('[role=menuitem]').allInnerTexts().catch(() => []);
  o.entries.push([i, head, items.join(' | ')]);
  if (items.some(x => /split/i.test(x))) { o.shotMenu = await shot('../wave2n/r-split-menu4'); o.splitAt = i; break; }
  await page.keyboard.press('Escape'); await sleep(600); }
if (o.splitAt !== undefined) { await page.locator('[role=menuitem]', { hasText: /split/i }).first().click(); await sleep(3000); o.dialog = (await page.locator('[role=dialog], [role=alertdialog]').allInnerTexts().catch(() => [])).join(' | ').slice(0, 600); o.shotDialog = await shot('../wave2n/r-split-dialog'); }
return done(o);
