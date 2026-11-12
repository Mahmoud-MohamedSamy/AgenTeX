async (page, ctx, h) => {
  const r = await page.evaluate(() => { const out=[]; for (const lbl of ['Company','QA VR1112 Code']) { const el=[...document.querySelectorAll('*')].find(e=>e.children.length===0 && e.textContent.trim()===lbl && e.offsetParent); if(!el){out.push(lbl+':none');continue;} let p=el; for(let i=0;i<6;i++){p=p.parentElement; const inp=p.querySelector('input,[contenteditable]'); if(inp){out.push(lbl+':'+inp.outerHTML.slice(0,250)); break;}} } return out; });
  return r;
}
