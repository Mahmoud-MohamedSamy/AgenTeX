// EM-04 Gmail rerun step 3: customer reply must land on #2661; no new ticket.
module.exports=async()=>{const R={};const PW=ms=>pg.waitForTimeout(ms);const ID='8e62087e-ecb0-41cc-8293-8d7c68fda7af';const S='QA EM-04 Gmail rerun';
 const m=s=>String(s).replace(/([A-Za-z0-9._%+-]{2})[A-Za-z0-9._%+-]*@(?!help-staging)/g,'$1***@');
 const reps=async()=>((((await api('GET','/desk/tickets/'+ID+'/replies')).j||{}).data)||[]).map(x=>({dir:x.direction,at:String(x.created_at).slice(11,19),subject:x.subject}));
 const t0=Date.now();while(Date.now()-t0<360000){R.replies=await reps();if(R.replies.filter(x=>x.dir==='inbound').length>=2)break;await W(20000);}
 R.tickets=arr(((await api('GET','/modules/'+T+'/records?q='+encodeURIComponent(S)+'&per_page=20')).j||{}).data).map(fl).filter(o=>String(o.subject||'').includes(S)).map(o=>o.ticket_number+' '+o.subject);
 const a=((await api('GET','/desk/tickets/'+ID+'/activity')).j||{}).data||[];R.act=a.filter(x=>/message/.test(x.action)).map(x=>x.occurred_at.slice(11,19)+' '+x.action+' '+m(JSON.stringify(x.summary)).slice(0,160));
 await pg.setViewportSize({width:1600,height:1000});for(let k=0;k<3;k++){try{await pg.goto(H+'/views/all/tickets/'+ID,{waitUntil:'commit',timeout:60000});}catch(e){continue;}if(await pg.waitForFunction(()=>/Ticket Owner/.test(document.body.innerText),null,{timeout:60000}).then(()=>true).catch(()=>false))break;}await PW(6000);
 await pg.screenshot({path:OUT+'/../screenshots/raw/cl-em04r-3-reply-in.png'});R.conv=((await pg.innerText('body')).match(/\d+ CONVERSATION/i)||[''])[0];return R;};
