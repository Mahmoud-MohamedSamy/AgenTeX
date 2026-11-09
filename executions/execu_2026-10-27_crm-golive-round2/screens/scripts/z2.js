const has = async () => (await page.innerText('body')).replace(/\s+/g, ' ').match(/.{0,100}[Ss]hortcut.{0,600}/)?.[0] || null;
await page.locator('body').click({ position: { x: 300, y: 900 } }).catch(() => {});
out.tries = {};
for (const k of ['Shift+Slash', 'Control+Slash', 'Alt+Slash', 'Control+Shift+Slash', 'Alt+k', 'Control+Space', 'Slash']) { await page.keyboard.press(k); await sleep(1800); out.tries[k] = await has(); await page.screenshot({ path: RAW + 'z-key-' + k.replace(/\W/g, '_') + '.png' }); await page.keyboard.press('Escape'); await sleep(600); }
// profile menu (read-only open)
await page.locator('[data-zcqa="userProfile"], img[alt*="profile" i], .zcrm-profile, [aria-label*="Profile" i]').first().click().catch(e => out.pErr = String(e.message).slice(0, 80)); await sleep(2500);
out.profile = (await page.innerText('body')).replace(/\s+/g, ' ').slice(0, 600); out.profileShortcut = await has();
await page.screenshot({ path: RAW + 'z-profile.png' }); await page.keyboard.press('Escape');
