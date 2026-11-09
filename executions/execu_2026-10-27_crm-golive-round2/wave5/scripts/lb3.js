const res = [];
for (let k = 0; k < 8; k++) {
  const src = page.locator('text=/^QA (Pick|Sub pick|Email|Number|Text|Formula|Auto|Rollup)$/').first();
  if (!(await src.count())) break;
  const name = (await src.innerText()).trim();
  const b = await src.boundingBox();
  const sec = await page.locator('text=Basic Information').first().boundingBox();
  await page.mouse.move(b.x + 10, b.y + b.height / 2); await page.mouse.down();
  await page.mouse.move(b.x + 40, b.y + 20, { steps: 5 });
  await page.mouse.move(1250, sec.y + 140, { steps: 20 }); await sleep(300);
  await page.mouse.move(1260, sec.y + 150, { steps: 5 }); await sleep(300);
  await page.mouse.up(); await sleep(1200);
  const still = await page.locator('text=/^' + name + '$/').count();
  res.push(name + ' -> occurrences ' + still);
}
await shot('lb-after-drag');
return res;
