async (page) => { const R = []; page.on('response', async r => { if (r.status() >= 400 && /api\/v1/.test(r.url())) R.push(r.status() + ' ' + r.request().method() + ' ' + r.url().replace(/^.*api\/v1/, '').slice(0, 140) + ' :: ' + (await r.text().catch(() => '')).slice(0, 300)); });
  await page.reload({ waitUntil: 'domcontentloaded' }); await sleep(8000); return R.slice(0, 5); }
