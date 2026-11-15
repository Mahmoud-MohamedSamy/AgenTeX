const out = {};
await go('/settings/modules-and-fields/' + MID + '/layouts/bf971461-2edc-45f2-b6e4-6e180aa64288', 10000);
await page.getByText('New Fields', { exact: true }).first().click(); await sleep(1000);
const aside = page.locator('aside, nav').filter({ hasText: /Unused|Fields/ });
const t = await bodyText(); out.leftHeads = (t.match(/(Unused[^.]{0,60}|Existing[^.]{0,60}|Removed[^.]{0,60})/g) || []).slice(0, 5);
const u = page.getByText(/Unused Fields/i).first(); out.u = await u.count(); if (out.u) { await u.click(); await sleep(1500); }
const s = page.getByPlaceholder(/Search/i); out.searches = await s.evaluateAll(e => e.map(x => x.placeholder));
const el = page.getByText('QA RT18SR NUM', { exact: true }).first(); out.found = await el.count();
if (out.found) { await el.scrollIntoViewIfNeeded(); out.elBox = await box(el); await el.hover(); await sleep(600); out.near = await el.locator('xpath=ancestor::*[self::li or self::div][1]').locator('button').evaluateAll(e => e.map(x => x.getAttribute('aria-label') || x.title || x.innerText)); }
await shot('2935-3-unused.png');
return out;
