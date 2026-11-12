async (page) => { const l = page.getByText('Skills', { exact: true }).first(); await l.scrollIntoViewIfNeeded(); await page.waitForTimeout(800);
 const box = await l.boundingBox(); 
 const opts = await page.evaluate(() => { const lab=[...document.querySelectorAll('label, span, div')].find(e=>e.textContent.trim()==='Skills'); const c=lab?.closest('div')?.parentElement; return c? c.innerText.split('\n').length : -1; });
 await page.screenshot({ path: 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/t-newticket-skills.png' });
 return { box, opts }; }
