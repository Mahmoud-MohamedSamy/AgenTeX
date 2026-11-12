async (page) => { const R = {};
  const el = page.getByText('When condition 1 matches', { exact: true }).first(); R.n = await el.count();
  R.tag = await el.evaluate(e => { let x = e; for (let k=0;k<4;k++){ if (x.tagName==='BUTTON'||x.getAttribute('role')) return x.tagName+' '+x.getAttribute('role')+' '+x.outerHTML.slice(0,300); x = x.parentElement; } return e.outerHTML.slice(0,300); });
  await el.click(); await sleep(1000); R.opts = await page.locator('[role=option], [role=menuitem], [role=menuitemradio]').allInnerTexts();
  return R; }
