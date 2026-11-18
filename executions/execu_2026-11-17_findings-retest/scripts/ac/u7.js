const IDS=JSON.parse(require('fs').readFileSync('ac/ids.json','utf8'));
await page.goto(H+'/views/all/tickets/'+IDS.T2,{waitUntil:'domcontentloaded'}); await sleep(12000);
log('before',(await text()).includes('QA RT21 AC A2')); await shot('A2-1-c-open-before.png');
log('mv',require('child_process').execSync('bash ac/run.sh o ac/a2mv.js').toString().trim());
for(const w of [5000,10000,15000]){await sleep(w); const t=await text(); log('t+'+w, t.match(/[^\n]*(moved|not available|department|stay)[^\n]*/gi)?.slice(0,6));}
await shot('A2-2-c-after-move.png');
// try clicking in page (e.g. add comment) to trigger refetch
await page.reload({waitUntil:'domcontentloaded'}); await sleep(10000); log('reload',(await text()).match(/[^\n]*(moved|not available|allowed)[^\n]*/gi)?.slice(0,4)); await shot('A2-3-c-after-reload.png');
