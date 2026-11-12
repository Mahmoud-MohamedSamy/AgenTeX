async (page, ctx, h) => {
  const d = await zdPage(ctx);
  await d.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/setup/landing', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await d.waitForTimeout(8000);
  const links = await d.$$eval('a,[data-id],li', as => as.map(a => (a.innerText||'').trim().slice(0,40)+'=>'+(a.getAttribute('href')||a.getAttribute('data-id')||'')).filter(x => /valid/i.test(x)).slice(0, 10));
  await d.getByText('Validation Rules', { exact: true }).first().click({ timeout: 8000 }).catch(e=>0);
  await d.waitForTimeout(6000);
  const t = await d.innerText('body');
  return { links, url: d.url(), txt: t.slice(Math.max(0,t.indexOf('Validation Rules'))).slice(0, 700) };
}
