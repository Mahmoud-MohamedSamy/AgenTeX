async (page) => { const more = async (page, item) => { await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(500); await page.locator('[data-title="More Actions (M)"]').first().click(); await page.waitForTimeout(1500); const li = page.locator('li').filter({ hasText: new RegExp('^\s*' + item) }); await li.first().scrollIntoViewIfNeeded().catch(() => {}); await li.first().click(); await page.waitForTimeout(3000); };
const body = async page => (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ');
const openT = async (page, id) => { await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/details/' + id, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await page.waitForTimeout(12000); };
  const out = {}; const T = '1499272000000451225';
  await openT(page, T);
  await more(page, 'Mark as Unread'); await page.waitForTimeout(3000); out.unreadUrl = page.url().slice(-70); out.unreadMsg = (await body(page)).slice(-250); await page.screenshot({ path: '../evidence/zoho-tm/unread-after.png' });
  await openT(page, T);
  await more(page, 'Mark Spam'); await page.waitForTimeout(2500); out.spamDlg = (await body(page)).match(/.{0,40}[Ss]pam.{0,300}/g)?.slice(-1)[0]; await page.screenshot({ path: '../evidence/zoho-tm/spam-dlg.png' });
  return out; }
