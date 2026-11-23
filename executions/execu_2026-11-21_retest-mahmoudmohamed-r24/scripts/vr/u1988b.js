const T='88e8ea44-1658-4df3-9930-d0902b91073d';
await page.goto(H+'/settings/modules-and-fields/'+T+'?tab=layouts',{waitUntil:'domcontentloaded'}); await page.getByText('Create New Layout').first().waitFor({timeout:90000}); await sleep(4000);
await page.getByText('Test Layout Rules',{exact:true}).first().click(); await sleep(8000); log('url',page.url());
log('txt',(await text()).replace(/\s+/g,' ').slice(900,3000)); await shot('1988-3a-layout-editor.png');
