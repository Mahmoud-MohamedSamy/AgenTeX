async (page, ctx, blocked) => {
  const seen = []; const on = r => { const u = r.url(); if (/zoho\.com/.test(u) && !/static|cdn|murphy|pubsub|wms|tipengine|\.(js|css|png|svg|woff2?)/.test(u)) seen.push(r.method() + ' ' + u.replace(/\?.*/, '').slice(0, 120) + (r.method() === 'POST' ? ' BODY:' + (r.postData() || '').replace(/\s+/g, ' ').slice(0, 220) : '')); };
  page.on('request', on);
  await page.goto('https://desk.zoho.com/agent/wondertravel/all/setup#setup/automation/589783000082576704/workflows/rules', { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {});
  await page.waitForTimeout(20000); page.off('request', on);
  return { url: page.url(), seen: seen.slice(0, 40) };
}
