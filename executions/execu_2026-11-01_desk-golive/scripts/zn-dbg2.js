async (page, ctx, blocked) => {
  const seen = []; const on = r => { const u = r.url(); if (/DWRutil|\.do/.test(u) && r.method() === 'POST') seen.push(u.replace(/^https:\/\/desk\.zoho\.com/, '').slice(0, 100) + ' BODY:' + (r.postData() || '').replace(/(csrf|token|zcsrf)[^\n&]*/gi, '$1=***').replace(/\s+/g, ' | ').slice(0, 600)); };
  page.on('request', on);
  await page.goto('https://desk.zoho.com/agent/wondertravel/all/tickets/list/all-cases', { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {}); await page.waitForTimeout(8000);
  await page.goto('https://desk.zoho.com/agent/wondertravel/all/setup#setup/automation/589783000082576704/workflows/rules', { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {});
  await page.waitForTimeout(18000); page.off('request', on);
  return { seen: seen.slice(0, 12) };
}
