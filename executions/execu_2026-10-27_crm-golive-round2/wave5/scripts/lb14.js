const res = {};
const openMenu = async label => { const f = page.locator(`text=/^${label}$/`).first(); const b = await f.boundingBox(); await page.mouse.move(b.x + 50, b.y + 5); await sleep(600); let best = null, bd = 1e9; for (const x of await page.$$('main button[aria-label="Field options"]')) { const bb = await x.boundingBox(); if (!bb) continue; const dy = Math.abs((bb.y + bb.height / 2) - (b.y + b.height / 2)), dx = bb.x - b.x; if (dy < 25 && dx > 0 && dx < 700 && dx < bd) { bd = dx; best = x; } } await best.click(); await sleep(900); };
await openMenu('QA Email'); await page.locator('text=Mark as Unique').first().click(); await sleep(1200);
if (await page.locator('button', { hasText: /^(Confirm|OK|Yes|Mark as Unique)$/ }).count()) { res.uq = 'confirm'; }
await shot('c01-2423-unique');
await openMenu('QA Email'); await page.locator('text=Mark as Required').first().click(); await sleep(1200);
await openMenu('QA Text'); await page.locator('text=Edit Properties').first().click(); await sleep(1500);
const panel = page.locator('xpath=//*[normalize-space(text())="Field Properties"]/ancestor::*[.//button[normalize-space(.)="Apply"]][1]').first();
await panel.locator('button, [role=tab]', { hasText: /^VALIDATION$/ }).first().click(); await sleep(1000);
res.val = (await panel.innerText()).replace(/\s+/g, ' ').slice(0, 1200);
res.valInputs = await panel.locator('input, textarea, select').evaluateAll(is => is.map(i => i.tagName + ':' + (i.getAttribute('aria-label') || i.placeholder || '') + '=' + i.value));
await shot('c01-2423-validation');
return res;
