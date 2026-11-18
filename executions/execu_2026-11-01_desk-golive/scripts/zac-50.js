const all = async () => { const t = []; for (const f of page.frames()) t.push(await f.innerText('body').catch(() => '')); return t.join(' ').replace(/\s+/g, ' '); };
const a = await all(); const i = a.indexOf('Contact Notifications'); out.txt = a.slice(i, i + 2500);
const loc = page.getByText(/shared ticket/i).first(); if (await loc.count()) { await loc.scrollIntoViewIfNeeded(); await page.waitForTimeout(800); await shotZ(page, 'ac2-notif-shared'); out.found = 1; }
