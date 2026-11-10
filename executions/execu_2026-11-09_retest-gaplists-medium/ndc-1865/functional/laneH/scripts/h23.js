out.loaded=await openTicket();await page.waitForTimeout(2000);
await page.mouse.click(1261,28);await page.waitForTimeout(4000);
out.bell=await lines(/QA FT 1865 H|#2484|mention|assigned|comment|ticket/i,20);await shot('n4-bell');
return Object.assign(out,{calls:[...new Set(calls)]});
