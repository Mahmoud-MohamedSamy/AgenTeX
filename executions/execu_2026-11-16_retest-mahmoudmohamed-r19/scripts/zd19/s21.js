async (page) => { const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
const ca=page.getByText('Clear All',{exact:true});if(await ca.count())await ca.first().click().catch(()=>{});
await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(1000);
const rowY=async(label)=>({'Email':696,'Contact Name':748,'Department':644})[label];
const vis=async()=>page.evaluate(()=>[...document.querySelectorAll('li,div,span')].filter(e=>e.children.length===0&&e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return [e.textContent.trim(),Math.round(r.x),Math.round(r.y)];}).filter(a=>a[1]>630&&a[1]<800&&a[0]&&!/@/.test(a[0])));
const choose=async(label,top,sub)=>{const y=await rowY(label);await page.mouse.click(705,y);await page.waitForTimeout(2500);let v=await vis();let d=v.find(a=>a[0]===top&&a[2]>y);if(!d)return label+': no '+top;await page.mouse.click(d[1]+10,d[2]+7);await page.waitForTimeout(2000);if(!sub)return label+' ok';v=await vis();d=v.find(a=>a[0]===sub);if(!d)return label+': no '+sub+' '+JSON.stringify(v.slice(0,8));await page.mouse.click(d[1]+10,d[2]+7);await page.waitForTimeout(2000);return label+' ok';};
const r=[];r.push(await choose('Email','Contact','Contact Email ID'));r.push(await choose('Contact Name','Contact','Contact Last Name'));r.push(await choose('Department','Department','Department Name'));
await page.mouse.click(1500,440);await page.waitForTimeout(1000);await page.screenshot({path:R+'zd-imp-r.png'});
await page.locator('button',{hasText:/^Save$/}).first().click().catch(()=>r.push('no save'));await page.waitForTimeout(6000);
const nb=page.locator('button',{hasText:/^Next$/});if(await nb.count()){await nb.last().click();}
let t='';for(let k=0;k<30;k++){await page.waitForTimeout(3000);t=await page.innerText('body');if(/Start Import|missing|not present/.test(t))break;}
await page.waitForTimeout(3000);await page.screenshot({path:R+'zd-imp-s.png'});t=await page.innerText('body');
return r.join(' | ')+'\n'+t.slice(Math.max(0,t.indexOf('Review'))).replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,2000);}
