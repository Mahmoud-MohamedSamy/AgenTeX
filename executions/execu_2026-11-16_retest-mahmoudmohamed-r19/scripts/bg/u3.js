const M=process.env.MODE;const RAWP='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/bg/ev/d3-'+M+'.csv';
const T0='88e8ea44-1658-4df3-9930-d0902b91073d';
const body0=async()=>(await page.innerText('body').catch(()=>'')).replace(/\s+/g,' ');
const clk=async re=>{const b=page.getByRole('button',{name:re}).last();await b.click({timeout:15000});await sleep(5000);};
await page.setViewportSize({width:1600,height:1100});
await page.goto(H+'/settings/data/import?module='+T0,{waitUntil:'commit'});for(let i=0;i<30;i++){await sleep(3000);if(/Start import|Start over/i.test(await body0()))break;}
const so=page.getByRole('button',{name:/^Start over$/});if(await so.count()){log('start over');await so.first().click();await sleep(5000);}
await page.locator('input[type=file]').last().setInputFiles(RAWP,{timeout:20000});await sleep(6000);
await clk(/^Next$/);await clk(/^Next$/);await shot('BUG-d3-'+M+'-1-map.png');await clk(/^Next$/);
if(M==='auto'){await page.getByRole('checkbox').first().check({timeout:8000}).catch(async()=>{await page.getByText('Trigger automation and process management').click();});await sleep(800);}
log('auto checked',await page.getByRole('checkbox').first().isChecked().catch(()=>'?'));
await shot('BUG-d3-'+M+'-2-assign.png');
await clk(/^Save & next$/);
await page.getByText('I confirm I have permission').click({timeout:10000});await sleep(800);const sb=page.getByRole('button',{name:/^Submit$/}).last();const t1=Date.now();while(Date.now()-t1<30000&&await sb.isDisabled().catch(()=>true))await sleep(1500);
await shot('BUG-d3-'+M+'-3-review.png');
await sb.click({timeout:15000});const t0=Date.now();let tt='';while(Date.now()-t0<150000){await sleep(4000);tt=await body0();if(/Import complete|completed|records? created|Undo import/i.test(tt.slice(-1200))&&!/Queued|Processing|Importing/i.test(tt.slice(-400)))break;}
await sleep(3000);log('result',tt.slice(-700));await shot('BUG-d3-'+M+'-4-result.png',{fullPage:true});
return 'ok';
