// env TID, TAG, SUBJ, FIND (regex to scroll to): open ticket, History tab, shot. Returns History text.
const TID=process.env.TID,TAG=process.env.TAG;
await page.goto(H+'/views/all/tickets/'+TID,{waitUntil:'domcontentloaded'});
await page.getByText(process.env.SUBJ).first().waitFor({timeout:90000}).catch(()=>{});await sleep(5000);
const tab=page.getByRole('tab',{name:/History/i}).first();if(await tab.count())await tab.click();else await page.getByText(/^History$/).first().click();
for(let i=0;i<30;i++){await sleep(3000);if(!/Loading the history/.test(await text()))break;}await sleep(1500);
if(process.env.FIND&&!process.env.NOSCROLL){const f=page.getByText(new RegExp(process.env.FIND)).first();if(await f.count()){await f.scrollIntoViewIfNeeded();await sleep(800);const bb=await f.boundingBox();log('find box '+JSON.stringify(bb));}else log('FIND not found');}
await shot(TAG+'-history.png');
const ht=(await text()).replace(/\s+/g,' ');const hi=ht.search(/History/);
return {history:ht.slice(hi,hi+3000)};
