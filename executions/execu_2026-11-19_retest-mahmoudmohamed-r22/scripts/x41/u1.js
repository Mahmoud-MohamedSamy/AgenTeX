const R={};const id='b5e0b71b-8f6e-462d-8491-a804ccc483cb';
await page.goto(H+'/modules/0924eb24-e42a-4eab-8efd-e3428f19e882/records/'+id,{waitUntil:'commit'});
for(let i=0;i<30;i++){await sleep(2000);if(/dept only renamed/.test(await text()))break;}await sleep(3000);
await shot('2841-r3-1-contract.png');
const t=(await text()).replace(/\s+/g,' ');R.top=t.slice(t.indexOf('QA RT20 X41'),t.indexOf('QA RT20 X41')+900);
R.buttons=(await page.getByRole('button').allInnerTexts()).map(x=>x.trim()).filter(Boolean).slice(0,40);
return R;
