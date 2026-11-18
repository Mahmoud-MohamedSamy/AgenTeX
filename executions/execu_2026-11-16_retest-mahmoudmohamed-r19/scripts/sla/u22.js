const reqs=[];page.on('response',r=>{const u=r.url();if(/\/records(\?|\/query|\/search)|\/views\/.*\/records|\/tickets\?|count/.test(u)&&/api\/v1/.test(u))reqs.push(r.status()+' '+r.request().method()+' '+u.split('/api/v1')[1].slice(0,120));});
await page.goto(H+'/views/all/tickets',{waitUntil:'domcontentloaded'});await page.getByRole('button',{name:'Classic View'}).waitFor({timeout:200000});await sleep(2000);
await page.getByRole('button',{name:'Classic View'}).click();await sleep(1200);

await page.locator('[role=menuitem],[role=menuitemradio],[role=option]').filter({hasText:/Countdown/}).first().click();
await sleep(20000);
await sleep(20000);
const cols=await page.evaluate(()=>{const names=['Overdue','No Due Date','Due in 1 hour','Due today','Due tomorrow','Due later','On Hold'];const out={};
 for(const n of names){const el=[...document.querySelectorAll('#main-content *')].find(e=>e.children.length===0&&e.textContent.trim()===n);if(!el){out[n]='missing';continue;}
  let c=el;for(let i=0;i<8&&c;i++){c=c.parentElement;if(c&&(c.innerText.match(/#\d{3,5}/g)||[]).length>0&&c.innerText.split('\n').filter(l=>names.includes(l.trim())).length===1)break;}
  const t=c?c.innerText:'';out[n]={head:t.split('\n').slice(0,3).join(' '),nums:(t.match(/#\d{3,5}/g)||[]),err:/Couldn't load/.test(t)};}
 return out;});
const mine={'#4692':'Overdue','#4693':'No Due Date','#4694':'Due in 1 hour','#4695':'Due today','#4696':'Due tomorrow','#4697':'Due later','#4698':'On Hold'};
const res={};for(const [n,exp] of Object.entries(mine)){res[n]={exp,found:Object.entries(cols).filter(([k,v])=>v.nums&&v.nums.includes(n)).map(([k])=>k)};}
log('cols',JSON.stringify(Object.fromEntries(Object.entries(cols).map(([k,v])=>[k,v.head+' n='+(v.nums||[]).length+' err='+v.err]))));
log('mine',JSON.stringify(res));
log('my 2853/2833',JSON.stringify(Object.fromEntries(Object.entries(cols).map(([k,v])=>[k,(v.nums||[]).filter(x=>['#4613','#4614','#4615','#4690','#4673','#4677','#4672','#4674','#4676'].includes(x))]))));
const sc=page.locator('#main-content [class*=overflow-x]').first();
await page.evaluate(()=>{const e=[...document.querySelectorAll('#main-content *')].find(e=>e.scrollWidth>e.clientWidth+200&&getComputedStyle(e).overflowX!=='visible');if(e)e.scrollLeft=e.scrollWidth;});await sleep(1500);
await shot('2832-2-countdown-right.png');
