// Read-only: Send drop-down (force-click the arrow), no send
const out = {}; const T = '4ea11dd5-468a-487c-a967-74b81e8c12cc';
await go(`/modules/${M.tickets}/records/${T}`, 14000);
await page.getByRole('button', { name: 'Reply All', exact: true }).click(); await sleep(5000);
const b = page.locator('button[aria-label="More send options"]').last();
out.disabled = await b.isDisabled().catch(e => 'ERR'); out.visible = await b.isVisible().catch(() => 'ERR');
await b.scrollIntoViewIfNeeded().catch(() => {}); await b.click({ force: true, timeout: 5000 }).catch(e => out.err = String(e.message).slice(0, 80)); await sleep(1500);
out.menu = await page.$$eval('[role=menuitem], [role=menuitemradio], [role=menu] *', bs => [...new Set(bs.filter(b => b.offsetParent !== null && b.children.length < 2).map(b => b.innerText.trim()).filter(Boolean))]);
out.shot = await shot('tavi-send-options');
await page.keyboard.press('Escape'); await sleep(500);
const c = page.getByRole('button', { name: 'Cancel', exact: true }); if (await c.count()) await c.last().click();
return done(out);
