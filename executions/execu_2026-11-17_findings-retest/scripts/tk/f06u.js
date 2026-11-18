const cfg=JSON.parse(fs.readFileSync(RUN+'/scripts/tk/cfg.json','utf8'));const ID=cfg.f06[0];
await page.goto(H+'/modules/0924eb24-e42a-4eab-8efd-e3428f19e882/records/'+ID,{waitUntil:'domcontentloaded'});
for(let i=0;i<30;i++){await sleep(2000);if(/QA RT21 TK F06 Contract 1/.test(await text()))break;}await sleep(3000);
const d=page.getByText('Department',{exact:true}).first();await d.scrollIntoViewIfNeeded().catch(()=>{});await sleep(1200);
const bx=async re=>{const l=page.getByText(re).first();return await l.boundingBox().catch(()=>null);};
log('deptLabel',JSON.stringify(await bx(/^Department$/)),'deptVal',JSON.stringify(await bx(/^QA RT19 SLA Dept B$/)),'plan',JSON.stringify(await bx(/^QA RT20 BS Plan 2841 A w2pv$/)));
const em=await page.locator('text=/[\w.+-]+@[\w-]+\.[\w.]+/').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return [Math.round(r.x),Math.round(r.y),Math.round(r.right),Math.round(r.bottom)];}));log('emails',JSON.stringify(em));
const t=(await text()).replace(/\s+/g,' ');log('dept',t.match(/Department.{0,60}/)?.[0]);log('plan',(t.match(/Support Plan.{0,120}/g)||[]).slice(0,3).join(' || ').replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g,'<addr>'));
await shot('F06-1-tavi-record.png');
