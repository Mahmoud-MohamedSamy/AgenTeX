async (page) => {
  const out = {};
  await page.mouse.click(305, 427); await page.waitForTimeout(800);
  await page.mouse.click(413, 309); await page.waitForTimeout(2000);
  let t = await page.innerText('body'); out.prompt = t.slice(t.lastIndexOf('Help')).slice(0, 400);
  return out;
}
