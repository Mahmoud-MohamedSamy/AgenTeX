async (page) => {
  const ws = await page.evaluate(() => [...document.querySelectorAll('[data-rule-field]')].map(w => w.getAttribute('data-rule-field')));
  const lab = page.getByText(/^Department/).first(); const html = (await lab.count()) ? await lab.evaluate(e => { let p = e; for (let i = 0; i < 3; i++) p = p.parentElement; return p.outerHTML.slice(0, 1200); }) : 'none';
  return { ws, html };
}
