await go('/views/all/tickets/' + T1, 9000);
await page.evaluate(() => { window.__p = []; const mo = new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.tagName === 'IFRAME') { window.__p.push('iframe'); try { n.addEventListener('load', () => { try { n.contentWindow.print = () => window.__p.push('iframe.print'); window.__p.push('loaded:' + (n.contentDocument?.body?.innerText || '').replace(/\s+/g, ' ').slice(0, 400)); } catch (e) { window.__p.push('x ' + e.message); } }); } catch (e) {} } }))); mo.observe(document.body, { childList: true, subtree: true }); window.print = () => window.__p.push('window.print'); });
const pp = page.context().waitForEvent('page', { timeout: 8000 }).catch(() => null);
await clickItem('Print'); await page.locator('[role=dialog]').last().getByRole('button', { name: 'Print' }).click(); const np = await pp; await sleep(4000);
out.p = await page.evaluate(() => window.__p); out.np = np ? np.url() : null; out.frames = page.frames().map(f => f.url().slice(0, 80));
for (const f of page.frames().slice(1)) { const t = await f.evaluate(() => document.body.innerText).catch(() => ''); if (t) out.frameText = t.replace(/\s+/g, ' ').slice(0, 600); }
return fin({ out });
