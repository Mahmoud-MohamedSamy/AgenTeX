async (page, ctx) => {
  const HC = 'https://staging-crm.taviportal.com/help/hc1.a7a7a7a7000000000000000000000004.rDvrZfW_-TBcbb_XkySGodjzQfiQLj80dsTNfdLteDw/';
  const c2 = await ctx.browser().newContext({ viewport: { width: 1400, height: 900 } }); const p = await c2.newPage();
  globalThis.__hc = { c2, p };
  await p.goto(HC, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
  const links = await p.locator('a').evaluateAll(as => as.map(a => (a.innerText.trim().slice(0, 30) + ' -> ' + a.getAttribute('href'))).filter(s => /ticket|submit|request|new/i.test(s)).slice(0, 10));
  await p.screenshot({ path: EV + 'desk-hc-home.png' });
  return { url: p.url(), t: (await p.innerText('body')).replace(/\s+/g, ' ').slice(0, 600), links };
}
