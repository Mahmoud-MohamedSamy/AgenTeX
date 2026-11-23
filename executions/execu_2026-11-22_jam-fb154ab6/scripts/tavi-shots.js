// read-only: navigate + screenshot + element boxes
const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-22_jam-fb154ab6/evidence/raw/';
const H='https://ndc-crm.anyware.software';
const pages=[['wf','/settings/automation/workflow-rules','Send Email to Manager'],['ar','/settings/automation/assignment-rules','Assign New Lead'],['act','/settings/automation/actions','Send Mail'],['ap','/settings/process-management/approval-processes','Add New Company'],['rp','/settings/process-management/review-processes','Review Leads Info']];
const out={};
const boxes=async()=>p.evaluate(()=>{const r=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){if(/a26a20be/.test(n.textContent)){const e=n.parentElement;const b=e.getBoundingClientRect();if(b.width>0)r.push([Math.round(b.left),Math.round(b.top),Math.round(b.right),Math.round(b.bottom)]);}}return r;});
const named=async(name)=>p.evaluate((nm)=>{const r=[];document.querySelectorAll('body *').forEach(e=>{if(e.children.length===0&&e.textContent.trim()===nm){const b=e.getBoundingClientRect();if(b.width>0)r.push([Math.round(b.left),Math.round(b.top),Math.round(b.right),Math.round(b.bottom)]);}});return r;},name);
for(const [k,u,nm] of pages){await p.goto(H+u,{waitUntil:'domcontentloaded'});for(let i=0;i<40;i++){await sleep(1000);const t=await p.innerText('body').catch(()=>'');if(t.includes(nm)&&!/Loading/i.test(t))break;}await sleep(2500);
 await p.screenshot({path:R+'tavi-'+k+'-list.png'});out[k]={idBoxes:await boxes(),nameBoxes:await named(nm),url:p.url()};
 const nb=out[k].nameBoxes[0];
 if(nb){await p.mouse.click((nb[0]+nb[2])/2,(nb[1]+nb[3])/2);await sleep(5000);await p.screenshot({path:R+'tavi-'+k+'-detail.png'});out[k].detailIdBoxes=await boxes();out[k].detailUrl=p.url();}
}
return out;
