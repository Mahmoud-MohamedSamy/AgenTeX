// 8 Nov D-14: switch QA web form to the Standard layout, then one probe submission (no rule changes)
eval(require('fs').readFileSync('lib.js','utf8'));
const o={};const tok=(await ctx.cookies()).find(x=>x.name==='aw_staging_access_token').value;
const g=(await api('GET','/web-forms/'+IDS.WF_D14)).j.data;
const r=await ctx.request.fetch(H+'/api/v1/web-forms/'+IDS.WF_D14,{method:'PUT',headers:{authorization:'Bearer '+tok,'content-type':'application/json','If-Match':String(g.row_version)},data:JSON.stringify({name:g.name,department_id:g.department_id,layout_id:'1b55c25d-eb27-4046-afd1-b292398b435b',definition:g.definition})});
const j=JSON.parse(await r.text());o.put=r.status()+' '+(j.error?JSON.stringify(j.error).slice(0,300):'ok layout '+(j.data&&j.data.layout_id.slice(0,8)));
LED('D-14 8 Nov: web form QA AS6 D14 layout -> Standard');
const g2=(await api('GET','/web-forms/'+IDS.WF_D14)).j.data;const SS=JSON.stringify(g2.snippets);const q=String.fromCharCode(34),bs=String.fromCharCode(92);const ix=SS.indexOf('index.html');
const URL=SS.slice(SS.lastIndexOf('https://',ix),SS.indexOf(q,ix)).split(bs).join('').split('&amp;').join('&');
const ctx2=await page.context().browser().newContext({viewport:{width:900,height:1000}});const p=await ctx2.newPage();const net=[];
p.on('response',async x=>{if(x.url().indexOf('submissions')>0){let t='';try{t=(await x.text()).slice(0,300)}catch(e){}net.push(x.status()+' '+t);}});
await p.goto(URL,{waitUntil:'commit',timeout:180000});for(let i=0;i<40;i++){await p.waitForTimeout(2000);if(await p.locator('[id="fw-subject"]').count())break;}
await p.locator('[id="fw-contact.last_name"]').fill('QA AS6 D14');await p.locator('[id="fw-email"]').fill('qa.as6.d14@example.com');await p.locator('[id="fw-subject"]').fill('QA AS6 D14 probe wf');
await p.getByRole('button',{name:'Send'}).click();await p.waitForTimeout(8000);
o.after=(await p.innerText('body').catch(()=>'')).replace(/\s+/g,' ').slice(0,200);o.net=net;await ctx2.close();
await sleep(5000);o.subs=(await api('GET','/web-forms/'+IDS.WF_D14+'/submissions?limit=2')).j.data.submissions.map(s=>s.status+' rec='+(s.record_id||'-').slice(0,8));
return o;
