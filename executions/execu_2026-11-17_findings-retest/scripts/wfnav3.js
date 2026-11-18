await page.goto(H+'/settings/automation/workflow-rules',{waitUntil:'commit'});
await page.getByText('Workflow Rules').first().waitFor({timeout:150000});await sleep(5000);
const hits=await page.evaluate(()=>{const out=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_ELEMENT);let n;while(n=w.nextNode()){const t=(n.getAttribute('aria-label')||'')+' '+(n.getAttribute('title')||'')+' '+(n.getAttribute('href')||'')+' '+(n.getAttribute('data-tooltip')||'');if(/execution|histor/i.test(t))out.push(n.outerHTML.slice(0,250));}return out;});log('attr hits',hits);
const txt=await page.evaluate(()=>document.body.innerText);const i=txt.search(/AUTOMATION/i);log('automation section',txt.slice(i,i+500).replace(/\n+/g,' | '));
log('exec text?',/execution/i.test(txt));
