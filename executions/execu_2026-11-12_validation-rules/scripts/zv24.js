async (page, ctx, h) => {
  await page.waitForTimeout(3000);
  const ins = await page.$$eval('input,textarea', is => is.slice(0,40).map(i => [i.id, i.name, i.getAttribute('aria-label'), i.getAttribute('data-zcqa'), i.placeholder].filter(Boolean).join('|')));
  const frames = page.frames().map(f => f.url()).slice(0,5);
  return { n: ins.length, ins, frames, txt: (await page.innerText('body')).slice(0, 500) };
}
