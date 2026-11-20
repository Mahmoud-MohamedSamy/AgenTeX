const out = {}; const net = []; page.on('request', r => { if (/\/api\/v1\//.test(r.url()) && /hist|audit|timeline/i.test(r.url())) net.push(r.method() + ' ' + r.url().split('/api/v1')[1].replace(/[0-9a-f-]{36}/g, '{id}').slice(0, 100)); });
for (const [k, id, subj] of [['bp', '60968417-89fa-4b5e-9d97-e4bf8d93e2a4', 'QA RT20 BP 3065 role T3'], ['plain', '5e50f93c-dbe2-4b64-9e33-1536a241469c', 'QA RT20 BP-3068 plain close']]) {
  await page.goto(H + '/views/all/tickets/' + id, { waitUntil: 'domcontentloaded' });
  await page.getByText(subj).first().waitFor({ timeout: 120000 }).catch(() => {}); await sleep(5000);
  await page.getByRole('tab', { name: /history/i }).first().click().catch(async () => { await page.getByText(/^History$/i).last().click(); }); await sleep(6000);
  const t = (await text()).replace(/\s+/g, ' '); const i = t.search(/Ticket History/); out[k] = t.slice(i, i + 1400);
  await shot('3068-1-history-' + k + '.png');
}
out.net = [...new Set(net)]; return out;
