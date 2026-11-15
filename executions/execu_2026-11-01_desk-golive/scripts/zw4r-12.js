async (page) => {
  await page.getByRole('button', { name: /^Send$/ }).first().click().catch(async () => { await page.getByText('Send', { exact: true }).first().click(); });
  await page.waitForTimeout(6000); await page.screenshot({ path: 'evidence/zoho-w4r/sent.png' });
  return { t: (await page.innerText('body')).replace(/\s+/g, ' ').match(/.{0,60}(How would you rate|sent|Send).{0,80}/gi)?.slice(0, 4) };
}
