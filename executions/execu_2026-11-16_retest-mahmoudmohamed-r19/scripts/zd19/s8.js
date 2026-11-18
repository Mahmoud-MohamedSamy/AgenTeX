async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
await page.mouse.click(705,612);await page.waitForTimeout(2500);
const o=page.getByText('Owner',{exact:true});let bb=null;for(let i=(await o.count())-1;i>=0;i--){if(await o.nth(i).isVisible()){bb=await o.nth(i).boundingBox();await o.nth(i).hover();break;}}
await page.waitForTimeout(2500);await page.screenshot({path:R+'ZD-3-2.png'});
const vis=await page.evaluate(()=>[...document.querySelectorAll('li,div,span')].filter(e=>e.children.length===0&&e.offsetParent&&/Agent|Name|Email|Owner|Id/.test(e.textContent)).map(e=>{const r=e.getBoundingClientRect();return e.textContent.trim()+'@'+Math.round(r.x)+','+Math.round(r.y);}).filter(s=>!/[\w.+-]+@[\w.-]+\./.test(s.split('@')[0])));
return JSON.stringify(bb)+'\n'+vis.join(' | ');}
