const P = '[data-testid="tia-panel"]';
await go('/'); await page.waitForTimeout(3000);
if (await page.locator(P).count()) { await page.keyboard.press('Escape'); await page.waitForTimeout(500); }
let hit = -1; for (let i = 0; i < 120; i++) { await page.keyboard.press('Tab'); const t = await page.evaluate(() => document.activeElement?.getAttribute('data-testid')); if (t === 'tia-launcher') { hit = i + 1; break; } }
log('tabs to launcher', hit);
if (hit > 0) { await page.keyboard.press('Enter'); await page.waitForTimeout(1500); log('focus after open', await page.evaluate(() => document.activeElement?.tagName + ':' + document.activeElement?.getAttribute('aria-label')));
  const seen = []; for (let i = 0; i < 10; i++) { await page.keyboard.press('Shift+Tab'); seen.push(await page.evaluate(() => document.activeElement?.getAttribute('aria-label') || document.activeElement?.tagName)); } log('shift-tab order', seen.join(' > ')); }
log('panel role', await page.locator(P).getAttribute('role'), 'aria-label', await page.locator(P).getAttribute('aria-label'));
log('announcer', await page.locator('[data-testid="tia-announcer"]').evaluate(e => e.getAttribute('aria-live') + '/' + e.getAttribute('role')).catch(() => 'none'));
const unnamed = await page.$$eval(`${P} button`, b => b.filter(x => !(x.getAttribute('aria-label') || x.innerText.trim())).length); log('unnamed buttons', unnamed);
const ctr = await page.evaluate(() => { const L = s => { const m = s.match(/\d+(\.\d+)?/g).map(Number); const c = m.slice(0, 3).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  const bgOf = e => { while (e) { const b = getComputedStyle(e).backgroundColor; if (b && !/rgba\(0, 0, 0, 0\)|transparent/.test(b)) return b; e = e.parentElement; } return 'rgb(255,255,255)'; };
  const out = {}; for (const [k, sel] of Object.entries({ disclaimer: '[data-testid="tia-panel"] p, [data-testid="tia-panel"] small', input: '[data-testid="tia-panel"] textarea', header: '[data-testid="tia-panel-header"]' })) { const e = [...document.querySelectorAll(sel)].find(x => x.innerText || x.placeholder); if (!e) continue; const a = L(getComputedStyle(e).color), b = L(bgOf(e)); out[k] = ((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2); } return out; });
log('contrast', JSON.stringify(ctr));
await page.setViewportSize({ width: 800, height: 450 }); await page.waitForTimeout(1500); await shot('M10-zoom200'); const bb = await page.locator(P).boundingBox(); log('zoom box', JSON.stringify(bb));
await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('tia.panel')).forEach(k => localStorage.removeItem(k)));
return 'ok';
