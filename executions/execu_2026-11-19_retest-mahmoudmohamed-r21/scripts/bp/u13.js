const out = {};
for (const [k, id, subj] of [['plain', '5e50f93c-dbe2-4b64-9e33-1536a241469c', 'QA RT20 BP-3068 plain close'], ['old4177', 'caf13024-c4e6-45b1-9094-93a4f235dfad', '3054 bpclose'], ['bp4807', '60968417-89fa-4b5e-9d97-e4bf8d93e2a4', 'QA RT20 BP 3065 role T3']]) {
  await page.goto(H + '/views/all/tickets/' + id, { waitUntil: 'domcontentloaded' });
  await page.getByText(subj).first().waitFor({ timeout: 120000 }).catch(() => {}); await sleep(5000);
  await page.getByRole('tab', { name: /history/i }).first().click().catch(() => {}); await sleep(6000);
  const t = (await text()).replace(/\s+/g, ' '); const i = t.search(/Ticket History/); out[k] = t.slice(i, i + 1500).replace(/[\w.+-]+@[\w.-]+/g, '<mail>');
  const ct = page.getByText(/Closed Time|Resolution Time/).first(); if (await ct.count()) await ct.scrollIntoViewIfNeeded();
  await shot('3068-2-history-' + k + '.png');
}
return out;
