module.exports = async ({ page, go, shot, txt, log }) => {
  const T = '88e8ea44-1658-4df3-9930-d0902b91073d', CALLS = 'f7e488b5-0232-42fd-811c-1f24356af653';
  const T5 = 'c569c052-be88-48d2-96e6-54dbd2fff46f', T7 = 'b99fbebc-d245-47ef-a3e1-d30533d6da85', C14 = 'cbbf5e4f-131f-4f85-819d-aa93e69c4ffa';
  await go(`/modules/${T}/records/${T5}`); await page.waitForTimeout(5000);
  log('t5url', page.url()); log('t5', await txt('main', 1200)); await shot('ev-d05-ticket');
  await go(`/modules/${T}/records/${T7}`); await page.waitForTimeout(5000);
  log('tabs', await page.getByRole('tab').allInnerTexts().catch(() => []));
  log('buttons', (await page.getByRole('button').allInnerTexts().catch(() => [])).filter(x => x && x.length < 30).slice(0, 40));
  const h = page.getByRole('tab', { name: /history/i }); if (await h.count()) { await h.first().click(); await page.waitForTimeout(3000); }
  log('t7', await txt('main', 1500)); await shot('ev-d07-history');
  await go(`/modules/${CALLS}/records/${C14}`); await page.waitForTimeout(5000);
  log('c14', await txt('main', 1500)); await shot('ev-d14-call');
};
