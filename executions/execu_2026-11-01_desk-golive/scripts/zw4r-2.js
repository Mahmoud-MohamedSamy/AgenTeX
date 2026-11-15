async (page) => {
  await page.getByText('Customer Happiness', { exact: true }).first().click(); 
  let t = ''; for (let i = 0; i < 15; i++) { await page.waitForTimeout(1500); t = (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' '); if (/rating|feedback/i.test(t.slice(t.indexOf('Schedu')))) break; }
  await page.screenshot({ path: 'evidence/zoho-w4r/setup-happiness.png' });
  const i = t.indexOf('Customer Happiness', t.indexOf('Schedu')); return { url: page.url().split('#')[1], t: t.slice(i > 0 ? i : t.length - 1500, (i > 0 ? i : t.length - 1500) + 1500) };
}
