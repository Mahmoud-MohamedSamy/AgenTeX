out.loaded=await openTicket();await wt(/QA FT 1865 H reply 1/);await page.waitForTimeout(2000);
await page.mouse.click(1372,103);await page.waitForTimeout(3000);
out.commentUi=await lines(/comment|private|public|mention|notify|Write/i,12);await shot('c1-comment-open');
return Object.assign(out,{calls:[...new Set(calls)]});
