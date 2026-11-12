async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  await page.mouse.click(497, 322); await page.waitForTimeout(500);
  await page.keyboard.type('QA AO WF Z ' + 'x'.repeat(289), { delay: 2 });
  const el = await page.evaluate(() => { const a = document.activeElement; return { tag: a.tagName, max: a.maxLength, len: (a.value || a.innerText || '').length, attrs: [...a.attributes].map(x => x.name + '=' + x.value.slice(0, 40)).join(' ') }; });
  await page.mouse.click(497, 515); await page.keyboard.type('d'.repeat(10), { delay: 2 });
  const de = await page.evaluate(() => { const a = document.activeElement; return { tag: a.tagName, max: a.maxLength }; });
  await page.screenshot({ path: O + 'w6.png' });
  return { name: el, desc: de };
}
