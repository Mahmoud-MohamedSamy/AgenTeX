// node crop.js  — crops today's screenshots into evidence/raw (originals untouched)
const path=require('path'),fs=require('fs');const {chromium}=require('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/node_modules/playwright-core');
const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog';
const J=[['2174-10c-by-dept-layout.png','t-10-by-dept.png',[285,570,1300,250]],['2174-10j-new-ticket-status-opts.png','t-10-new-ticket.png',[420,430,1000,310]],
['2174-06b-bulk-sorted.png','t-06-picklist.png',[1140,120,460,520]],['2174-07c-round-off-set.png','t-07-rounding.png',[1140,120,460,240]],
['2174-08b-lookup-filter-set.png','t-08-lookup.png',[1140,480,460,240]],['2174-12b-default-set.png','t-12-default.png',[1140,120,460,160]]];
(async()=>{const b=await chromium.launch({headless:true,channel:'msedge',args:['--disable-gpu']});const p=await b.newPage({viewport:{width:1600,height:900}});
for(const [src,out,[x,y,w,h]] of J){const d='data:image/png;base64,'+fs.readFileSync(path.join(R,'screenshots',src)).toString('base64');
 await p.setContent(`<body style="margin:0"><img src="${d}" style="display:block">`,{waitUntil:'load'});await p.screenshot({path:path.join(R,'evidence/raw',out),clip:{x,y,width:w,height:h}});console.log(out);}
await b.close();})();
