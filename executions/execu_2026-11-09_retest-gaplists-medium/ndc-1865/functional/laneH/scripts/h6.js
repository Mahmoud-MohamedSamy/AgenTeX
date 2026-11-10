out.loaded=await openTicket();
await page.locator('text=/^\s*activity\s*$/i').first().click();await page.waitForTimeout(5000);out.activityTab=await lines(/QA FT|task|call|event|created|No /i,15);await shot('a2-ticket-activity-tab');
await page.locator('button:right-of(:text("APPROVAL"))').first().click().catch(e=>out.moreErr=String(e).slice(0,80));await page.waitForTimeout(2000);
out.tabsAfterMore=await lines(/^[A-Z0-9 \-]{4,}$/,20);await shot('a2b-more-tabs');
return Object.assign(out,{calls:[...new Set(calls)]});
