const id='1ca764d4-2dfb-40dc-99ba-3ea6e2fd081f'; const st={}; const rq=[];
page.on('response',r=>{ if(/\/notes|timeline/.test(r.url())) rq.push(r.status()+' '+r.url().replace(/^.*api\/v1/,'').slice(0,120)); });
await page.goto(H+'/modules/'+T.LEADS+'/records/'+id,{waitUntil:'commit',timeout:120000});
for(let i=0;i<60;i++){ await sleep(3000); const t=await text(); if(t.includes('QA RT r10 1948 note by U1')) { st.noteAfterSec=(i+1)*3; break; } }
await sleep(3000); const t=await text(); st.noteShown=t.includes('QA RT r10 1948 note by U1'); st.notesHdr=(t.match(/\d+ total notes?|No notes yet/)||[])[0];
const n=page.getByText('QA RT r10 1948 note by U1').first(); if(await n.count()){ await n.scrollIntoViewIfNeeded(); await sleep(1000);} await shot('1948-u1-reload.png');
await page.getByText('Timeline',{exact:true}).first().click().catch(()=>{}); await sleep(6000); await shot('1948-u1-timeline-tab.png'); st.timelineTab=(await text()).match(/Timeline[\s\S]{0,300}/g)?.slice(-1)[0].replace(/\s+/g,' ').slice(0,250);
st.rq=rq; return st;
