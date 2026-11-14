async (page) => {
  const ins = await page.$$eval('input', els => els.filter(e=>e.offsetParent).map(e=>({n:e.name,id:e.id,ph:e.placeholder,dt:e.getAttribute('data-id'),v:e.value, al:e.getAttribute('aria-label')})));
  return ins;
}
