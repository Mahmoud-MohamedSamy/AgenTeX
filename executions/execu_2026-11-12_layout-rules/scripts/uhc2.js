async (page, ctx) => {
  const home = '__HOME__'.replace(/\/$/, ''); const p = page.__hc || (page.__hc = await ctx.newPage());
  await p.goto(home + '/sign-up', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
  const inputs = await p.evaluate(() => [...document.querySelectorAll('input')].map(i => i.name + ':' + i.type + ':' + (i.placeholder || '') + ':' + (i.labels && i.labels[0] ? i.labels[0].innerText : '')));
  await p.screenshot({ path: EV + 'desk-hc-signup.png' }); return { path: new URL(p.url()).pathname, inputs, txt: (await p.innerText('body')).replace(/\s+/g, ' ').slice(0, 500) };
}
