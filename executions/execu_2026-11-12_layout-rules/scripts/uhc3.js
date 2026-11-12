async (page, ctx) => {
  const home = '__HOME__'.replace(/\/$/, ''); const p = page.__hc = page.__hc || await ctx.newPage(); p.__net = []; if (!p.__on) { p.__on = 1; p.on('response', async r => { if (/\/forms/.test(r.url())) { try { p.__net.push(r.url().replace(/^.*\/help-center\/public\/[^/]+/, '') + ' ' + (await r.text()).length); p.__last = await r.text(); } catch (e) { } } }); }
  await p.goto(home + '/tickets/new', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(9000);
  const ctrls = async () => p.evaluate(() => [...document.querySelectorAll('label')].map(l => l.innerText.trim().replace(/\s+/g, ' ')).filter(Boolean).slice(0, 40));
  const out = { path: new URL(p.url()).pathname.replace(/hc1\.[^/]+/, '<hc>'), labels: await ctrls() }; await p.screenshot({ path: EV + 'desk-hc-new.png', fullPage: true });
  out.combos = await p.evaluate(() => [...document.querySelectorAll('select, button[role=combobox], [aria-haspopup=listbox]')].map(e => (e.getAttribute('aria-label') || e.name || e.id) + '=' + (e.innerText || e.value || '').trim().slice(0, 40)));
  out.net = p.__net; return out;
}
