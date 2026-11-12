async (page) => { const seen = []; const h = r => { const u = r.url(); if (/\/api\//.test(u) && /modules|layout/.test(u)) seen.push(r.status() + ' ' + u.replace(/[0-9a-f-]{36}/g, '<id>').replace('https://staging-crm.taviportal.com', '')); }; page.on('response', h);
  await page.goto(HOST + '/settings/modules-and-fields', { waitUntil: 'domcontentloaded' }); await sleep(8000); page.off('response', h);
  return { url: page.url(), t: (await bodyText()).slice(0, 300), seen: [...new Set(seen)].slice(0, 10) }; }
