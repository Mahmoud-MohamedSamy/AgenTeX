async (page) => { const b=(await page.innerText('body')).replace(/\s+/g,' '); const i=b.indexOf('Duplicates'); 
 const inputs=await page.locator('input,textarea').evaluateAll(e=>e.filter(x=>x.offsetParent).map(x=>x.type+':'+(x.getAttribute('aria-label')||x.name||x.placeholder||'')+':'+(x.checked??'')+':'+(x.value||'').slice(0,30)));
 return {rest:b.slice(i,i+1500), inputs}; }
