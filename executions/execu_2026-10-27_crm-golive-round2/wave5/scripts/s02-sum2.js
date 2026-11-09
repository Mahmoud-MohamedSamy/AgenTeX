await page.locator('[role=dialog] button', { hasText: /^Cancel$/ }).first().click(); await sleep(800);
const clickEdit = async label => { const b = await page.locator(`xpath=//*[normalize-space(text())="${label}"]`).first().boundingBox(); const btns = await page.$$('main button'); let best = null, bd = 1e9; for (const x of btns) { const bb = await x.boundingBox(); if (!bb) continue; const dy = Math.abs(bb.y - b.y), dx = bb.x - b.x; if (dy < 20 && dx > 0 && dx < 400 && dx < bd) { bd = dx; best = x; } } if (best) await best.click(); return !!best; };
const ok = await clickEdit('Row groups'); await sleep(1500);
await shot('s02-rowgroup-editor');
const d = page.locator('[role=dialog]').first();
return { ok, txt: (await d.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 1500) };
