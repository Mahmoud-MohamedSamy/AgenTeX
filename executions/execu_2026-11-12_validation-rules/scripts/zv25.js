async (page, ctx, h) => {
  await page.waitForTimeout(5000);
  const ins = await page.$$eval('input,textarea', is => is.map(i => [i.id, i.name, i.getAttribute('aria-label'), i.getAttribute('data-zcqa')].filter(Boolean).join('|')).filter(x => /Last|Company|VR1112/i.test(x)));
  return { ins, txt: (await page.innerText('body')).slice(-300) };
}
