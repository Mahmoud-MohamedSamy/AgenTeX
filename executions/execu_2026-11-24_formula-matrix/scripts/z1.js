const seen = []; page.on('request', r => { const h = r.headers(); const k = Object.keys(h).find(x => /csrf/i.test(x)); if (k && seen.length < 5) seen.push({ u: r.url().slice(0, 120), k, fmt: String(h[k]).replace(/=([A-Za-z0-9]{4})[A-Za-z0-9-]+/, '=$1…') }); });
await page.reload({ waitUntil: 'domcontentloaded' }); await sleep(8000);
log(seen); log('cookies', (await page.context().cookies()).map(c => c.name).filter(n => /csrf/i.test(n)));
