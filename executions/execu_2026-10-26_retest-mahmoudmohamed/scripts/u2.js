const card = page.locator('text=EXECUTE BASED ON').locator('xpath=ancestor::div[3]');
await page.getByText('A Ticket Event', { exact: true }).click(); await sleep(1500); await shot('a2-ticket-event');
const t1 = (await card.innerText().catch(() => txt())).split('\n').filter(l => l.trim());
// open any selects within the ticket event area
const sel = page.locator('[role=combobox]'); const n = await sel.count(); const opts = [];
for (let i = 0; i < n; i++) { const s = sel.nth(i); if (!(await s.isVisible())) continue; await s.click().catch(() => {}); await sleep(800); opts.push(await page.locator('[role=option]').allInnerTexts()); await page.keyboard.press('Escape'); await sleep(300); }
await page.getByText('A Record Action', { exact: true }).click(); await sleep(800);
await page.getByRole('button', { name: 'Field Changed', exact: true }).click(); await sleep(1500); await shot('a3-field-changed');
const t2 = (await card.innerText().catch(() => '')).split('\n').filter(l => l.trim());
return done({ t1, opts, t2 });
