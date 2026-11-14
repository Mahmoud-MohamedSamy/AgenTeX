async (page) => {
  const nn = page.locator('text=/^Not Now$/'); if (await nn.count()) await nn.first().click().catch(()=>{});
  const cbs = await page.$$eval('input[type=checkbox], [role=checkbox], [data-id*=heckbox], [class*=heckbox]', els => els.slice(0,12).map(e=>e.tagName+'|'+(e.className||'').toString().slice(0,60)+'|'+(e.getAttribute('data-id')||'')+'|'+(e.getAttribute('aria-label')||'')));
  return cbs;
}
