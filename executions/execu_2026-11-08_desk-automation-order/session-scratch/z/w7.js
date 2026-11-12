async (page) => {
  const f = page.frames().find(x => x !== page.mainFrame() && /ShowHomePage|support/.test(x.url()));
  const inputs = await f.$$eval('input:not([type=hidden]),textarea', e => e.filter(x => x.offsetParent).map(x => ({ id: x.id, name: x.name, tag: x.tagName, max: x.maxLength, val: (x.value || '').length })));
  return { furl: f.url().slice(0, 120), inputs };
}
