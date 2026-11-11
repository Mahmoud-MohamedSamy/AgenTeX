// Checklist run 10 Nov: S0, EM-07, EM-08. READ-ONLY (API reads + screenshots).
module.exports=async()=>{const R={};const RAW=OUT+'/../screenshots/raw/cl-';const PW=ms=>pg.waitForTimeout(ms);
 const m=s=>String(s).replace(/([A-Za-z0-9._%+-]{2})[A-Za-z0-9._%+-]*@(?!help-staging)/g,'$1***@');
 const CS='7e1ac409-58b0-41ab-97e1-0e7d5c8c5158';
 for(const k of ['addresses','sending-overview','quarantine','spam-contacts','suppressions','overview','blocked-addresses','blocklist']){const r=await api('GET','/desk/channels/'+k);R['api_'+k]=r.s+' '+m(r.t.slice(0,700));}
 const cs=(await api('GET','/desk/departments/'+CS)).j.data;R.ownerInCS=JSON.stringify(cs.agent_user_ids||cs).includes(IDS.O);
 await pg.setViewportSize({width:1600,height:1000});
 await pg.goto(H+'/settings/channels/email',{waitUntil:'commit',timeout:120000});await pg.waitForFunction(()=>/help-staging|Mail is|Overview/i.test(document.body.innerText),null,{timeout:60000}).catch(()=>{});await PW(5000);
 await pg.screenshot({path:RAW+'0-email-landing.png'});R.landing=m((await pg.innerText('main').catch(()=>'')).replace(/\s+/g,' ').slice(0,1500));
 const tabs=await pg.locator('[role=tab],nav a,button').allInnerTexts().catch(()=>[]);R.tabs=[...new Set(tabs.map(t=>t.trim()).filter(t=>t&&t.length<30))].slice(0,60);
 for(const [i,name] of ['Overview','Addresses','Spam','Quarantine','Blocked','Suppression'].entries()){const t=pg.getByText(new RegExp('^'+name,'i')).first();if(!(await t.count())){R['tab_'+name]='not found';continue;}await t.click().catch(()=>{});await PW(4000);await pg.screenshot({path:RAW+(i+1)+'-'+name.toLowerCase()+'.png'});R['tab_'+name]=m((await pg.innerText('main').catch(()=>'')).replace(/\s+/g,' ').slice(0,1200));}
 return R;};
