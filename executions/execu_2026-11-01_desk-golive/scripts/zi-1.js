async (p0, frame, ctx) => { const page = ctx.pages()[ctx.pages().length - 1]; const o = {};
  await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/setup/landing', { waitUntil: 'domcontentloaded' }).catch(e => o.e = String(e).slice(0, 100)); await page.waitForTimeout(10000);
  const np = page.locator('text=/^Not Now$/'); if (await np.count()) await np.first().click().catch(() => {});
  o.url = page.url(); const txt = []; for (const f of page.frames()) txt.push(await f.locator('a').evaluateAll(as => as.map(a => (a.innerText || '').trim() + ' => ' + a.getAttribute('href')).filter(s => s.length < 160)).catch(() => []));
  o.links = txt.flat().filter(s => /setup/i.test(s)).slice(0, 150);
  return o; }
