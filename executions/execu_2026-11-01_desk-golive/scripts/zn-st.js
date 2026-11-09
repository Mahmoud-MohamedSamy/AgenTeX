async (page,ctx,blocked)=>({url:page.url(),title:await page.title(),blocked:blocked.slice(-8)})
