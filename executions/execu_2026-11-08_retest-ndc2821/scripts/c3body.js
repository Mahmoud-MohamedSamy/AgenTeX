const o={};const A='QA RT14 alpha',R='QA RT14 alpha renamed';
await openTab();await pick('QA AS6 Dept A');
o.labels=await page.locator('button[aria-label]:visible').evaluateAll(e=>e.map(x=>x.getAttribute('aria-label')).filter(t=>/Rename|Delete/.test(t)));o.pickedHead=(await txt()).match(/Department .{0,60}/)?.[0];try{await page.locator('button[aria-label="Rename '+A+'"]').click({timeout:10000});}catch(e){await page.screenshot({path:S+'c3-err.png'});return o;}await page.waitForTimeout(1000);
const ed=page.locator('input:focus');o.focus=await ed.count();
const inputs=page.locator('main input:visible');const vals=await inputs.evaluateAll(e=>e.map(x=>x.value));o.vals=vals;
const i=vals.indexOf(A);await inputs.nth(i).fill(R);await page.screenshot({path:S+'c3-rename-edit.png'});
o.renameBtns=await page.locator('main button:visible').evaluateAll(e=>e.map(x=>x.getAttribute('aria-label')||x.innerText.trim()).filter(t=>/save|cancel|rename|^ok/i.test(t)));
await page.keyboard.press('Enter');await page.waitForTimeout(2000);o.enterSaved=(await tnames(DA)).includes(R);if(!o.enterSaved){await page.getByRole('button',{name:'Save',exact:true}).click({timeout:10000});}o.renameToast=await toast(3500);
o.apiA=await tnames(DA);o.apiB=await tnames(DB);o.uiA=await shown();
LED('skill type in Dept A renamed to "'+R+'"');
// delete in A
await page.locator('button[aria-label="Delete '+R+'"]').click({timeout:10000});await page.waitForTimeout(1500);o.delDialog=(await page.locator('[role=dialog],[role=alertdialog]').first().innerText()).replace(/\s+/g,' ');
await page.locator('[role=dialog] button,[role=alertdialog] button').filter({hasText:/delete/i}).last().click();o.delToast=await toast(3500);
o.afterDelA=await tnames(DA);o.afterDelB=await tnames(DB);LED('skill type "'+R+'" deleted in Dept A (test)');await page.screenshot({path:S+'c3-deleted.png'});
// in-use delete in A
await page.locator('button[aria-label="Delete QA AS6 Type"]').click({timeout:10000});await page.waitForTimeout(1500);
await page.locator('[role=dialog] button,[role=alertdialog] button').filter({hasText:/delete/i}).last().click();await page.waitForTimeout(3000);
o.inUse=(await page.locator('[role=dialog],[role=alertdialog]').first().innerText().catch(()=>'')).replace(/\s+/g,' ');await page.screenshot({path:S+'c3-in-use-refused.png'});
o.afterInUse=await tnames(DA);
return o;
