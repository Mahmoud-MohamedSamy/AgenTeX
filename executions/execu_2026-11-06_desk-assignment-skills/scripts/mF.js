// 8 Nov D-14: web form owner mode "user" = A2 with RR create rule matching -> owner kept?
eval(require('fs').readFileSync('lib.js','utf8'));
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';NM[IDS.O]='O';const nm=x=>x?(NM[x]||String(x).slice(0,8)):'-';
const o={};const tok=(await ctx.cookies()).find(x=>x.name==='aw_staging_access_token').value;
const putWF=async ownerObj=>{const g=(await api('GET','/web-forms/'+IDS.WF_D14)).j.data;const r=await ctx.request.fetch(H+'/api/v1/web-forms/'+IDS.WF_D14,{method:'PUT',headers:{authorization:'Bearer '+tok,'content-type':'application/json','If-Match':String(g.row_version)},data:JSON.stringify({name:g.name,department_id:g.department_id,layout_id:g.layout_id,definition:{...g.definition,owner:{...g.definition.owner,...ownerObj}}})});return r.status();};
const seq0=(await getRule(IDS.RR_SEQ)).execute_on;const pr0=(await api('GET','/desk/departments/'+IDS.DA+'/round-robin-preferences')).j.data;
try{
 o.wf=await putWF({mode:'user',user_id:IDS.A2});LED('D-14 8 Nov: web form owner = user A2 temporarily');
 await putRule(IDS.RR_SEQ,{execute_on:['create','update']});await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',{...pr0,assign_to_offline_agents:true});LED('D-14 8 Nov: RR_SEQ create + offline ON temporarily (owner-mode test)');
 const g=(await api('GET','/web-forms/'+IDS.WF_D14)).j.data;const SS=JSON.stringify(g.snippets);const q=String.fromCharCode(34),bs=String.fromCharCode(92);const ix=SS.indexOf('index.html');
 const URL=SS.slice(SS.lastIndexOf('https://',ix),SS.indexOf(q,ix)).split(bs).join('').split('&amp;').join('&');
 const ctx2=await page.context().browser().newContext({viewport:{width:900,height:1000}});const p=await ctx2.newPage();
 await p.goto(URL,{waitUntil:'commit',timeout:180000});for(let i=0;i<40;i++){await p.waitForTimeout(2000);if(await p.locator('[id="fw-subject"]').count())break;}
 await p.locator('[id="fw-contact.last_name"]').fill('QA AS6 D14');await p.locator('[id="fw-email"]').fill('qa.as6.d14@example.com');await p.locator('[id="fw-subject"]').fill('QA AS6 SEQ D14 owner A2 wf');
 await p.getByRole('button',{name:'Send'}).click();await p.waitForTimeout(8000);o.after=(await p.innerText('body').catch(()=>'')).replace(/\s+/g,' ').slice(0,80);await ctx2.close();
 await sleep(8000);
 const s=(await api('GET','/web-forms/'+IDS.WF_D14+'/submissions?limit=1')).j.data.submissions[0];const id=s.record_id;
 if(id){const t=await getT(id);LED('ticket "'+t.subject+'" '+id+' D-14 8 Nov web form owner A2');const a=arr(await act(id));
  o.ticket={sub:t.subject,num:t.ticket_number,owner:nm((await own(id)).owner),h:a.map(e=>(e.action||'')+(e.summary&&e.summary.rule_type?'/'+e.summary.rule_type+'/'+nm(e.summary.owner_id):'')).filter(x=>/assign|owner|created/.test(x))};}
 else o.ticket='no record: '+s.status;
}finally{
 o.back=[(await putRule(IDS.RR_SEQ,{execute_on:seq0})).s,sh(await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',pr0)).s,await putWF({mode:'unassigned',user_id:null})];
 LED('D-14 8 Nov: RR_SEQ exec + Dept A prefs restored; web form owner back to unassigned');
}
return o;
