async (page) => {
  await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/list/all-cases',{waitUntil:'domcontentloaded'});
  for (let i=0;i<20;i++){ await page.waitForTimeout(1500); if (/#100/.test(await page.innerText('body').catch(()=>''))) break; }
  await page.getByText("Here's your first ticket.").first().click(); await page.waitForTimeout(5000);
  return page.url();
}
