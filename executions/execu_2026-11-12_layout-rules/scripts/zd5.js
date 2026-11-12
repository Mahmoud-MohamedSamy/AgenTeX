async (page, ctx) => {
  const p = await zdPage(ctx);
  await p.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/setup', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(9000);
  const links = await p.locator('a').evaluateAll(as => as.map(a => (a.innerText || '').trim() + ' -> ' + (a.getAttribute('href') || '')).filter(s => /layout|rule|field/i.test(s)).slice(0, 20));
  return { url: p.url().replace(/\?.*/, ''), links };
}
