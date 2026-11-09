// READ-ONLY: open ticket by subject, list tabs, open History.
module.exports = async ({ page, log, shot, args }) => {
  const subj = args[0] || 'test ticket from mail';
  await page.goto('https://desk.zoho.com/agent/taviportal/anyware-software/tickets/list/all-cases', { waitUntil: 'domcontentloaded', timeout: 90000 });
  for (let s = 0; s < 45; s++) { await page.waitForTimeout(1000); if ((await page.innerText('body').catch(() => '')).includes(subj)) break; }
  await page.getByText(subj, { exact: true }).first().click();
  await page.waitForTimeout(8000);
  log('URL', page.url());
  log('TABS', (await page.locator('[role=tab]:visible, [data-id*="tab" i]:visible').allInnerTexts()).join(' | ').replace(/\s+/g, ' '));
  log('HIST candidates', await page.getByText(/History/).evaluateAll(es => es.filter(e => e.offsetParent).map(e => e.tagName + ':' + e.innerText.trim().slice(0, 40) + ':' + (e.getAttribute('data-id') || e.getAttribute('data-test-id') || ''))));
  await shot('ticket-open');
};
