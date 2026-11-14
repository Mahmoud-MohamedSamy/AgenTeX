async (page) => {
  await page.screenshot({path:'evidence/zoho-c10/dd-open.png'});
  const els = await page.locator('body *:visible').evaluateAll(es=>es.filter(e=>e.children.length===0 && /Private|Public/.test(e.innerText||'')).map(e=>[e.tagName,e.className.toString().slice(0,40),e.innerText.trim()].join('|')));
  return els.slice(0,30);
}
