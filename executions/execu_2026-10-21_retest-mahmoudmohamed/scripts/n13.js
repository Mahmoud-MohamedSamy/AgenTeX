const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const fl = arr((await api('GET', `/modules/${L}/fields`)).j.data).filter(f => /formula|rollup/.test(f.datatypeKey)).length;
const src = page.getByText(/^Rollup Sum/).first(); const sb = await src.boundingBox();
await page.mouse.move(sb.x + 20, sb.y + 8); await page.mouse.down(); await sleep(200);
for (let i = 1; i <= 25; i++) { await page.mouse.move(sb.x + 20 + (580 - sb.x - 20) * i / 25, sb.y + 8 + (470 - sb.y - 8) * i / 25); await sleep(40); }
await sleep(300); await page.mouse.up(); await sleep(2500);
const side = (await txt()).includes('Field Properties') ? (await txt()).split('Field Properties')[1]?.slice(0, 1500) : null;
await shot('1444-01-rollup-dropped');
return done({ formulaFieldsOnLeads: fl, sb, side });
