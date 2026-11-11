async (page, frame, ctx) => { await page.waitForTimeout(5000);
 const ck = (await ctx.cookies()).map(c=>c.name).filter(n=>/csr|csrf/i.test(n));
 const r = await page.evaluate(async () => { const out={}; for (const u of ['/api/v1/tickets?limit=3','/supportapi/zd/techsolutionsegypt/api/v1/tickets?limit=3']) { try { const x = await fetch(u,{credentials:'include'}); out[u]=x.status+' '+(await x.text()).slice(0,200);} catch(e){out[u]='ERR '+e.message} } return out; });
 return { url: page.url(), ck, r, text: (await page.innerText('body')).slice(0,300) }; }
