const fs=require('fs');
module.exports=async()=>{const R={};const DB=IDS.DB;const RAW=OUT+'/../screenshots/raw/';const PW=ms=>pg.waitForTimeout(ms);
 const enc=v=>v===null?{kind:'null'}:{kind:'string',value:v};const body=vals=>({data:Object.entries(vals).map(([f,v])=>({field:f,value:enc(v)}))});
 const rec=async id=>fl((await api('GET','/modules/'+T+'/records/'+id)).j.data);
 const st=async id=>{const o=await rec(id);const d=(await api('GET','/desk/tickets/'+id)).j.data;const ow=o.owner?(o.owner.id||o.owner):null;return {no:o.ticket_number,owner:ow===IDS.A1?'A1':ow?String(ow).slice(0,8):'-',in_backlog:d.in_backlog};};
 const wl=async()=>{const d=(await api('GET','/desk/agents/'+IDS.A1+'/workload')).j.data;return {total:(d.departments||[]).reduce((n,x)=>n+x.open_tickets,0),db:((d.departments||[]).find(x=>(x.department_id||x.id)===DB)||{}).open_tickets||0,raw:(d.departments||[]).map(x=>String(x.department_name||x.name||x.department_id).slice(0,18)+':'+x.open_tickets+(x.on_hold_tickets!==undefined?'/oh'+x.on_hold_tickets:''))};};
 const prefUrl='/desk/departments/'+DB+'/round-robin-preferences';const p0=(await api('GET',prefUrl)).j.data;R.prefsBefore=p0;
 const prefsShot=async name=>{await pg.setViewportSize({width:1600,height:1000});await pg.goto(H+'/settings/automation/assignment-rules',{waitUntil:'commit'});await pg.waitForFunction(()=>/New Rule/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await PW(2500);
  await pg.getByRole('tab',{name:/^Round Robin$/}).click();await PW(3000);const dep=pg.locator('main').getByRole('combobox').first();if(await dep.count()){await dep.click();await PW(1000);const opt=pg.getByRole('option',{name:'QA AS6 Dept B'});if(await opt.count())await opt.click();else{await pg.keyboard.type('QA AS6 Dept B');await PW(800);await pg.keyboard.press('Enter');}await PW(3000);}
  await pg.screenshot({path:RAW+name+'-list.png'});
  const kebab=pg.locator('main button[aria-haspopup], main button[aria-label*="ore"], main button[aria-label*="ption"]');for(let i=0;i<await kebab.count();i++){await kebab.nth(i).click().catch(()=>{});await PW(800);const p=pg.getByRole('menuitem',{name:/Preferences/i});if(await p.count()){await p.first().click();await PW(2500);break;}await pg.keyboard.press('Escape');}
  await pg.screenshot({path:RAW+name+'.png'});const t=await pg.locator('[role=dialog]').last().innerText().catch(()=>'');await pg.keyboard.press('Escape');return t.replace(/\s+/g,' ').slice(0,400);};
 const tkShot=async(id,name)=>{await pg.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit',timeout:120000});await pg.waitForFunction(()=>/Owner/.test(document.body.innerText),null,{timeout:60000}).catch(()=>{});await PW(4000);await pg.screenshot({path:RAW+name+'.png'});};
 let rule=null;const tk=[];
 try{
  R.wl0=await wl();const thr=R.wl0.db+1;R.thr1=thr;if(R.wl0.total<=thr)throw new Error('A1 total not above threshold');
  await api('PUT',prefUrl,{...p0,assign_to_offline_agents:true,department_threshold_enabled:true,department_threshold:thr,agent_threshold_enabled:false,assign_backlogs:false});LED('I12 Dept B prefs temporarily: offline on, dept threshold '+thr);
  const rb={type:'round_robin',department_id:DB,name:'QA RT15 2275 I12 threshold',description:'QA retest I-12, safe to delete',is_active:true,execute_on:['create'],targets:[{criteria:{conditions:[{field_key:'subject',operator:'contains',value:'QA RT15 I12'}],pattern:null},method:'sequential',pool:{kind:'agents',user_ids:[IDS.A1],team_id:null,excluded_user_ids:[]}}]};
  const r=await api('POST','/desk/assignment-rules',rb);rule=r.j&&r.j.data&&(r.j.data.id||(r.j.data.rule&&r.j.data.rule.id));if(!rule)throw new Error('rule '+r.s+' '+r.t);LED('I12 rule "QA RT15 2275 I12 threshold" '+rule);
  R.prefs1=await prefsShot('i12-tavi-prefs-thr');
  const mk=async s=>{const c=await api('POST','/modules/'+T+'/records',body({subject:s,department:DB,status:'Open',priority:'Medium',email:'qa.rt15@example.com',owner:null}));const id=c.j&&c.j.data&&(c.j.data.id||(c.j.data.record&&c.j.data.record.id));if(!id)throw new Error('mk '+c.s+' '+c.t);tk.push(id);LED('I12 ticket "'+s+'" '+id);return id;};
  const a=await mk('QA RT15 I12 test 1 (threshold = Dept B count + 1)');await W(10000);R.test1=await st(a);R.act1=((await api('GET','/desk/tickets/'+a+'/activity')).j.data||[]).map(x=>x.action).join(',');await tkShot(a,'i12-tavi-test1');
  R.wl1=await wl();
  await api('PUT',prefUrl,{...p0,assign_to_offline_agents:true,department_threshold_enabled:true,department_threshold:R.wl1.total+1,agent_threshold_enabled:false,assign_backlogs:false});R.thr2=R.wl1.total+1;LED('I12 Dept B threshold '+R.thr2);
  const b=await mk('QA RT15 I12 test 2 (control, threshold above all-department count)');await W(10000);R.test2=await st(b);await tkShot(b,'i12-tavi-test2');
  R.wl2=await wl();
 }finally{
  if(rule){R.ruleDel=(await api('DELETE','/desk/assignment-rules/'+rule)).s;LED('I12 rule deleted '+R.ruleDel);}
  for(const id of tk){const s=(await api('DELETE','/modules/'+T+'/records/'+id)).s;LED('I12 ticket deleted '+id+' '+s);}
  const pb=await api('PUT',prefUrl,p0);R.prefsBack=pb.s;R.prefsSame=JSON.stringify((await api('GET',prefUrl)).j.data)===JSON.stringify(p0);LED('I12 Dept B prefs restored '+pb.s);
  await W(3000);const ids=new Set(tk);const items=[];let cur='';for(let i=0;i<10;i++){const r=await api('GET','/audit/recycle-bin/items?app_key=desk&limit=200'+(cur?'&cursor='+encodeURIComponent(cur):''));for(const x of arr(r.j.data))if(ids.has(x.record_id))items.push(x.id);cur=r.j.meta&&r.j.meta.next_cursor;if(!cur||items.length===tk.length)break;}
  if(items.length){R.bin=items.length+' '+(await api('POST','/audit/recycle-bin/delete',{ids:items})).s;}
 }
 return R;};
