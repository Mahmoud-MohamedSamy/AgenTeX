async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
await page.mouse.click(680,792);await page.waitForTimeout(2500);
await page.mouse.click(705,664);await page.waitForTimeout(2500);
const o=page.getByText('Department',{exact:true});let n=0;for(let i=(await o.count())-1;i>=0;i--){const b=await o.nth(i).boundingBox();if(b&&b.x>630&&b.x<790&&b.y>680){await o.nth(i).click();n=1;break;}}
await page.waitForTimeout(2500);await page.screenshot({path:R+'zd-imp-g.png'});
const vis=await page.evaluate(()=>[...document.querySelectorAll('li,div,span')].filter(e=>e.children.length===0&&e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return [e.textContent.trim(),Math.round(r.x),Math.round(r.y)];}).filter(a=>a[1]>630&&a[1]<800&&a[2]>600&&a[0]&&!/@/.test(a[0])).map(a=>a.join('@')));
return n+'\n'+vis.join(' | ');}
