async (page) => {
  const row = page.locator('tr,[role=row],li,div[class*=row]').filter({hasText:'QA C10 Marketing'}).last();
  await row.hover(); await page.waitForTimeout(1000);
  const btns = await row.locator('button,[role=button],[class*=icon],[data-title],[aria-label]').evaluateAll(es=>es.map(e=>[e.tagName,e.getAttribute('aria-label')||'',e.getAttribute('data-title')||'',e.getAttribute('title')||'',(e.innerText||'').trim().slice(0,20)].join('|')).filter(s=>s.replace(/\|/g,'').length).slice(0,20));
  await page.screenshot({path:'evidence/zoho-c10/dept-row-hover.png'});
  return btns;
}
