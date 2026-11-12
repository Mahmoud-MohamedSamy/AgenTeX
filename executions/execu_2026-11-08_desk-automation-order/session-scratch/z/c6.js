async (page) => {
  const reqs = []; const h = r => { const u = r.url(); if (/\/api\/v1\//.test(u)) reqs.push(r.method() + ' ' + u.slice(0, 150) + ' H:' + Object.keys(r.headers()).filter(k => /csrf|orgid|crumb|x-/i.test(k)).join(',')); }; page.on('request', h);
  await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/tickets/list/all-tickets', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(12000);
  page.off('request', h);
  return reqs.slice(0, 15);
}
