async (page) => {
  await page.mouse.click(390,257); await page.waitForTimeout(1500);
  await page.screenshot({path:'evidence/zoho-w5/z-e1-values.png'});
  const t = (await page.innerText('body')).match(/New value[\s\S]{0,200}/)?.[0].replace(/\s+/g,' ');
  await page.keyboard.press('Escape'); await page.waitForTimeout(500);
  return t;
}
