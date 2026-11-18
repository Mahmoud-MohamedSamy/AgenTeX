async (page) => { const more = async (page, item) => { await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(500); await page.locator('[data-title="More Actions (M)"]').first().click(); await page.waitForTimeout(1500); const li = page.locator('li').filter({ hasText: new RegExp('^\s*' + item) }); await li.first().scrollIntoViewIfNeeded().catch(() => {}); await li.first().click(); await page.waitForTimeout(3000); };
const body = async page => (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ');
const openT = async (page, id) => { await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/details/' + id, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await page.waitForTimeout(12000); };
  const out = {}; const T = '1499272000000451225';
  const b = page.locator('button,input[type=button],[data-id]').filter({ hasText: /^Mark Spam$/ }); out.n = await b.count(); const b2 = page.getByText('Mark Spam', { exact: true }); out.n2 = await b2.count(); await b2.last().click(); await page.waitForTimeout(4000);
  out.afterSpam = (await body(page)).slice(0, 400); out.url = page.url().slice(-60); await page.screenshot({ path: '../evidence/zoho-tm/spam-after.png' });
  await openT(page, T); out.spamTicket = (await body(page)).match(/.{0,100}[Ss]pam.{0,200}/g)?.slice(0, 2); await page.screenshot({ path: '../evidence/zoho-tm/spam-ticket.png' });
  return out; }
