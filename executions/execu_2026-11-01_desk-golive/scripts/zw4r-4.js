async (page) => {
  const reqs = []; const h = r => { if (/happiness|feedback|rating/i.test(r.url())) reqs.push(r.status() + ' ' + r.url().replace(/^https:\/\/[^/]+/, '').slice(0, 120)); }; page.on('response', h);
  await page.reload({ waitUntil: 'commit' }).catch(() => {});
  let t = ''; for (let i = 0; i < 30; i++) { await page.waitForTimeout(2000); t = (await page.locator('body').innerText().catch(() => '')).replace(/\s+/g, ' '); if (/Rating Settings|Happiness Rating|Enable Customer Happiness|ratings/i.test(t)) break; }
  page.off('response', h);
  await page.getByRole('button', { name: 'Not Now' }).click().catch(() => {});
  await page.screenshot({ path: 'evidence/zoho-w4r/setup-happiness.png' });
  const k = t.search(/Customer Happiness (Settings|Rating)|Happiness Rating/i);
  return { reqs: reqs.slice(0, 10), t: k >= 0 ? t.slice(k, k + 1800) : t.slice(-600) };
}
