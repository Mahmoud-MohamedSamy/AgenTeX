const R={};
await wiz('QA RT18 WF 2948 pattern');await openCond();
await setCond(0,'Subject','starts with','QA RT18 WF 2948 ');
for(const [i,v] of [[1,'alpha'],[2,'beta']]){await clk(main.getByRole('button',{name:'Add condition'}).last());await sleep(700);await setCond(i,'Subject','contains',v);}
R.c=(await main.innerText()).split('CONDITION')[1]?.slice(0,500).replace(/\s+/g,' ');
const ep=main.getByText(/Edit Pattern/i).first();R.ep=await ep.count();
if(R.ep){await clk(ep);await sleep(1000);
 const box=page.locator('input[placeholder*="1"], input[aria-label*="attern"], textarea[aria-label*="attern"]').last();R.box=await box.count();
 if(!R.box){R.inputs=await page.locator('input:visible').evaluateAll(a=>a.map(x=>x.placeholder+'|'+x.getAttribute('aria-label')+'|'+x.value));}
 const b=R.box?box:page.locator('input:visible').filter({hasNot:page.locator('xx')}).last();
 R.patternBefore=await b.inputValue().catch(()=>null);
 await b.fill('1 and 2');await sleep(1200);
 R.after=(await main.innerText()).split('CONDITION')[1]?.slice(0,700).replace(/\s+/g,' ');
 const ap=page.getByRole('button',{name:/^Apply$/}).last();R.applyDisabled=await ap.isDisabled().catch(e=>'?'+e.message.slice(0,60));
 await shot('2948-1-pattern-1-and-2.png');
 await b.fill('1 and 2 and 3');await sleep(1000);R.apply3Disabled=await ap.isDisabled().catch(()=>'?');
 R.after3=(await main.innerText()).split('CONDITION')[1]?.slice(0,500).replace(/\s+/g,' ');
 await b.fill('(1 or 2)');await sleep(1000);R.applyOrDisabled=await ap.isDisabled().catch(()=>'?');R.afterOr=(await main.innerText()).match(/Condition 3[^.]*\./)?.[0];
 await b.fill('1 and 2 and 3 and 4');await sleep(1000);R.after4=(await main.innerText()).match(/[^.]*condition 4[^.]*\./i)?.[0];
 await b.fill('1 and 2');await sleep(800);
 await shot('2948-2-pattern-msg.png');
}
return R;
