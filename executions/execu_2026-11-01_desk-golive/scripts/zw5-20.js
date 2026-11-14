async (page) => {
  const f = page.locator('#ZD_34'); await f.click({position:{x:60,y:8}}); await page.waitForTimeout(500);
  await page.keyboard.type('N',{delay:150}); await page.waitForTimeout(300); await page.keyboard.type('2026',{delay:120}); await page.waitForTimeout(800);
  const a = await f.inputValue();
  await page.keyboard.press('ArrowRight'); 
  return {a};
}
