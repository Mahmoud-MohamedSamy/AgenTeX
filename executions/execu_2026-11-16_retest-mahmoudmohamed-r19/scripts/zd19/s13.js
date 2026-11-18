async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
await page.locator('button',{hasText:/^Save$/}).first().click();await page.waitForTimeout(6000);
let t='';for(let k=0;k<30;k++){t=await page.innerText('body');if(/Start Import|Summary|Review/.test(t)&&!/Please wait/.test(t))break;await page.waitForTimeout(3000);}
await page.waitForTimeout(3000);await page.screenshot({path:R+'zd-imp-j.png'});t=await page.innerText('body');
const btns=await page.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.offsetParent).map(b=>b.textContent.trim()+'@'+Math.round(b.getBoundingClientRect().x)+','+Math.round(b.getBoundingClientRect().y)));
return t.slice(Math.max(0,t.indexOf('Upload Files'))).replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,2000)+'\nBTN '+btns.join(' | ');}
