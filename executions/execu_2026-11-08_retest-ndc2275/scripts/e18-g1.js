// EM-04 Gmail rerun step 2: find the ticket, then agent reply from the ticket page.
module.exports=async()=>{const R={};const PW=ms=>pg.waitForTimeout(ms);const S='QA EM-04 Gmail rerun';const CS='7e1ac409-58b0-41ab-97e1-0e7d5c8c5158';
 const m=s=>String(s).replace(/([A-Za-z0-9._%+-]{2})[A-Za-z0-9._%+-]*@(?!help-staging)/g,'$1***@');
 let t=null;const t0=Date.now();while(Date.now()-t0<360000){const l=arr(((await api('GET','/modules/'+T+'/records?q='+encodeURIComponent(S)+'&per_page=20')).j||{}).data).map(fl).filter(o=>String(o.subject||'').includes(S));if(l.length){R.found=l.map(o=>o.ticket_number+' '+o.subject);t=l[0];break;}await W(20000);}
 if(!t){R.stop='no ticket after 6 min';return R;}R.id=t.id;R.no=t.ticket_number;R.dept=t.department===CS?'Customer Support':t.department;
 const a=((await api('GET','/desk/tickets/'+t.id+'/activity')).j||{}).data||[];R.act=a.filter(x=>/message/.test(x.action)).map(x=>x.occurred_at.slice(11,19)+' '+x.action+' '+m(JSON.stringify(x.summary)).slice(0,160));
 LED('CL EM-04 rerun ticket #'+t.ticket_number+' '+t.id);
 await pg.setViewportSize({width:1600,height:1000});for(let k=0;k<3;k++){try{await pg.goto(H+'/views/all/tickets/'+t.id,{waitUntil:'commit',timeout:60000});}catch(e){continue;}if(await pg.waitForFunction(()=>/Ticket Owner/.test(document.body.innerText),null,{timeout:60000}).then(()=>true).catch(()=>false))break;}await PW(5000);
 await pg.screenshot({path:OUT+'/../screenshots/raw/cl-em04r-1-new.png'});
 await pg.getByRole('button',{name:/^Reply( All)?$/}).first().click();await PW(5000);const ed=pg.locator('[contenteditable=true]').last();await ed.click({position:{x:30,y:12}});await pg.keyboard.press('Control+Home');await pg.keyboard.type('QA EM-04 agent reply. Please reply to this email from Gmail.');await PW(2000);
 let send=null;const c=pg.getByRole('button',{name:/^Send$/});for(let i=0;i<await c.count();i++){const b=c.nth(i);if(await b.isVisible().catch(()=>false)&&!(await b.isDisabled().catch(()=>true)))send=b;}
 if(!send){R.stop='Send disabled';await pg.screenshot({path:OUT+'/../screenshots/raw/cl-em04r-x.png'});return R;}R.sentAt=new Date().toISOString().slice(11,19);await send.click();await PW(10000);
 R.replies=((((await api('GET','/desk/tickets/'+t.id+'/replies')).j||{}).data)||[]).map(x=>x.direction+' '+x.status+' '+String(x.created_at).slice(11,19)+' '+x.subject);LED('CL EM-04 rerun agent reply sent');
 await pg.screenshot({path:OUT+'/../screenshots/raw/cl-em04r-2-replied.png'});return R;};
