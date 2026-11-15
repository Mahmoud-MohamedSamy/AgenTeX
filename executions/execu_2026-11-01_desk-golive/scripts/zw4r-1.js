async (page) => {
  const r = {};
  for (const h of ['setup/channels/customerhappiness', 'setup/customerhappiness', 'setup/customization/customerhappiness']) {
    await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup#' + h, { waitUntil: 'commit', timeout: 60000 }).catch(() => {});
    let t = ''; for (let i = 0; i < 15; i++) { await page.waitForTimeout(1500); t = (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' '); if (/happiness/i.test(t) && t.length > 500) break; }
    r[h] = page.url().split('#')[1] + ' :: ' + (t.match(/.{0,100}[Hh]appiness.{0,500}/) || [t.slice(0, 300)])[0];
    if (/happiness/i.test(t)) { await page.screenshot({ path: 'evidence/zoho-w4r/setup-happiness.png' }); break; }
  }
  return r;
}
