const st={}; await page.setViewportSize({width:1280,height:984});
await page.goto(H+'/modules/'+T.LEADS+'/views/manage',{waitUntil:'commit',timeout:120000});
for(let i=0;i<100;i++){ await sleep(3000); const t=await text(); if(/QA RT r10 2280/.test(t)) break; } await sleep(4000);
const cell=page.getByText(/QA RT r10 2280 x+/).first(); await cell.scrollIntoViewIfNeeded(); await sleep(1000);
st.cell=await cell.evaluate(e=>{ const r=e.getBoundingClientRect(); const cs=getComputedStyle(e); return {right:Math.round(r.right),w:Math.round(r.width),sw:e.scrollWidth,cw:e.clientWidth,to:cs.textOverflow,ov:cs.overflow,ws:cs.whiteSpace,title:e.getAttribute('title')?.length||e.closest('[title]')?.getAttribute('title')?.length}; });
const row=cell.locator('xpath=ancestor::tr[1]'); st.cells=await row.locator('td').evaluateAll(a=>a.map(td=>{const r=td.getBoundingClientRect();return {l:Math.round(r.left),r:Math.round(r.right),t:td.innerText.trim().slice(0,25)};}));
st.headers=await page.locator('table thead th').evaluateAll(a=>a.map(th=>{const r=th.getBoundingClientRect();return [th.innerText.trim(),Math.round(r.left),Math.round(r.right)];}));
st.hscroll=await page.locator('table').first().evaluate(t=>{let p=t.parentElement; while(p){ if(p.scrollWidth>p.clientWidth+2 && /auto|scroll/.test(getComputedStyle(p).overflowX)) return [p.scrollWidth,p.clientWidth]; p=p.parentElement;} return false;});
await shot('2280-manage-views.png'); return st;
