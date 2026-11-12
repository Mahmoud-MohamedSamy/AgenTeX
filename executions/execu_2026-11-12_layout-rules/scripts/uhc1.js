async (page, ctx) => {
  const home = '__HOME__';
  const p = await ctx.newPage(); await p.goto(home.replace(/\/$/, '') + '/tickets/new', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(10000);
  const txt = (await p.innerText('body')).replace(/\s+/g, ' ').slice(0, 900); await p.screenshot({ path: EV + 'desk-hc-0.png' });
  return { path: new URL(p.url()).pathname, txt };
}
