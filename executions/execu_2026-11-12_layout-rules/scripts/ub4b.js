async (page) => {
  await page.getByRole('button', { name: /Filters/ }).first().click(); await sleep(1200);
  const panel = await page.evaluate(() => { const d = document.querySelector('[role=dialog], [data-radix-popper-content-wrapper], [role=menu]'); return d ? d.innerText.replace(/\s+/g, ' ').slice(0, 800) : document.body.innerText.slice(0, 300); });
  const ctrls = await page.evaluate(() => [...document.querySelectorAll('[role=dialog] button, [data-radix-popper-content-wrapper] button, [role=dialog] select')].map(b => (b.getAttribute('aria-label') || '') + '=' + b.innerText.trim()).slice(0, 20));
  await shot('crm-B4-1', false); return { panel, ctrls };
}
