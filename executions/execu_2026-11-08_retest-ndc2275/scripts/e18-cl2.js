// Checklist 10 Nov: EM-03 agent reply from Customer Support to mmohamed@anyware.software (user's own mailbox, as on 9 Nov).
module.exports=async()=>{const R={};const CS='7e1ac409-58b0-41ab-97e1-0e7d5c8c5158';const RAW=OUT+'/../screenshots/raw/cl-em03-';const PW=ms=>pg.waitForTimeout(ms);
 const m=s=>String(s).replace(/([A-Za-z0-9._%+-]{2})[A-Za-z0-9._%+-]*@(?!help-staging)/g,'$1***@');
 const enc=v=>v===null?{kind:'null'}:{kind:'string',value:v};const body=vals=>({data:Object.entries(vals).map(([f,v])=>({field:f,value:enc(v)}))});
 const hhmm=new Date(Date.now()+2*3600e3).toISOString().slice(11,16);const subj='QA EM-03 agent reply '+hhmm+' Cairo';
 const EX=process.env.EXID;if(!EX)return{STOP:'set EXID (ticket already created)'};const id=EX;R.id=id;
 const rec=fl((await api('GET','/modules/'+T+'/records/'+id)).j.data);R.no=rec.ticket_number;R.subject=rec.subject;
 await pg.setViewportSize({width:1600,height:1000});
 for(let k=0;k<3;k++){try{await pg.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit',timeout:60000});}catch(e){R['goto'+k]='timeout';continue;}const ok=await pg.waitForFunction(()=>/Ticket Owner/.test(document.body.innerText),null,{timeout:60000}).then(()=>true).catch(()=>false);await PW(5000);R['load'+k]=ok;if(ok)break;}
 const rb=pg.getByRole('button',{name:/^Reply( All)?$/}).first();if(!(await rb.count())){R.stop='no Reply button';await pg.screenshot({path:RAW+'noreply.png'});return R;}
 await rb.click();await PW(4000);const txt=(await pg.innerText('body')).replace(/\s+/g,' ');
 R.composeFrom=m((txt.match(/From .{0,90}/)||[''])[0]);R.toOk=/mmohamed@anyware\.software/.test(txt);R.fromCS=/customer-support@help-staging/.test(txt);
 if(!R.toOk){R.stop='To is not the expected mailbox';await pg.screenshot({path:RAW+'0-compose.png'});return R;}
 const ed=pg.locator('[contenteditable=true]').last();await ed.click({position:{x:30,y:12}});await pg.keyboard.press('Control+Home');await pg.keyboard.type('QA EM-03 agent reply. Test from the TAVI QA checklist, 10 Nov 2026. You can reply to this email to test EM-05.');await PW(1500);
 await pg.screenshot({path:RAW+'1-compose.png'});
 let send=null;const cands=pg.getByRole('button',{name:/^Send$/});const n=await cands.count();R.sendCands=n;for(let i=0;i<n;i++){const c=cands.nth(i);if(await c.isVisible().catch(()=>false)&&!(await c.isDisabled().catch(()=>true))){send=c;}}if(!send){R.stop='Send disabled';R.sendHtml=await pg.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>/^s*Sends*$/.test(b.innerText)).map(b=>b.outerHTML.slice(0,400)));await pg.waitForTimeout(5000);R.disabledAfter5s=await cands.first().isDisabled().catch(()=>'?');if(R.disabledAfter5s===false)send=cands.first();else{await pg.screenshot({path:RAW+'1b-send-disabled.png'});R.composerText=m((await pg.locator('[data-testid*=composer]').first().innerText().catch(()=>'')).replace(/s+/g,' ').slice(0,600));R.testids=await pg.evaluate(()=>[...document.querySelectorAll('[data-testid^=desk-composer]')].map(e=>e.dataset.testid+(e.disabled?'(dis)':'')).slice(0,40));return R;}}
 R.sentAt=new Date().toISOString().slice(11,19)+' UTC';await send.click();await PW(10000);await pg.screenshot({path:RAW+'2-after-send.png'});
 const t0=Date.now();let rs=[];while(Date.now()-t0<90000){rs=(await api('GET','/desk/tickets/'+id+'/replies')).j.data||[];if(rs.some(x=>/sent|delivered/i.test(String(x.status||x.delivery_status))))break;await W(15000);}
 R.replies=rs.map(x=>({dir:x.direction,status:x.status||x.delivery_status,from:m(JSON.stringify(x.from||x.from_address||'')).slice(0,70),to:m(JSON.stringify(x.to||x.to_addresses||'')).slice(0,70),subject:x.subject}));LED('CL EM-03 reply sent on #'+R.no+' to mmohamed@anyware.software');
 await pg.reload({waitUntil:'commit'});await pg.waitForFunction(()=>/Ticket Owner/.test(document.body.innerText),null,{timeout:60000}).catch(()=>{});await PW(5000);await pg.screenshot({path:RAW+'3-ticket-sent.png'});
 return R;};
