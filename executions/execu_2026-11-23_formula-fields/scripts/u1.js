await page.goto(H + `/settings/modules-and-fields/${made.mod}/layouts/${made.layouts[0]}`, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); const t = await text(); if (/QA FX Inputs/.test(t)) break; }
await sleep(3000); await shot('A1-builder');
const t = await text(); log(t.slice(0, 2500));
