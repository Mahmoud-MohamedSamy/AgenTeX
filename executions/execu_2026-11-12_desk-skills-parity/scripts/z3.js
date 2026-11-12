async (page) => { const t = await page.innerText('body'); const i = t.search(/Skills/); 
 const els = await page.$$eval('*', es => es.filter(e => e.children.length===0 && /^\s*Skills\s*$/.test(e.textContent)).map(e => [e.tagName, e.className, e.closest('a')?.getAttribute('href'), e.getAttribute('data-id')]));
 return { has: i, around: t.slice(Math.max(0,i-300), i+200), els }; }
