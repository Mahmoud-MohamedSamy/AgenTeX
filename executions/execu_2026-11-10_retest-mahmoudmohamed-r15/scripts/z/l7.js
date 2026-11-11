async (page) => { await page.mouse.click(258,72); await page.waitForTimeout(5000);
 const t = await page.innerText('body'); await page.screenshot({path:'../screenshots/raw/zoho-2823-select-view2.png'});
 const dlg = t.match(/[^\n]*(selected|all \d+|57)[^\n]*/gi)?.slice(0,8); return { bar: t.split('\n').slice(18,26).join('|'), dlg }; }
